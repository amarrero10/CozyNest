const express = require("express");
const bcrypt = require("bcryptjs");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { User, Spot } = require("../../db/models");

const router = express.Router();

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

module.exports = router;
