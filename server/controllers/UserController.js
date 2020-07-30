const db = require('../models/Models');
const bcrypt = require('bcryptjs');
const SALT_WORK_FACTOR = 10; // should be at least 10

const UserController = {};

UserController.getUserItems = (req, res, next) => {
  // console.log(`req.params.id`, req.params.user);
  const { user_id } = req.params;
  // console.log('user', user_id);
  console.log('req params in get user items ', user_id);
  const query = `SELECT u._id, u.email, i.*
  FROM users u
  RIGHT OUTER JOIN items i ON u._id=i.user_id
  WHERE u._id=${user_id}`;

  db.query(query, (err, data) => {
    if (err) {
      console.log('ERROR: ', err);
    }
    // if successful, query will return list of itmems that user has posted
    const { rows } = data;
    res.locals.items = rows;
    console.log('Successfully made GET request for all items that user has posted.');
    return next();
  });
};

UserController.createUser = async (req, res, next) => {
  const { userEmail, password, firstName, lastName, zipCode, street, city, state } = req.body;
  try {
    // if user is in database, send res of user exists
    const values = [userEmail];
    const findUser = `SELECT email, password FROM users WHERE email = $1;`;
    const user = await db.query(findUser, values);
  
    if (user.rows[0]) {
      res.locals.user = user.rows[0];
      return next({log: `${userEmail} already exists`});
    }
    // create address in db
    const createAddressQuery = {
      text: 'INSERT INTO public.address(zipcode, street, city, state) VALUES($1, $2, $3, $4) RETURNING *',
      values: [zipCode, street, city, state],
    };

    const address = await db.query(createAddressQuery);

    // hash the provided password with brcrypt before insertion into db
    bcrypt.hash(password, SALT_WORK_FACTOR, async (err, hash) => {
      try {
        if (err) return next(err);
        let hashedPassword = hash;

        // create user, use incoming address_id
        const createUserQuery = {
          text:
            'INSERT INTO public.users("email", "firstName", "lastName", "password", "address_id") VALUES($1, $2, $3, $4, $5) RETURNING *',
          values: [userEmail, firstName, lastName, hashedPassword, address.rows[0]._id],
        };

        // create new user and pass to res.locals (without hashed password)
        let newUser = await db.query(createUserQuery);
        res.locals.newUser = Object.keys(newUser.rows[0]).reduce((acc, curr) => {
          if (curr !== 'password') acc[curr] = newUser.rows[0][curr];
          return acc;
        }, {});

        return next();
      } catch (e) {
        return next(e);
      }
    });

    // res.status(200).json({ user: newUser.rows[0], adress: address.rows[0] });

    // res.redirect('/login')
  } catch (e) {
    return next(e);
    // console.log(e);
    // res.redirect('/register')
  }
};

UserController.verifyUser = async (req, res, next) => {
  const { userEmail, password } = req.body;

  const findUserQuery = `
    SELECT u._id, u.email, u."firstName", u."lastName", u."password", u."points", a."zipcode", a."street", a."city", a."state"
    FROM users u
    INNER JOIN address a ON u.address_id=a._id WHERE email = $1;`;
  const values = [userEmail];
  try {
    const user = await db.query(findUserQuery, values);

    // query database for user and store in res.locals (without hashed password)
    let verifiedUser = await db.query(findUserQuery, values);
    res.locals.verifiedUser = Object.keys(verifiedUser.rows[0]).reduce((acc, curr) => {
      if (curr !== 'password') acc[curr] = verifiedUser.rows[0][curr];
      return acc;
    }, {});

    bcrypt.compare(password, user.rows[0].password, (err, result) => {
      if (err) return next(err);
      return result ? next() : next({ log: 'Incorrect password' });
    });
  } catch (e) {
    return next({ log: 'Error returned, invalid username' });
  }
};

module.exports = UserController;
