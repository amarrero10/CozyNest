const express = require("express");
const { Sequelize } = require("sequelize");
const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { User, Spot, Image, Review, Booking } = require("../../db/models");

const router = express.Router();

const validateSpot = [
  check("address")
    .exists({ checkFalsy: true })
    .withMessage("Street address is required.")
    .isLength({ min: 5 })
    .withMessage("Street address is not valid"),
  check("city").exists({ checkFalsy: true }).isLength({ min: 3 }).withMessage("City is required"),
  check("state")
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage("State is required."),
  check("country")
    .exists({ checkFalsy: true })
    .isLength({ min: 3 })
    .withMessage("Country is required"),
  check("lat").exists({ checkFalsy: true }).isFloat().withMessage("Latitude is not valid"),
  check("lon").exists({ checkFalsy: true }).isFloat().withMessage("Longitude is not valid."),
  check("name")
    .exists({ checkFalsy: true })
    .isLength({ max: 50 })
    .withMessage("Name must be less than 50 characters"),
  check("description")
    .exists({ checkFalsy: true })
    .isLength({ min: 1, max: 1500 })
    .withMessage("Description is required"),
  check("price")
    .exists({ checkFalsy: true })
    .isLength({ min: 1 })
    .withMessage("Price per day is required"),
  handleValidationErrors,
];

// Get Spot by Id
router.get("/:id", async (req, res) => {
  const spotId = parseInt(req.params.id, 10);

  try {
    const spot = await Spot.findByPk(spotId, {
      include: [
        {
          model: User,
          as: "Owner",
          attributes: ["id", "firstName", "lastName"],
        },
        {
          model: Review,
          as: "Reviews",
          attributes: [],
        },
      ],
      attributes: {
        include: [
          [Sequelize.fn("AVG", Sequelize.col("Reviews.stars")), "avgRating"],
          [Sequelize.fn("COUNT", Sequelize.col("Reviews.id")), "numReviews"],
        ],
      },
      group: [
        '"Spot"."id"',
        '"Spot"."ownerId"',
        '"Spot"."address"',
        '"Spot"."city"',
        '"Spot"."state"',
        '"Spot"."country"',
        '"Spot"."lat"',
        '"Spot"."lon"',
        '"Spot"."name"',
        '"Spot"."description"',
        '"Spot"."price"',
        '"Spot"."avgRating"',
        '"Spot"."previewImage"',
        '"Spot"."createdAt"',
        '"Spot"."updatedAt"',
        '"Owner"."id"',
        '"Owner"."firstName"',
        '"Owner"."lastName"',
      ].map((column) => Sequelize.literal(column)),
    });

    if (!spot) {
      return res.status(404).json({ message: "Spot couldn't be found" });
    }

    const { numReviews, ...spotResponse } = spot.toJSON();

    // Check if all spot properties are null
    const allNullProperties = Object.values(spotResponse).every((value) => value === null);

    // If all spot properties are null except 'numReviews', return the error response
    if (allNullProperties && numReviews === 0) {
      return res.status(404).json({ message: "Spot couldn't be found" });
    }

    res.status(200).json({ ...spotResponse, numReviews });
  } catch (error) {
    console.error("Error fetching spot:", error);
    res.status(500).json({ message: "Error fetching spot" });
  }
});

// GET all spots
router.get("/", async (req, res) => {
  const spots = await Spot.findAll({
    include: {
      model: Review,
      as: "Reviews",
      attributes: [],
    },
    attributes: {
      include: [[Sequelize.fn("AVG", Sequelize.col("Reviews.stars")), "avgRating"]],
    },
    group: ["Spot.id"],
  });

  if (!spots) {
    return res.status(404).json({ message: "Spots not found" });
  }

  return res.json(spots);
});

// Add new spot
router.post("/", validateSpot, requireAuth, async (req, res) => {
  const { address, city, state, country, lat, lon, name, description, price } = req.body;

  const newSpot = await Spot.create({
    ownerId: req.user.id,
    address,
    city,
    state,
    country,
    lat,
    lon,
    name,
    description,
    price,
  });

  res.status(201).json(newSpot);
});

// Add image to spot
router.post("/:id/images", requireAuth, async (req, res) => {
  const userId = req.user.id;
  const spotId = req.params.id;

  const spot = await Spot.findOne({
    where: {
      id: spotId,
      ownerId: userId,
    },
  });

  if (!spot) return res.status(404).json({ message: "Spot couldn't be found" });

  const { url, preview } = req.body;

  const image = await Image.create({
    imageableId: spotId,
    imageableType: "spot",
    url,
    preview,
  });
  // Exclude imageableId and imageableType properties from the response using destructuring
  const { imageableId, imageableType, createdAt, updatedAt, ...responseData } = image.toJSON();

  res.status(200).json(responseData);
});

// Edit a spot
router.put("/:id", requireAuth, validateSpot, async (req, res) => {
  const userId = req.user.id;
  const spotId = req.params.id;

  const spot = await Spot.findOne({
    where: {
      id: spotId,
      ownerId: userId,
    },
  });

  if (!spot) return res.status(404).json({ message: "Spot couldn't be found" });

  await spot.update(req.body);

  const updatedSpot = await Spot.findByPk(spotId);

  res.status(200).json(updatedSpot);
});

// Delete a Spot
router.delete("/:id", requireAuth, async (req, res) => {
  const spotId = req.params.id;
  const userId = req.user.id;

  const spot = await Spot.findOne({
    where: { id: spotId, ownerId: userId },
  });

  if (!spot) return res.status(404).json({ message: "Spot couldn't be found" });

  // Delete the spot
  await spot.destroy();

  res.json({ message: "successfully deleted!" });
});

// GET all reviews by a spot's id
router.get("/:id/reviews", async (req, res) => {
  const spotId = req.params.id;

  const spot = await Spot.findByPk(spotId);

  if (!spot) return res.status(404).json({ message: "Spot couldn't be found" });

  const reviews = await Review.findAll({
    where: {
      spotId: spot.id,
    },
    include: [
      {
        model: User,
        attributes: ["id", "firstName", "lastName"],
      },
      {
        model: Image,
        as: "ReviewImages",
        attributes: ["id", "url"],
      },
    ],
  });

  res.status(200).json({ Reviews: reviews });
});

// Create review based on the spots id
router.post("/:id/reviews", requireAuth, async (req, res) => {
  const currentUser = req.user;
  const spotId = req.params.id;
  const { review, stars } = req.body;

  const spot = await Spot.findByPk(spotId);

  if (!spot) return res.status(404).json({ message: "Spot couldn't be found" });

  if (spot.ownerId === currentUser)
    return res
      .status(403)
      .json({ message: "Owners cannot create reviews for their own properties" });

  const existingReview = await Review.findOne({
    where: {
      userId: currentUser.id,
      spotId: spot.id,
    },
  });

  if (existingReview) {
    return res.status(500).json({
      message: "User already has a review for this spot",
    });
  }

  const newReview = await Review.create({
    userId: currentUser.id,
    spotId: spot.id,
    review,
    stars,
  });

  res.status(201).json(newReview);
});

// GET booking based on Spot id
router.get("/:id/bookings", requireAuth, async (req, res) => {
  const currentUser = req.user;
  const spotId = req.params.id;

  const spot = await Spot.findByPk(spotId);

  if (!spot) return res.status(404).json({ message: "Spot could not be found." });
  if (currentUser.id === spot.ownerId) {
    // IF Current User is owner of spot
    const bookings = await Booking.findAll({
      where: {
        spotId: spot.id,
      },
      include: {
        model: User,
        attributes: ["id", "firstName", "lastName"],
      },
    });

    res.status(200).json({ Bookings: bookings });
  } else {
    // If the current user is not the owner of the spot
    const bookings = await Booking.findAll({
      where: {
        spotId: spot.id,
      },
      attributes: ["spotId", "startDate", "endDate"],
    });

    return res.status(200).json({ Bookings: bookings });
  }
});

// Create a booking from a spot based on spot id. Spot CANNOT belong to current user
router.post("/:id/bookings", requireAuth, async (req, res) => {
  const currentUser = req.user;
  const spotId = parseInt(req.params.id, 10);
  const { startDate, endDate } = req.body;

  const spot = await Spot.findByPk(spotId);

  // Check to see if spot exists
  if (!spot) return res.status(404).json({ message: "Spot could not be found." });

  // Check to see if current user is the owner of the current spot
  if (currentUser.id === spot.ownerId)
    return res.status(403).json({ message: "Cannot book your own property." });

  const existingBooking = await Booking.findOne({
    where: {
      spotId: spot.id,
      startDate: {
        [Op.lte]: endDate,
      },
      endDate: {
        [Op.gte]: startDate,
      },
    },
  });

  if (existingBooking) {
    return res.status(403).json({
      message: "Sorry, this spot is already booked for the specified dates",
      errors: {
        startDate: "Start date conflicts with an existing booking",
        endDate: "End date conflicts with an existing booking",
      },
    });
  }

  const newBooking = await Booking.create({
    spotId: spot.id,
    userId: currentUser.id,
    startDate,
    endDate,
  });

  return res.status(200).json(newBooking);
});
// Delete a Spot Image
router.delete(":spotId/images/:imageId", requireAuth, async (req, res) => {
  const spotId = req.params.spotId;
  const imageId = req.params.imageId;
  const currentUser = req.user;

  try {
    // Find the spot associated with the image
    const spot = await Spot.findByPk(spotId);

    // Check if the spot exists
    if (!spot) {
      return res.status(404).json({ message: "Spot not found" });
    }

    // Check if the spot belongs to the current user (authorization)
    if (spot.ownerId !== currentUser.id) {
      return res.status(403).json({ message: "Unauthorized to delete this image" });
    }

    // Find the image to delete
    const image = await Image.findOne({
      where: {
        id: imageId,
        imageableId: spotId,
        imageableType: "spot",
      },
    });

    // Check if the image exists
    if (!image) {
      return res.status(404).json({ message: "Spot Image not found" });
    }

    // Delete the image
    await image.destroy();

    return res.status(200).json({ message: "Successfully deleted" });
  } catch (error) {
    console.error("Error deleting spot image:", error);
    return res.status(500).json({ message: "Error deleting spot image" });
  }
});

// Delete a Review Image
router.delete("/:spotId/reviews/:reviewId/images/:imageId", requireAuth, async (req, res) => {
  const spotId = req.params.spotId;
  const reviewId = req.params.reviewId;
  const imageId = req.params.imageId;
  const currentUser = req.user;

  try {
    // Find the review associated with the image
    const review = await Review.findOne({
      where: {
        id: reviewId,
        spotId: spotId,
      },
    });

    // Check if the review exists
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Check if the review belongs to the current user (authorization)
    if (review.userId !== currentUser.id) {
      return res.status(403).json({ message: "Unauthorized to delete this image" });
    }

    // Find the image to delete
    const image = await Image.findOne({
      where: {
        id: imageId,
        imageableId: reviewId,
        imageableType: "review",
      },
    });

    // Check if the image exists
    if (!image) {
      return res.status(404).json({ message: "Review Image not found" });
    }

    // Delete the image
    await image.destroy();

    return res.status(200).json({ message: "Successfully deleted" });
  } catch (error) {
    console.error("Error deleting review image:", error);
    return res.status(500).json({ message: "Error deleting review image" });
  }
});

module.exports = router;
