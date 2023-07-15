import { csrfFetch } from "./csrf";

// Action Types
const SET_SPOTS = "spots/setSpots";
// Define additional action types as needed
const SET_SPOT = "spots/setSpot";
const SET_SPOT_REVIEWS = "spots/setSpotReviews";
const SET_SPOT_IMAGES = "spots/setSpotImages";
const DELETE_SPOT = "spots/deleteSpot";

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

const setSpotImages = (image) => ({
  type: SET_SPOT_IMAGES,
  payload: image,
});

const deleteSpot = (spotId) => ({
  type: DELETE_SPOT,
  payload: spotId,
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

export const createSpot = (spot) => async (dispatch) => {
  const { address, city, state, country, lat, lng, name, description, price, previewImage } = spot;
  const response = await csrfFetch(`/api/spots`, {
    method: "POST",
    body: JSON.stringify({
      name,
      address,
      city,
      state,
      country,
      lat,
      lng,
      description,
      price,
      previewImage,
    }),
  });

  if (!response.ok) {
    // Handle the case where the request was not successful
    throw new Error("Failed to create spot");
  }

  const createdSpot = await response.json();

  dispatch(setSpot(createdSpot));

  return createdSpot;
};

export const addSpotImages = (image, spotId) => async (dispatch) => {
  const { url, preview = false } = image;

  const response = await csrfFetch(`/api/spots/${spotId}/images`, {
    method: "POST",
    body: JSON.stringify({
      url,
      preview,
    }),
  });

  const data = await response.json();

  dispatch(setSpotImages(data));

  return response;
};

export const userSpots = () => async (dispatch) => {
  const response = await csrfFetch("/api/users/current/spots");
  if (response.ok) {
    const data = await response.json();
    dispatch(setSpots(data.Spots));
  }
};

export const deleteASpot = (spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}`, {
    method: "DELETE",
  });

  if (response.ok) {
    dispatch(deleteSpot(spotId));
  }

  return response;
};

export const editSpot = (spot, spotId) => async (dispatch) => {
  const { address, city, state, country, lat, lng, name, description, price, previewImage } = spot;
  const response = await csrfFetch(`/api/spots/${spotId}`, {
    method: "PUT",
    body: JSON.stringify({
      name,
      address,
      city,
      state,
      country,
      lat,
      lng,
      description,
      price,
    }),
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(setSpot(data));
  }

  return response;
};

// Define additional thunk actions as needed

// Initial State
const initialState = {
  spots: [],
  spot: null,
  reviews: null,
  images: [],
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
    case SET_SPOT_IMAGES:
      return {
        ...state,
        images: action.payload,
      };
    case DELETE_SPOT:
      return {
        ...state,
        spot: action.payload,
      };
    default:
      return state;
  }
};

export default spotsReducer;
