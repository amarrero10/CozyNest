const express = require("express");
const bcrypt = require("bcryptjs");
const { Sequelize } = require("sequelize");
const { Op } = require("sequelize");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { Review, Image, User, Spot, Booking } = require("../../db/models");

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
router.post("/signup", validateSignup, async (req, res) => {
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
    avgRating: spot.avgRating,
    previewImage: spot.previewImage,
  }));

  res.status(200).json({ Spots: formattedSpots });
});

// Get reviews by Current User
router.get("/current/reviews", requireAuth, async (req, res) => {
  const currentUser = req.user;

  const reviews = await Review.findAll({
    where: {
      userId: currentUser.id,
    },
    include: [
      {
        model: User,
        attributes: ["id", "firstName", "lastName"],
      },
      {
        model: Spot,
        attributes: [
          "id",
          "ownerId",
          "address",
          "city",
          "state",
          "country",
          "lat",
          "lon",
          "name",
          "price",
          "previewImage",
        ],
      },
      {
        model: Image,
        as: "ReviewImages",
        where: {
          imageableType: "review",
        },
        required: false, // Use `required: false` to perform a LEFT JOIN
        attributes: ["id", "url"],
      },
    ],
  });
  res.status(200).json({ Reviews: reviews });
});

// Get review by current user based on review id
router.get("/current/reviews/:id", requireAuth, async (req, res) => {
  const currentUser = req.user;
  const reviewId = req.params.id;

  try {
    const review = await Review.findOne({
      where: {
        id: reviewId,
        userId: currentUser.id,
      },
      include: [
        {
          model: User,
          attributes: ["id", "firstName", "lastName"],
        },
        {
          model: Spot,
          attributes: [
            "id",
            "ownerId",
            "address",
            "city",
            "state",
            "country",
            "lat",
            "lon",
            "name",
            "price",
            "previewImage",
          ],
        },
        {
          model: Image,
          as: "ReviewImages",
          attributes: ["id", "url"],
        },
      ],
    });

    if (!review) {
      return res.status(404).json({ message: "Review couldn't be found" });
    }

    res.status(200).json(review);
  } catch (error) {
    console.error("Error fetching review:", error);
    res.status(500).json({ message: "Error fetching review" });
  }
});

// Add Image to review based on review id as current user
router.post("/current/reviews/:id/images", requireAuth, async (req, res) => {
  const currentReview = parseInt(req.params.id, 10);
  const currentUser = req.user;
  const { url } = req.body;

  const review = await Review.findOne({
    where: {
      id: currentReview,
      userId: currentUser.id,
    },
    include: [
      {
        model: Image,
        as: "ReviewImages",
      },
    ],
  });

  if (!review) {
    return res.status(404).json({ message: "Review could not be found." });
  }

  const imageCount = await Image.count({
    where: {
      imageableType: "review",
      imageableId: currentReview,
    },
  });

  if (imageCount >= 10) {
    return res
      .status(403)
      .json({ message: "Maximum number of images for this review was reached" });
  }

  // Create a new image for the review
  const newImage = await Image.create({
    imageableId: currentReview,
    imageableType: "review",
    url,
  });

  res.status(200).json(newImage);
});

// Edit a Review as Current User
router.put("/current/reviews/:id", requireAuth, async (req, res) => {
  const { review, stars } = req.body;
  const currentUser = req.user;
  const currentReview = req.params.id;

  const currReview = await Review.findOne({
    where: {
      id: currentReview,
      userId: currentUser.id,
    },
  });

  if (!currReview) return res.status(404).json({ message: "Review could not be found." });

  await currReview.update({
    review,
    stars,
  });

  res.status(200).json(currReview);
});

// Get all bookings of Current User
router.get("/current/bookings", requireAuth, async (req, res) => {
  const currentUser = req.user;
  const bookings = await Booking.findAll({
    where: {
      userId: currentUser.id,
    },
    include: {
      model: Spot,
      attributes: [
        "id",
        "ownerId",
        "address",
        "city",
        "state",
        "country",
        "lat",
        "lon",
        "name",
        "price",
        "previewImage",
      ],
    },
  });

  res.status(200).json(bookings);
});

// Edit a booking as the current user
router.put("/current/bookings/:id", requireAuth, async (req, res) => {
  const bookingId = req.params.id; // Get the bookingId from the route parameters
  const { startDate, endDate } = req.body; // Get the updated start and end dates from the request body

  // Find the booking by its ID
  const booking = await Booking.findByPk(bookingId);

  // Check if the booking exists
  if (!booking) {
    return res.status(404).json({ message: "Booking couldn't be found" });
  }

  // Check if the booking belongs to the current user (authorization)
  if (booking.userId !== req.user.id) {
    return res.status(403).json({ message: "Unauthorized to edit this booking" });
  }

  // Check if the booking's end date has already passed
  if (new Date(booking.endDate) < new Date()) {
    return res.status(403).json({ message: "Past bookings can't be modified" });
  }

  // Check if there is a booking conflict with the specified dates
  const conflictingBooking = await Booking.findOne({
    where: {
      spotId: booking.spotId,
      id: { [Sequelize.Op.not]: bookingId }, // Exclude the current booking from the query
      startDate: { [Sequelize.Op.lte]: endDate },
      endDate: { [Sequelize.Op.gte]: startDate },
    },
  });

  if (conflictingBooking) {
    return res.status(403).json({
      message: "Sorry, this spot is already booked for the specified dates",
      errors: {
        startDate: "Start date conflicts with an existing booking",
        endDate: "End date conflicts with an existing booking",
      },
    });
  }

  // Update the booking with the new start and end dates
  booking.startDate = startDate;
  booking.endDate = endDate;
  await booking.save();

  // Return the updated booking
  return res.status(200).json(booking);
});

// Delete a Booking
router.delete("/current/bookings/:id", requireAuth, async (req, res) => {
  const bookingId = req.params.id;
  const currentUser = req.user;

  try {
    // Find the booking by its ID
    const booking = await Booking.findByPk(bookingId);

    // Check if the booking exists
    if (!booking) {
      return res.status(404).json({ message: "Booking couldn't be found" });
    }

    // Check if the booking belongs to the current user or the spot belongs to the current user (authorization)
    if (booking.userId !== currentUser.id && booking.spot.ownerId !== currentUser.id) {
      return res.status(403).json({ message: "Unauthorized to delete this booking" });
    }

    // Check if the booking has already started
    if (new Date(booking.startDate) < new Date()) {
      return res.status(403).json({ message: "Bookings that have been started can't be deleted" });
    }

    // Delete the booking
    await booking.destroy();

    return res.status(200).json({ message: "Successfully deleted" });
  } catch (error) {
    console.error("Error deleting booking:", error);
    return res.status(500).json({ message: "Error deleting booking" });
  }
});

module.exports = router;
