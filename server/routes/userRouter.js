/* eslint-disable function-paren-newline */
const express = require('express');

const UserController = require('../controllers/UserController.js');
const CookieController = require('../controllers/CookieController.js');
const SessionController = require('../controllers/SessionController.js');

const router = express.Router();

// POST request to add user
router.post(
  '/signup',
  UserController.createUser,
  CookieController.setSSIDCookie,
  SessionController.startSession,
  (req, res, next) => {
    console.log('new user in express ', res.locals.newUser);
    return res.status(200).json({ ...res.locals.newUser, id: res.locals.ssid });
  }
);

// handle login requests
router.post(
  '/login',
  UserController.verifyUser,
  CookieController.setSSIDCookie,
  SessionController.startSession,
  (req, res, next) => {
    console.log('user logged in ', res.locals.verifiedUser);
    return res.status(200).json({ ...res.locals.verifiedUser, id: res.locals.ssid });
  }
);

// check for session on componentDidMount
router.get('/checksession', SessionController.isLoggedIn, (req, res, next) => {
  // 200 response will provide client with user email
  console.log('session found ');
  if (!res.locals.verifiedUser) return res.status(200).json({ isLoggedIn: false });
  return res.status(200).json({ ...res.locals.verifiedUser, isLoggedIn: true });
});

// GET all items that user has posted
router.get('/:user_id', UserController.getUserItems, (req, res, next) => {
  // console.log('res.locals.items', res.locals.items);
  res.status(200).json({ allItems: res.locals.items });
});
// hanlde logout requests
// router.post('/logout', SessionController.endSession, (req, res, next) => {
//   return res.status(200).json({ msg: 'ended session' });

// });

module.exports = router;
