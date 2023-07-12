import { csrfFetch } from "./csrf";

// Action Types
const SET_REVIEW = "reviews/setReview";
const DELETE_REVIEW = "reviews/deleteReview";
const SET_MY_REVIEWS = "reviews/SET_MY_REVIEWS";

// Action Creators
const setReview = (review) => ({
  type: SET_REVIEW,
  payload: review,
});

const deleteReview = (reviewId) => ({
  type: DELETE_REVIEW,
  payload: reviewId,
});

const setMyReviews = (reviews) => ({
  type: SET_MY_REVIEWS,
  payload: reviews,
});

// Thunk Actions

export const postReview = (userReview, spotId) => async (dispatch) => {
  const { review, stars } = userReview;

  const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
    method: "POST",
    body: JSON.stringify({
      review,
      stars,
    }),
  });
  const data = await response.json();

  // Dispatch the setReview action with the correct payload
  dispatch(setReview(data));

  return response;
};

export const deleteAReview = (reviewId) => async (dispatch) => {
  const response = await csrfFetch(`/api/users/current/reviews/${reviewId}`, {
    method: "DELETE",
  });

  if (response.ok) {
    dispatch(deleteReview(reviewId));
  }
};

export const editReview = (reviewData, reviewId) => async (dispatch) => {
  const { review, stars } = reviewData;

  const response = await csrfFetch(`/api/users/current/reviews/${reviewId}`, {
    method: "PUT",
    body: JSON.stringify({
      review,
      stars,
    }),
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(setReview(data));
  }

  return response;
};

export const fetchMyReviews = () => async (dispatch) => {
  try {
    const response = await csrfFetch("/api/users/current/reviews");

    if (response.ok) {
      const data = await response.json();
      dispatch(setMyReviews(data.Reviews)); // Access reviews from data.Reviews
    } else {
      throw new Error("Failed to fetch user's reviews");
    }
  } catch (error) {
    console.log("Error:", error);
  }
};

// Initial State
const initialState = {
  review: null,
  myReviews: [], // Add myReviews as an empty array
};

// Reducers
const reviewsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_REVIEW:
      return {
        ...state,
        review: action.payload,
      };
    case DELETE_REVIEW:
      return {
        ...state,
        review: action.payload,
      };
    case SET_MY_REVIEWS:
      return {
        ...state,
        myReviews: action.payload,
      };

    default:
      return state;
  }
};

export default reviewsReducer;
