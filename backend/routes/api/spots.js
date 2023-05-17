const express = require("express");
const bcrypt = require("bcryptjs");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { User, Spot, Image } = require("../../db/models");

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
  const spotId = req.params.id;

  console.log(spotId);

  try {
    // Fetch the spot by ID including its owner and spot images
    const spot = await Spot.findByPk(spotId, {
      include: [
        {
          model: User,
          as: "Owner",
          attributes: ["id", "firstName", "lastName"],
        },
      ],
    });

    if (!spot) {
      return res.status(404).json({ message: "Spot couldn't be found" });
    }

    // Send the response with the formatted spot data
    res.status(200).json(spot);
  } catch (error) {
    console.error("Error fetching spot:", error);
    res.status(500).json({ message: "Error fetching spot" });
  }
});

// GET all spots
router.get("/", async (req, res) => {
  const spots = await Spot.findAll();

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

module.exports = router;
