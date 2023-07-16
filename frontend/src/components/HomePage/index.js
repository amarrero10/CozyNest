import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchSpots } from "../../store/spots";
import { Link, useHistory } from "react-router-dom";
import "./HomePage.css";

function HomePage() {
  const history = useHistory();
  const dispatch = useDispatch();
  const spots = useSelector((state) => state.spots.spots);

  useEffect(() => {
    dispatch(fetchSpots());
  }, [dispatch]);

  // Render the spots data
  return (
    <div>
      <h1>Explore!</h1>
      <div className="spots-grid">
        {spots ? (
          spots.map((spot) => (
            <Link key={spot.id} to={`/spots/${spot.id}`}>
              <div className="spot-card" key={spot.id} title={spot.name}>
                <img src={`${spot.previewImage}`} alt="view of the Spot from outside" />
                <div className="spot-info">
                  <h3>{spot.name}</h3>
                  {spot.avgRating === "0.0" ? (
                    <p className="spot-rating">New!</p>
                  ) : (
                    <div className="spot-rating">
                      <span>Rating:</span>
                      <p>&#9733; {spot.avgRating}</p>
                    </div>
                  )}
                </div>
                <p className="spot-location">
                  {spot.city}, {spot.state}
                </p>
                <p>${spot.price} night</p>
              </div>
            </Link>
          ))
        ) : (
          <p>Loading spots...</p>
        )}
      </div>
    </div>
  );
}

export default HomePage;
