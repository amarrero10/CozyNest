import React, { useEffect, useState } from "react";
import "./MySpots.css";
import { useDispatch, useSelector } from "react-redux";
import { userSpots, deleteASpot } from "../../store/spots";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import CreateSpot from "../CreateSpot";

function MySpots() {
  const history = useHistory();
  const dispatch = useDispatch();
  const spots = useSelector((state) => state.spots.spots);
  const user = useSelector((state) => state.session.user);
  const [selectedSpot, setSelectedSpot] = useState(null);

  useEffect(() => {
    if (user) {
      dispatch(userSpots());
    } else {
      history.push("/");
    }
  }, [dispatch, user]);

  const handleDelete = (spotId) => {
    setSelectedSpot(spotId);
  };

  const confirmDelete = () => {
    if (selectedSpot) {
      dispatch(deleteASpot(selectedSpot))
        .then(() => {
          // Spot deleted successfully, handle any necessary actions or state updates
          dispatch(userSpots()) // Fetch updated spots after deletion
            .then(() => setSelectedSpot(null)); // Reset selected spot
        })
        .catch((error) => {
          // Error occurred during deletion, handle it appropriately
          console.log("Error deleting spot:", error);
          setSelectedSpot(null); // Reset selected spot
        });
    }
  };

  const cancelDelete = () => {
    setSelectedSpot(null); // Reset selected spot
  };

  return (
    <>
      <h2>Manage Spots</h2>
      <Link to="/create-spot">
        <button className="new-spot-btn">Create a New Spot</button>
      </Link>
      <div className="my-spot-container">
        <div className="spots-grid">
          {spots.length > 0 ? (
            spots.map((spot) => (
              <>
                {console.log(spot.previewImage)}
                <div className="spot-card my-spot-card">
                  <Link key={spot.id} to={`/spots/${spot.id}`}>
                    <img
                      className="my-spot-img"
                      src={`${spot.previewImage}`}
                      alt="view of the Spot from outside"
                      key={spot.previewImage}
                    />
                    <h3>{spot.name}</h3>
                    <p>
                      {spot.city}, {spot.state}
                    </p>
                    <p>${spot.price} night</p>
                    {spot.avgRating >= 1 ? <p> &#9733; {spot.avgRating}</p> : <p>New!</p>}
                  </Link>

                  <div className="my-spot-btns">
                    <Link to={{ pathname: "/edit-spot", state: { spot } }}>
                      <button className="spot-update-btn">Update Spot</button>
                    </Link>

                    <button className="spot-delete-btn" onClick={() => handleDelete(spot.id)}>
                      Delete
                    </button>
                  </div>
                </div>
              </>
            ))
          ) : (
            <h2 className="no-spots">
              No Spots yet! Click the button above to create a spot or{" "}
              <Link to="/create-spot" className="click-me">
                <span className="no-spots-span">click here!</span>
              </Link>
            </h2>
          )}
        </div>
      </div>
      {selectedSpot && (
        <div className="my-spot-modal">
          <div className="my-spot-modal-content">
            <h3>Confirm Spot Deletion</h3>
            <p>Are you sure you want to delete this spot?</p>
            <div className="my-spot-modal-buttons">
              <button className="my-spot-modal-delete-btn" onClick={confirmDelete}>
                Yes, delete the spot
              </button>
              <button className="my-spot-modal-cancel-btn" onClick={cancelDelete}>
                Nevermind, I changed my mind
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default MySpots;
