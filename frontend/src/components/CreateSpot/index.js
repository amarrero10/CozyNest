import "./CreateSpot.css";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { createSpot, addSpotImages } from "../../store/spots";

function CreateSpot() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user);
  const spot = useSelector((state) => state.spots.spot);
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
  const [url, setUrl] = useState("");
  const [preview, setPreview] = useState(true);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    await dispatch(
      createSpot({
        name,
        address,
        city,
        state,
        country,
        lat: lat || null,
        lng: lng || null,
        description,
        price,
      })
    );

    await dispatch(
      addSpotImages(
        {
          url,
          preview,
        },
        spot.id
      )
    );
    try {
    } catch (res) {
      const data = await res.json();
      if (data && data.errors) {
        setErrors(data.errors);
      }
    }
  };

  if (!user) return history.push("/");

  return (
    <>
      <h2>Create a new Spot</h2>
      <h3>Where's your place located? To get started please fill out the form below.</h3>
      <p>Guests will only have access to your address once they make a reservation.</p>

      <form onSubmit={handleSubmit}>
        <label>Country</label>
        <input
          required
          type="text"
          placeholder="Country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        ></input>
        <label>Address</label>
        <input
          required
          type="text"
          placeholder="123 Main Street"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        ></input>
        <label>City</label>
        <input
          required
          type="text"
          placeholder="Los Angeles"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        ></input>
        <label>State</label>
        <input
          required
          type="text"
          placeholder="California"
          value={state}
          onChange={(e) => setState(e.target.value)}
        ></input>
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
        ></textarea>
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
        ></input>
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
        ></input>
        <hr />
        <h3>Time to add some pictures!</h3>
        <input
          type="text"
          required
          placeholder="Image URL"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            setPreview("true");
          }}
        ></input>
        <input type="text" placeholder="Image URL"></input>
        <input type="text" placeholder="Image URL"></input>
        <input type="text" placeholder="Image URL"></input>
        <input type="text" placeholder="Image URL"></input>

        <button type="submit">Create your spot!</button>
      </form>
    </>
  );
}

export default CreateSpot;
