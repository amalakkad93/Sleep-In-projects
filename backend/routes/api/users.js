// backend/routes/api/users.js
const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Booking, Spot, SpotImage, User } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

const errorAuth = function (err, req, res, next) {
  res.status(401);
  res.setHeader('Content-Type','application/json')
  res.json(
      {
          message: "Authentication required"
      }
  );
};

const validateSignup = [
  check('email')
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage('Please provide a valid email.'),
  check('username')
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage('Please provide a username with at least 4 characters.'),
  check('username')
    .not()
    .isEmail()
    .withMessage('Username cannot be an email.'),
  check('password')
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage('Password must be 6 characters or more.'),
  handleValidationErrors
];

// Sign up
// router.post('/', validateSignup, async (req, res) => {
//     const {firstName, lastName, email, password, username } = req.body;
//     const hashedPassword = bcrypt.hashSync(password);
//     const user = await User.create({ firstName, lastName, email, username, hashedPassword });

//     const safeUser = {
//       id: user.id,
//       firstName: user.firstName,
//       lastName: user.lastName,
//       email: user.email,
//       username: user.username,
//     };

//     await setTokenCookie(res, safeUser);

//     return res.json({
//       user: safeUser
//     });
//   });
router.post('/', validateSignup, async (req, res) => {
  const {firstName, lastName, email, password, username } = req.body;
  const hashedPassword = bcrypt.hashSync(password);

  try {
      const user = await User.create({ firstName, lastName, email, username, hashedPassword });

      const safeUser = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
      };

      await setTokenCookie(res, safeUser);

      return res.json({
        user: safeUser
      });
  } catch (error) {
      // Handle errors e.g. unique constraint violations
      if (error.name === 'SequelizeUniqueConstraintError') {
          return res.status(400).json({
              errors: {
                  username: 'Username must be unique.',
                  // email: 'The provided email is invalid.'
              }
          });
      }

      // Return a generic server error
      return res.status(500).json({ message: 'Internal server error' });
  }
});

// Route to get all bookings for a specific user
router.get('/:userId/bookings', requireAuth, async (req, res, next) => {
  if (req.user.id !== parseInt(req.params.userId, 10)) {
      return res.status(403).json({
          message: "Forbidden access. You can only access your own bookings."
      });
  }

  try {
      const bookings = await Booking.findAll({
          where: { userId: req.params.userId },
          include: [{
              model: Spot,
              include: [{
                  model: SpotImage,
                  attributes: ['url', 'preview'],
                  // where: { preview: true },
                  // required: false
              }]
          }],
          order: [['startDate', 'ASC']]
      });

      if (!bookings || bookings.length === 0) {
          return res.status(404).json({
              message: "No bookings found for the user."
          });
      }

      res.json({ Bookings: bookings });
  } catch (error) {
      next(error);
  }
});


module.exports = router;
