const express = require("express");
const bcrypt = require("bcryptjs");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { User, Spot } = require("../../db/models");

const router = express.Router();

const validateSignup = [
  check("email")
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage("Please provide a valid email."),
  check("username")
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage("Please provide a username with at least 4 characters."),
  check("username").not().isEmail().withMessage("Username cannot be an email."),
  check("password")
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage("Password must be 6 characters or more."),
  check("firstName")
    .exists({ checkFalsy: true })
    .isLength({ min: 3 })
    .withMessage("Please provide a first name with at least 3 characters."),
  check("lastName")
    .exists({ checkFalsy: true })
    .isLength({ min: 3 })
    .withMessage("Please provide a last name with at least 3 characters."),
  handleValidationErrors,
];

// Sign up
router.post("/", validateSignup, async (req, res) => {
  const { email, password, username, firstName, lastName } = req.body;
  const hashedPassword = bcrypt.hashSync(password);
  const user = await User.create({ email, username, hashedPassword, firstName, lastName });

  const safeUser = {
    id: user.id,
    email: user.email,
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
  };

  await setTokenCookie(res, safeUser);

  return res.json({
    user: safeUser,
  });
});

// GET Current User
router.get("/current", requireAuth, async (req, res) => {
  // console.log("REQ>USER", req.user);
  const user = req.user; // Assuming the authenticated user information is stored in the req.user property

  if (user) {
    const safeUser = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      username: user.username,
    };

    return res.status(200).json({ user: safeUser });
  } else {
    return res.json({ user: null });
  }
});

// Get user by ID
router.get("/:id", async (req, res) => {
  const userId = req.params.id;
  const user = await User.findByPk(userId);
  console.log(user);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const safeUser = {
    id: user.id,
    email: user.email,
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
  };

  return res.json(safeUser);
});

// GET all spots owned by current user
router.get("/current/spots", requireAuth, async (req, res) => {
  const currentUser = req.user;

  const spots = await Spot.findAll({
    where: {
      ownerId: currentUser.id,
    },
  });
  const formattedSpots = spots.map((spot) => ({
    id: spot.id,
    ownerId: spot.ownerId,
    address: spot.address,
    city: spot.city,
    state: spot.state,
    country: spot.country,
    lat: spot.lat,
    lon: spot.lon,
    name: spot.name,
    description: spot.description,
    price: spot.price,
    createdAt: spot.createdAt,
    updatedAt: spot.updatedAt,
  }));

  res.status(200).json({ Spots: formattedSpots });
});

module.exports = router;
