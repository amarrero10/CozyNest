import React from "react";
import "./HomePage.css";

const StarRating = ({ rating }) => {
  const filledStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  const renderStar = (index) => {
    if (index < filledStars) {
      return <span key={index} className="star filled" />;
    } else if (index === filledStars && hasHalfStar) {
      return <span key={index} className="star half-filled" />;
    } else {
      return <span key={index} className="star" />;
    }
  };

  return (
    <div className="star-rating-container">
      {[...Array(5)].map((_, index) => renderStar(index))}
    </div>
  );
};

export default StarRating;
