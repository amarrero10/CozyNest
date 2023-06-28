import { csrfFetch } from "./csrf";

// Action Types
const SET_SPOTS = "spots/setSpots";
// Define additional action types as needed
const SET_SPOT = "spots/setSpot";
const SET_SPOT_REVIEWS = "spots/setSpotReviews";

// Action Creators
const setSpots = (spots) => ({
  type: SET_SPOTS,
  payload: spots,
});
// Define additional action creators as needed
const setSpot = (spot) => ({
  type: SET_SPOT,
  payload: spot,
});

const setSpotReviews = (reviews) => ({
  type: SET_SPOT_REVIEWS,
  payload: reviews,
});

// Thunk Actions
export const fetchSpots = () => async (dispatch) => {
  const response = await csrfFetch("/api/spots");
  if (response.ok) {
    const data = await response.json();
    dispatch(setSpots(data.Spots));
  }
};

export const fetchSpot = (spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}`);
  if (response.ok) {
    const data = await response.json();
    dispatch(setSpot(data));
    return data;
  }
};

export const fetchSpotReviews = (spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}/reviews`);
  if (response.ok) {
    const data = await response.json();
    console.log(data);
    dispatch(setSpotReviews(data.Reviews));
  }
};

// Define additional thunk actions as needed

// Initial State
const initialState = {
  spots: [],
  spot: null,
  reviews: null,
  // Add additional state properties as needed
};

// Reducer
const spotsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SPOTS:
      return {
        ...state,
        spots: action.payload,
      };
    // Handle additional actions as needed
    case SET_SPOT:
      return {
        ...state,
        spot: action.payload,
      };
    case SET_SPOT_REVIEWS:
      return {
        ...state,
        reviews: action.payload,
      };
    default:
      return state;
  }
};

export default spotsReducer;
