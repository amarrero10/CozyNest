import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchSpot, fetchSpotReviews } from "../../store/spots";
import "./SpotDetails.css";

const Spot = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const spot = useSelector((state) => state.spots.spot);
  const reviews = useSelector((state) => state.spots.reviews);

  useEffect(() => {
    dispatch(fetchSpot(id));
    dispatch(fetchSpotReviews(id));
  }, [dispatch, id]);

  if (!spot) {
    return <h1>Uh Oh, that spot doesn't exist</h1>;
  }

  const handleReserve = () => {
    alert("Feature coming soon");
  };

  return (
    <>
      <div className="spot-details">
        <div className="spot-heading">
          <h1>{spot.name}</h1>
          <p>
            Location: {spot.city}, {spot.state}, {spot.country}
          </p>
        </div>
        <div className="spot-images">
          <div className="spot-grid">
            <div className="large-image">
              {spot.SpotImages.length > 0 && <img src={spot.SpotImages[0].url} alt="Large" />}
            </div>
            <div className="small-images">
              {spot.SpotImages.slice(1, 5).map((image) => (
                <img key={image.id} src={image.url} alt="Small" />
              ))}
            </div>
          </div>
        </div>
        <div className="spot-info">
          <div className="spot-text">
            <p>
              Hosted by {spot.Owner.firstName} {spot.Owner.lastName}
            </p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Id ornare arcu odio ut sem nulla pharetra
              diam. Nulla porttitor massa id neque aliquam vestibulum morbi. Purus non enim praesent
              elementum. Auctor neque vitae tempus quam. Ullamcorper velit sed ullamcorper morbi
              tincidunt ornare massa eget. Viverra suspendisse potenti nullam ac. Mauris rhoncus
              aenean vel elit scelerisque mauris pellentesque pulvinar pellentesque. Nibh ipsum
              consequat nisl vel pretium lectus quam id. Eget duis at tellus at urna condimentum
              mattis. Enim facilisis gravida neque convallis. Dictum fusce ut placerat orci nulla.
              Nulla facilisi cras fermentum odio eu feugiat pretium nibh. Laoreet sit amet cursus
              sit amet dictum sit amet. Cursus in hac habitasse platea dictumst quisque sagittis
              purus sit. Viverra orci sagittis eu volutpat odio facilisis mauris sit amet. Tristique
              senectus et netus et malesuada fames ac turpis. Nunc sed augue lacus viverra vitae.
              Est sit amet facilisis magna etiam. Adipiscing at in tellus integer feugiat
              scelerisque varius morbi enim. Tellus pellentesque eu tincidunt tortor aliquam. Lorem
              dolor sed viverra ipsum nunc aliquet. Enim sit amet venenatis urna. Massa enim nec dui
              nunc mattis enim. Venenatis lectus magna fringilla urna. Est lorem ipsum dolor sit
              amet consectetur adipiscing elit pellentesque. Consequat semper viverra nam libero.
              Tempus egestas sed sed risus. Sed risus pretium quam vulputate dignissim suspendisse
              in est. Tortor consequat id porta nibh venenatis cras sed felis eget. Praesent
              tristique magna sit amet purus gravida. In fermentum et sollicitudin ac orci phasellus
              egestas tellus. Faucibus a pellentesque sit amet porttitor eget dolor. Laoreet id
              donec ultrices tincidunt arcu. Risus viverra adipiscing at in tellus integer.
              Elementum integer enim neque volutpat ac. Curabitur gravida arcu ac tortor. Quisque id
              diam vel quam elementum pulvinar etiam non quam. Tristique senectus et netus et
              malesuada fames. Neque vitae tempus quam pellentesque nec nam aliquam. Ultrices
              sagittis orci a scelerisque purus semper eget duis. Eu lobortis elementum nibh tellus
              molestie nunc non blandit massa. Morbi quis commodo odio aenean sed adipiscing diam.
              Pellentesque id nibh tortor id. Morbi tempus iaculis urna id volutpat. Rutrum tellus
              pellentesque eu tincidunt tortor aliquam nulla. Bibendum enim facilisis gravida neque.
              Blandit turpis cursus in hac habitasse platea. Egestas purus viverra accumsan in nisl
              nisi scelerisque.
            </p>
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
                  <p>&#9733; {spot.avgStarRating} </p>
                </div>
                <div>
                  <p>{spot.numReviews} reviews</p>
                </div>
              </div>
            </div>
            <button onClick={handleReserve}>Reserve</button>
          </div>
        </div>
      </div>
      <hr />
      <div className="review-header">
        <h2>&#9733; {spot.avgStarRating}</h2>
        <h2>{spot.numReviews} reviews</h2>
        {reviews.map((review) => {
          return (
            <div>
              <h3>{review.User.firstName}</h3>
              <p>
                {new Date(review.updatedAt).toLocaleString("default", {
                  month: "long",
                  year: "numeric",
                })}
              </p>
              <ul>
                <li>{review.review}</li>
              </ul>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Spot;
