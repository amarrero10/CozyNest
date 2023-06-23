import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import "./LoginForm.css";
import { Link } from "react-router-dom/cjs/react-router-dom.min";

function LoginFormPage() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  if (sessionUser) return <Redirect to="/" />;

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password })).catch(async (res) => {
      const data = await res.json();
      if (data && data.errors) {
        setErrors(data.errors);
        setTimeout(() => {
          setErrors({});
        }, 2500);
      }
    });
  };

  return (
    <div className="loginContainer">
      <h1>Please Sign In</h1>
      <form onSubmit={handleSubmit} className="loginForm">
        <div>
          <label className="loginLabel">
            <span>Username or Email</span>
            <input
              type="text"
              value={credential}
              onChange={(e) => setCredential(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label className="loginLabel last">
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
        </div>

        <button type="submit">Log In!</button>

        <p>
          Don't have an account?{" "}
          <span>
            <Link to="/signup">Register here!</Link>
          </span>
        </p>

        <div className="errorContainer">
          {errors.credential && <p className="errors">{errors.credential} Please try again!</p>}
        </div>
      </form>
    </div>
  );
}

export default LoginFormPage;
