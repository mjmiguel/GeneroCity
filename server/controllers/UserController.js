const db = require('../models/Models');
const bcrypt = require('bcryptjs');
const SALT_WORK_FACTOR = 10 // should be at least 10

const UserController = {};

UserController.getUserItems = (req, res, next) => {
  // console.log(`req.params.id`, req.params.user);
  console.log(req.body)
  const { user_id } = req.params;
  // console.log('user', user_id);

  const query = `SELECT u._id, u.email, I.*
  FROM public.users u
  RIGHT OUTER JOIN public.items i ON u._id=i.user_id
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
  console.log('req body in create ', req.body)
  const { userEmail, password, firstName, lastName, zipCode, street, city, state } = req.body;
  try {
    // if user is in database, send res of user exists
    const findUser = `SELECT email, password FROM users WHERE (email = '${userEmail}');`;
    const user = await db.query(findUser);
    console.log('found user ', user.rows[0])
    if (user.rows[0]) return res.status(200).send(`${userEmail} already exists`);

    // create address in db
    const createAddressQuery = {
      text:
        'INSERT INTO public.address(zipcode, street, city, state) VALUES($1, $2, $3, $4) RETURNING *',
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
    
        let newUser = await db.query(createUserQuery);

        res.locals.newUser = newUser.rows[0];
        return next();
      } catch(e) {
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
  const findUserQuery = {
    text: `
    SELECT u._id, u.email, u.password, a.street, a.city, a.state, a.zipcode
    FROM users u
    INNER JOIN address a ON u.address_id=a._id WHERE email = VALUES($1);`,
    values: [userEmail, password]
  };
  try {
    const user = await db.query(findUserQuery);
    res.locals.verifiedUser = user.rows[0];
    bcrypt.compare(password, user.rows[0].password, (err, result) => {
      if (err) return next(err);
      return (result ? next() : next({ log: 'Incorrect password' }))
    });
  } catch (e) {
    return next({ log: 'Error returned, invalid username' });
  }
};

module.exports = UserController;
