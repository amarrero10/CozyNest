import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

function MyReviews() {
  const reviews = useSelector((state) => state.reviews.myReviews);
  console.log("REVIEWS", reviews);

  return (
    <div>
      <h1>My Reviews</h1>
    </div>
  );
}

export default MyReviews;
