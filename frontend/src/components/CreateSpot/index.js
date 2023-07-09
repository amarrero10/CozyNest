import "./CreateSpot.css";
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { createSpot } from "../../store/spots";

function CreateSpot() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user);
  const history = useHistory();
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [previewImage, setPreviewImage] = useState("");
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    // Perform custom validation checks
    const validationErrors = {};

    if (!country) {
      validationErrors.country = "Country is required";
    }

    if (!address) {
      validationErrors.address = "Street address is required";
    } else if (address.length < 5) {
      validationErrors.address = "Street address is not valid";
    }

    if (!city) {
      validationErrors.city = "City is required";
    }

    if (!state) {
      validationErrors.state = "State is required";
    }

    if (state.length < 4) {
      validationErrors.state = "Please enter complete State name.";
    }

    if (!description) {
      validationErrors.description = "Description is required";
    }

    if (description.length < 30) {
      validationErrors.description = "Description must be at least 30 characters.";
    }

    if (!name) {
      validationErrors.name = "Name is required";
    }

    if (!price) {
      validationErrors.price = "Price is required";
    } else if (price <= 0) {
      validationErrors.price = "Price must be greater than 0";
    }

    if (!previewImage) {
      validationErrors.previewImage = "Preview Image is required.";
    }

    if (!/\.png$|\.jpg$|\.jpeg$/i.test(previewImage)) {
      validationErrors.previewImage = "Image URL must end in png, jpg, jpeg";
    }

    // If there are validation errors, update the errors state and return
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      const formButton = document.querySelector(".create-spot-form button");
      formButton.classList.add("shake");

      // Remove the shake class after the animation finishes
      setTimeout(() => {
        formButton.classList.remove("shake");
      }, 300);

      return;
    }

    // If no validation errors, proceed with submitting the form
    // If no validation errors, proceed with submitting the form
    const formData = {
      name,
      address,
      city,
      state,
      country,
      lat: lat || null,
      lng: lng || null,
      description,
      price,
      previewImage,
    };

    // Dispatch the appropriate action based on whether it's creating or editing a spot
    try {
      // Creating a new spot
      await dispatch(createSpot(formData));

      // Redirect or handle any necessary actions after successful submission
      history.push("/my-spots");
    } catch (error) {
      // Handle any submission errors
      console.log("Error:", error);
    }
  };

  if (!user) return history.push("/");

  return (
    <div className="create-spot-container">
      <h2>Create a new Spot</h2>
      <h3>Where's your place located? To get started please fill out the form below.</h3>
      <p>Guests will only have access to your address once they make a reservation.</p>

      <form className="create-spot-form" onSubmit={handleSubmit}>
        <label>Country</label>
        <input
          required
          type="text"
          placeholder="Country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className={errors.country ? "error-input" : ""}
        ></input>
        {errors.country && <span className="error">{errors.country}</span>}
        <label>Address</label>
        <input
          required
          type="text"
          placeholder="123 Main Street"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className={errors.address ? "error-input" : ""}
        ></input>
        {errors.address && <span className="error">{errors.address}</span>}
        <label>City</label>
        <input
          required
          type="text"
          placeholder="Los Angeles"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className={errors.city ? "error-input" : ""}
        ></input>
        {errors.city && <span className="error">{errors.city}</span>}
        <label>State</label>
        <input
          required
          type="text"
          placeholder="California"
          value={state}
          onChange={(e) => setState(e.target.value)}
          className={errors.state ? "error-input" : ""}
        ></input>
        {errors.state && <span className="error">{errors.state}</span>}
        <label>Latitude</label>
        <input type="number" value={lat} onChange={(e) => setLat(e.target.value)}></input>
        <label>Longitude</label>
        <input type="number" value={lng} onChange={(e) => setLng(e.target.value)}></input>
        <hr />
        <label>Tell us about your amazing rental!</label>
        <p>
          Make sure to highlight the unique features, amenities, nearby attractions, and any special
          experiences your rental offers!
        </p>
        <textarea
          required
          placeholder="Great description goes here..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={errors.description ? "error-input" : ""}
        ></textarea>
        {errors.description && <span className="error">{errors.description}</span>}
        <hr />
        <label>Give your rental a catchy title! </label>
        <p>
          Choose a descriptive and attention-grabbing title that showcases the unique aspects of
          your rental. Be creative!
        </p>
        <input
          required
          type="text"
          placeholder="Super Catchy Title"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={errors.name ? "error-input" : ""}
        ></input>
        {errors.name && <span className="error">{errors.name}</span>}
        <hr />
        <label>Set a competitive price for your rental.</label>
        <p>
          Research similar rentals in the area and consider factors like location, amenities, and
          demand to set a competitive price that attracts potential guests.
        </p>
        <input
          required
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className={errors.price ? "error-input" : ""}
        ></input>
        {errors.price && <span className="error">{errors.price}</span>}
        <hr />
        <h3>Time to add some pictures!</h3>
        <input
          type="text"
          required
          placeholder="Image URL"
          value={previewImage}
          onChange={(e) => {
            setPreviewImage(e.target.value);
          }}
          className={errors.previewImage ? "error-input" : ""}
        ></input>
        {errors.previewImage && <span className="error">{errors.previewImage}</span>}

        <button type="submit" className={Object.keys(errors).length > 0 ? "shake" : ""}>
          Create your spot!
        </button>
      </form>
    </div>
  );
}

export default CreateSpot;
