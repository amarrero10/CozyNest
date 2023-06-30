import { csrfFetch } from "./csrf";

// Action Types
const SET_REVIEW = "reviews/setReview";

// Action Creators
const setReview = (review) => ({
  type: SET_REVIEW,
  payload: review,
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

// Initial State
const initialState = {
  review: null,
};

// Reducers
const reviewsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_REVIEW:
      return {
        ...state,
        review: action.payload,
      };

    default:
      return state;
  }
};

export default reviewsReducer;
