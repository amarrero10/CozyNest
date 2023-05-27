const express = require("express");
const { Sequelize } = require("sequelize");
const { body, validationResult } = require("express-validator");
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
  check("lng").exists({ checkFalsy: true }).isFloat().withMessage("longitude is not valid."),
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

// Get Spot details by Id
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
          as: "SpotReviews",
          attributes: [],
        },
        {
          model: Image,
          as: "SpotImages",
          required: false,
          where: { imageableType: "spot" },
          attributes: ["id", "url", "preview"],
          order: [["createdAt", "DESC"]],
        },
      ],
      attributes: {
        include: [
          [Sequelize.fn("AVG", Sequelize.col("SpotReviews.stars")), "avgRating"],
          [Sequelize.fn("COUNT", Sequelize.col("SpotReviews.id")), "numReviews"],
        ],
      },
      group: [
        // List all columns from Spot, Owner, and Images
        "Spot.id",
        "Spot.ownerId",
        "Spot.address",
        "Spot.city",
        "Spot.state",
        "Spot.country",
        "Spot.lat",
        "Spot.lng",
        "Spot.name",
        "Spot.description",
        "Spot.price",
        "Spot.avgRating",
        "Spot.createdAt",
        "Spot.updatedAt",
        "Owner.id",
        "Owner.firstName",
        "Owner.lastName",
        "SpotImages.id",
        "SpotImages.url",
        "SpotImages.preview",
      ],
    });

    if (!spot) {
      return res.status(404).json({ message: "Spot couldn't be found" });
    }

    const spotImages = spot.SpotImages;
    let previewImage = "No Images uploaded.";

    for (let i = spotImages.length - 1; i >= 0; i--) {
      if (spotImages[i].preview) {
        previewImage = spotImages[i].url;
        break;
      }
    }

    const formattedSpot = {
      id: spot.id,
      ownerId: spot.ownerId,
      address: spot.address,
      city: spot.city,
      state: spot.state,
      country: spot.country,
      lat: spot.lat,
      lng: spot.lng,
      name: spot.name,
      description: spot.description,
      price: spot.price,
      createdAt: spot.createdAt,
      updatedAt: spot.updatedAt,
      numReviews: spot.numReviews,
      previewImage,
      avgStarRating: parseFloat(spot.getDataValue("avgRating") || 0).toFixed(1),
      SpotImages: spotImages.map((image) => ({
        id: image.id,
        url: image.url,
        preview: image.preview,
      })),
      Owner: {
        id: spot.Owner.id,
        firstName: spot.Owner.firstName,
        lastName: spot.Owner.lastName,
      },
    };

    res.status(200).json(formattedSpot);
  } catch (error) {
    console.error("Error fetching spot:", error);
    res.status(500).json({ message: "Error fetching spot" });
  }
});

// GET ALL SPOTS
router.get("/", async (req, res) => {
  const { page = 1, size = 20, minLat, maxLat, minLon, maxLon, minPrice, maxPrice } = req.query;

  // Validate query parameters
  const errors = {};
  if (isNaN(page) || page < 1 || page > 10) {
    errors.page = "Page must be an integer between 1 and 10";
  }
  if (isNaN(size) || size < 1 || size > 20) {
    errors.size = "Size must be an integer between 1 and 20";
  }
  if (minLat && (isNaN(minLat) || minLat < -90 || minLat > 90)) {
    errors.minLat = "Minimum latitude is invalid";
  }
  if (maxLat && (isNaN(maxLat) || maxLat < -90 || maxLat > 90)) {
    errors.maxLat = "Maximum latitude is invalid";
  }
  if (minLon && (isNaN(minLon) || minLon < -180 || minLon > 180)) {
    errors.minLon = "Minimum longitude is invalid";
  }
  if (maxLon && (isNaN(maxLon) || maxLon < -180 || maxLon > 180)) {
    errors.maxLon = "Maximum longitude is invalid";
  }
  if (minPrice && (isNaN(minPrice) || minPrice < 0)) {
    errors.minPrice = "Minimum price must be a decimal greater than or equal to 0";
  }
  if (maxPrice && (isNaN(maxPrice) || maxPrice < 0)) {
    errors.maxPrice = "Maximum price must be a decimal greater than or equal to 0";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ message: "Validation error", errors });
  }

  try {
    const spots = await Spot.findAll({
      include: [
        {
          model: Review,
          attributes: [],
          as: "SpotReviews",
        },
        {
          model: Image,
          as: "SpotImages",
          required: false,
          where: { imageableType: "spot", preview: true },
          attributes: ["url"],
          order: [["createdAt", "DESC"]],
          limit: 1,
        },
      ],
      attributes: {
        include: [[Sequelize.fn("AVG", Sequelize.col("SpotReviews.stars")), "avgRating"]],
      },
      group: ["Spot.id"],
    });

    let filteredSpots = spots;

    if (minLat && maxLat) {
      filteredSpots = filteredSpots.filter((spot) => spot.lat >= minLat && spot.lat <= maxLat);
    }

    if (minLon && maxLon) {
      filteredSpots = filteredSpots.filter((spot) => spot.lng >= minLon && spot.lng <= maxLon);
    }

    if (minPrice && maxPrice) {
      filteredSpots = filteredSpots.filter(
        (spot) => spot.price >= minPrice && spot.price <= maxPrice
      );
    }

    const formattedSpots = filteredSpots.slice((page - 1) * size, page * size).map((spot) => {
      const previewImage =
        spot.SpotImages.length > 0 ? spot.SpotImages[0].url : "No Images uploaded.";

      return {
        id: spot.id,
        ownerId: spot.ownerId,
        address: spot.address,
        city: spot.city,
        state: spot.state,
        country: spot.country,
        lat: spot.lat,
        lng: spot.lng,
        name: spot.name,
        description: spot.description,
        price: spot.price,
        createdAt: spot.createdAt,
        updatedAt: spot.updatedAt,
        avgRating: parseFloat(spot.getDataValue("avgRating") || 0).toFixed(1),
        previewImage,
      };
    });

    return res.status(200).json({ Spots: formattedSpots, page, size });
  } catch (error) {
    console.error("Error fetching spots:", error);
    return res.status(500).json({ message: "Error fetching spots" });
  }
});

// Add new spot
router.post("/", validateSpot, requireAuth, async (req, res) => {
  const { address, city, state, country, lat, lng, name, description, price } = req.body;

  const newSpot = await Spot.create({
    ownerId: req.user.id,
    address,
    city,
    state,
    country,
    lat,
    lng,
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
    include: {
      model: Image,
      as: "SpotImages",
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

  // Update the SpotImages association by adding the newly created image to the spot
  spot.SpotImages.push(image);

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
router.post(
  "/:id/reviews",
  requireAuth,
  [
    // Validate request body using express-validator
    body("review").notEmpty().withMessage("Review text is required"),
    body("stars").isInt({ min: 1, max: 5 }).withMessage("Stars must be an integer from 1 to 5"),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // There are validation errors
      const errorResponse = {
        message: "Bad Request",
        errors: {},
      };

      // Extract the validation errors and add them to the error response
      errors.array().forEach((error) => {
        errorResponse.errors[error.param] = error.msg;
      });

      return res.status(400).json(errorResponse);
    }

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
  }
);

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
router.delete("/:spotId/images/:imageId", requireAuth, async (req, res) => {
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
