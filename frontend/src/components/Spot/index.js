import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchSpot, fetchSpotReviews } from "../../store/spots";
import { deleteAReview, editReview } from "../../store/reviews";
import "./SpotDetails.css";
import { useHistory } from "react-router-dom";
import ReviewModal from "../ReviewModal";

const Spot = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { id } = useParams();
  const user = useSelector((state) => state.session.user);
  const spot = useSelector((state) => state.spots.spot);
  const reviews = useSelector((state) => state.spots.reviews);
  const [reviewModal, setReviewModal] = useState(false);
  const [showModalBackground, setShowModalBackground] = useState(false);
  const [spotUpdated, setSpotUpdated] = useState(false); // New state variable
  const [editReviewId, setEditReviewId] = useState(null);
  const [reviewUpdated, setReviewUpdated] = useState(false);

  const openReviewModal = () => {
    setReviewModal(true);
    setShowModalBackground(true);
    document.body.style.overflow = "hidden"; // Restore scroll
  };

  const closeReviewModal = () => {
    setReviewModal(false);
    setShowModalBackground(false); // Set showModalBackground to false
    document.body.style.overflow = "auto"; // Restore scroll
  };

  const userHasReviewed = () => {
    if (!user || !Array.isArray(reviews)) return false;

    return reviews.some((review) => review.User?.id === user?.user?.id); // Access properties safely
  };

  const handlePostReview = () => {
    openReviewModal();
  };

  const handleDeleteReview = async (reviewId) => {
    await dispatch(deleteAReview(reviewId));
    setSpotUpdated(true);
  };

  const handleEditReview = (reviewId) => {
    setEditReviewId(reviewId);
    setReviewModal(true);
    setShowModalBackground(true);
    document.body.style.overflow = "hidden";
  };

  const handleEditReviewSubmit = async (reviewData) => {
    try {
      await dispatch(editReview(reviewData, editReviewId)); // Dispatch the editReview action with the review data and review ID
      closeReviewModal(); // Close the modal after successful review submission or edit
      setReviewUpdated(true);
      setSpotUpdated(true); // Trigger spot update as well
    } catch (error) {
      // Handle error
      console.log("Error editing review:", error);
    }
  };

  const updateSpotData = async () => {
    try {
      await dispatch(fetchSpot(id));
      await dispatch(fetchSpotReviews(id)); // Pass the spot id instead of spotCopy
    } catch (error) {
      console.log("An error happened!");
      history.push("/");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(fetchSpot(id));
        await dispatch(fetchSpotReviews(id));
      } catch (error) {
        // Redirect to homepage if spot doesn't exist
        console.log("An error happened!");
        history.push("/");
      }
    };

    fetchData();
  }, [dispatch, id, user]);

  useEffect(() => {
    if (spot && spotUpdated) {
      updateSpotData();
      setSpotUpdated(false);
    }
  }, [spotUpdated]);

  useEffect(() => {
    if (spot && (spotUpdated || reviewUpdated)) {
      updateSpotData();
      setSpotUpdated(false);
      setReviewUpdated(false);
    }
  }, [dispatch, id, spot, spotUpdated, reviewUpdated]);

  if (!spot) {
    return <p>Loading...</p>;
  }

  const handleReserve = () => {
    alert("Feature coming soon");
  };

  return (
    <>
      {spot ? (
        <>
          {reviewModal && (
            <div className={`modal ${showModalBackground ? "" : "modal-hidden"}`}>
              <div className="modal-content">
                <span className="close" onClick={closeReviewModal}>
                  &times;
                </span>
                <ReviewModal closeModal={closeReviewModal} />
              </div>
            </div>
          )}

          <div className="spot-details">
            <div className="spot-heading">
              <h1>{spot.name}</h1>
              <p>
                Location: {spot.city}, {spot.state} {spot.country}
              </p>
            </div>
            <div className="spot-images">
              <div className="spot-grid">
                <div className="large-image">
                  {spot.SpotImages && spot.SpotImages.length > 0 && (
                    <img src={spot.SpotImages[spot.SpotImages.length - 1].url} alt="Large" />
                  )}
                </div>
                <div
                  className={`small-images ${
                    spot.SpotImages && spot.SpotImages.length > 5 ? "hide-extra" : ""
                  }`}
                >
                  {spot.SpotImages &&
                    spot.SpotImages.length > 1 &&
                    spot.SpotImages.slice(1, 6)
                      .filter(
                        (image) => image.id !== spot.SpotImages[spot.SpotImages.length - 1].id
                      )
                      .map((image) => <img key={image.id} src={image.url} alt="Small" />)}
                </div>
              </div>
            </div>

            <div className="spot-info">
              <div className="spot-text">
                <h2>Hosted by {spot.Owner && `${spot.Owner.firstName} ${spot.Owner.lastName}`}</h2>
                <p>{spot.description}</p>
              </div>
              <div className="spot-callout">
                <div className="mini-spot-details">
                  <div>
                    <p>
                      <span>${spot.price}</span> night
                    </p>
                  </div>
                  <div className="spot-review">
                    <div>
                      <p>{spot.avgStarRating >= 1 ? <>&#9733; {spot.avgStarRating}</> : ""} </p>
                    </div>
                    <div>
                      <p>
                        {spot.numReviews > 0
                          ? spot.numReviews > 1
                            ? `${spot.numReviews} reviews`
                            : `${spot.numReviews} review`
                          : "New!"}
                      </p>
                    </div>
                  </div>
                </div>
                <button className="spot-btn" onClick={handleReserve}>
                  Reserve
                </button>
              </div>
            </div>
          </div>
          <hr />
          <div className="review-header">
            <h2>
              {spot.avgStarRating >= 1 ? <>&#9733; {spot.avgStarRating}</> : <>&#9733; New!</>}
            </h2>
            <h2>
              {spot.numReviews > 0
                ? spot.numReviews > 1
                  ? `${spot.numReviews} reviews`
                  : `${spot.numReviews} review`
                : ""}
            </h2>
          </div>
          {user && spot.Owner && !userHasReviewed() && user.user?.id !== spot.Owner.id && (
            <button className="spot-btn post-review-btn" onClick={handlePostReview}>
              Post Your Review!
            </button>
          )}
        </>
      ) : (
        <p>Something's wrong</p>
      )}

      <div className="review-container">
        {reviews && reviews.length > 0
          ? reviews
              .slice()
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map((review) =>
                review && review.User ? (
                  <div key={review.id} className="review-cards">
                    {review && review.User && (
                      <div className="review-info">
                        <div>
                          <i className="fa fa-solid fa-comments"></i>
                        </div>
                        <div className="review-user-info">
                          <h3>{review.User.firstName}</h3>
                          <p>
                            {new Date(review.createdAt).toLocaleString("default", {
                              month: "long",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                    )}
                    <div className="review-details">
                      <p>{review.review}</p>
                    </div>
                    {user && user.user && user.user.id === review.User.id && (
                      <div className="user-review-btns">
                        <button onClick={() => handleEditReview(review.id)}>Edit</button>
                        <button onClick={() => handleDeleteReview(review.id)}>Delete</button>
                      </div>
                    )}
                    {reviewModal && (
                      <div className={`modal ${showModalBackground ? "" : "modal-hidden"}`}>
                        <div className="modal-content">
                          <span className="close" onClick={closeReviewModal}>
                            &times;
                          </span>
                          <ReviewModal
                            closeModal={closeReviewModal}
                            editReviewId={editReviewId}
                            onSubmit={handleEditReviewSubmit}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ) : null
              )
          : !user ||
            (spot && spot.Owner && user.user?.id !== spot.Owner.id && (
              <p>Be the first to post a review!</p>
            ))}
      </div>
    </>
  );
};

export default Spot;
