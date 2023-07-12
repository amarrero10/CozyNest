import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import { postReview } from "../../store/reviews";
import { fetchSpotReviews, fetchSpot } from "../../store/spots";
import "./ReviewModal.css";

function ReviewModal({ closeModal }) {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const spot = useSelector((state) => state.spots.spot);

  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [errors, setErrors] = useState({});

  if (!sessionUser) return <Redirect to="/" />;

  const handleRatingSelect = (selectedRating) => {
    const newRating = selectedRating === rating ? 0 : selectedRating;
    setRating(newRating);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    try {
      // Submit the review
      await dispatch(postReview({ review: reviewText, stars: rating }, spot.id));
      closeModal(); // Close the modal after successful review submission
      await dispatch(fetchSpotReviews(spot.id)); // Fetch updated reviews for the spot
      await dispatch(fetchSpot(spot.id)); // Fetch updated reviews for the spot
    } catch (res) {
      const data = await res.json();
      if (data && data.errors) {
        setErrors(data.errors);
      }
    }
  };

  const stars = [5, 4, 3, 2, 1];

  return (
    <div className="ReviewModalContainer">
      <h1>How was your stay?</h1>
      <form className="review-form" onSubmit={handleSubmit}>
        <label>
          Review
          <textarea
            placeholder="Leave your review here..."
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            required
          />
        </label>
        {errors.reviewText && <p>{errors.reviewText}</p>}
        <div className="rating-container">
          <label className="star-rating">Rating:</label>

          <div className="stars">
            {stars.map((star) => (
              <span
                key={star}
                className={star <= rating ? "filled" : ""}
                onClick={() => handleRatingSelect(star)}
              >
                &#9733;
              </span>
            ))}
          </div>
        </div>
        {errors.stars && <p>{errors.stars}</p>}
        <button
          type="submit"
          disabled={
            Object.keys(errors).length > 0 || !reviewText || reviewText.length < 10 || rating === 0
          }
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default ReviewModal;
