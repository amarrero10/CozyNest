import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import LoginFormPage from "./components/LoginFormPage";
import SignUpPage from "./components/SignUpPage";
import Spot from "./components/Spot";
import HomePage from "./components/HomePage";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import CreateSpot from "./components/CreateSpot";
import MySpots from "./components/MySpots";
import EditSpot from "./components/EditSpot";
import MyReviews from "./components/MyReviews";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          <Route exact path="/">
            <HomePage />
          </Route>
          <Route path="/login">
            <LoginFormPage />
          </Route>
          <Route path="/signup">
            <SignUpPage />
          </Route>
          <Route path="/my-spots">
            <MySpots />
          </Route>
          <Route path="/my-reviews">
            <MyReviews />
          </Route>
          <Route
            path="/edit-spot"
            render={({ location }) => <EditSpot location={location} />}
          ></Route>
          <Route path="/create-spot">
            <CreateSpot />
          </Route>
          <Route path="/spots/:id">
            <Spot />
          </Route>
        </Switch>
      )}
    </>
  );
}

export default App;
