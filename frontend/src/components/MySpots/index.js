import React, { useEffect } from "react";
import "./MySpots.css";
import { useDispatch, useSelector } from "react-redux";
import { userSpots } from "../../store/spots";
import { Link } from "react-router-dom";

function MySpots() {
  const dispatch = useDispatch();
  const spots = useSelector((state) => state.spots.spots);
  const user = useSelector((state) => state.session.user);

  useEffect(() => {
    if (user) {
      dispatch(userSpots());
    }
  }, [dispatch]);
  return (
    <>
      <h2>Manage your spots</h2>
      <button>Create a New Spot</button>
      <div className="spots-grid">
        {spots ? (
          spots.map((spot) => (
            <div className="spot-card">
              <Link key={spot.id} to={`/spots/${spot.id}`}>
                <img src={`${spot.previewImage}`} alt="view of the Spot from outside" />
                <h3>{spot.name}</h3>
                <p>{spot.description}</p>
                <p>{spot.address}</p>
                <p>${spot.price} night</p>
                {spot.avgRating !== 1 ? <p> &#9733; {spot.avgRating}</p> : <p>New!</p>}
              </Link>
              <div className="my-spot-btns">
                <button className="spot-update-btn">Update Spot</button>
                <button className="spot-delete-btn">Delete</button>
              </div>
            </div>
          ))
        ) : (
          <p>Loading spots...</p>
        )}
      </div>
    </>
  );
}

export default MySpots;
