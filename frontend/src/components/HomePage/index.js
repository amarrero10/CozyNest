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
              <div className="spot-card">
                <img src={`${spot.previewImage}`} alt="view of the Spot from outside" />
                <h3>{spot.name}</h3>
                <p>
                  {spot.city}, {spot.state}
                </p>
                <p>${spot.price} night</p>
                {spot.avgRating === 0 ? <p> &#9733; {spot.avgRating}</p> : <p>New!</p>}
                <button className="homepage-btn" onClick={() => history.push(`/spots/${spot.id}`)}>
                  More Info!
                </button>
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
