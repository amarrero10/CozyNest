import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyReviews, deleteAReview, editReview } from "../../store/reviews";
import ReviewModal from "../ReviewModal";
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";

function MyReviews() {
  const dispatch = useDispatch();
  const reviews = useSelector((state) => state.reviews.myReviews);
  const [reviewDeleted, setReviewDeleted] = useState(false); // New state variable
  const [reviewModal, setReviewModal] = useState(false);
  const [showModalBackground, setShowModalBackground] = useState(false);
  const [editReviewId, setEditReviewId] = useState(null);
  const [spotUpdated, setSpotUpdated] = useState(false); // New state variable
  const [reviewUpdated, setReviewUpdated] = useState(false);
  const [reviewIdToDelete, setReviewIdToDelete] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const user = (state) => state.session.user;

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
    } catch (error) {
      // Handle error
      console.log("Error editing review:", error);
    }
  };

  useEffect(() => {
    dispatch(fetchMyReviews());
  }, [dispatch, reviewDeleted, spotUpdated]);

  const handleDeleteReview = (reviewId) => {
    setReviewIdToDelete(reviewId);
    setShowConfirmationModal(true);
    document.body.classList.add("modal-open"); // Add class to <body> element
  };

  const confirmDeleteReview = async () => {
    await dispatch(deleteAReview(reviewIdToDelete));
    setShowConfirmationModal(false);
    setSpotUpdated(true);
    document.body.classList.remove("modal-open"); // Remove class from <body> element
  };

  const cancelDeleteReview = () => {
    setShowConfirmationModal(false);
    document.body.classList.remove("modal-open"); // Remove class from <body> element
  };

  if (!user) {
    <Redirect to="/" />;
  }

  return (
    <div>
      <h1>Manage Reviews</h1>
      {reviews && reviews.length > 0 ? (
        reviews.map((review) => {
          return (
            <>
              {review.Spot && (
                <>
                  <h3>{review.Spot.name}</h3>
                  <h4>
                    {new Date(review.createdAt).toLocaleString("default", {
                      month: "long",
                      year: "numeric",
                    })}
                  </h4>
                  <p>Rating: {review.stars}/5</p>
                  <p>{review.review}</p>
                  <div className="user-review-btns">
                    <button onClick={() => handleEditReview(review.id)}>Edit</button>
                    <button onClick={() => handleDeleteReview(review.id)}>Delete</button>
                  </div>
                  <hr />
                </>
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
              {showConfirmationModal && (
                <>
                  <div className="modal-background"></div>
                  <div className="confirmation-modal">
                    <h3>Confirm Delete</h3>
                    <p>Are you sure you want to delete this review?</p>
                    <div className="confirmation-modal-buttons">
                      <button className="delete-button" onClick={confirmDeleteReview}>
                        Yes (Delete Review)
                      </button>
                      <button className="keep-button" onClick={cancelDeleteReview}>
                        No (Keep Review)
                      </button>
                    </div>
                  </div>
                </>
              )}
            </>
          );
        })
      ) : (
        <>
          <h1>No Reviews at the moment!</h1>
        </>
      )}
    </div>
  );
}

export default MyReviews;
