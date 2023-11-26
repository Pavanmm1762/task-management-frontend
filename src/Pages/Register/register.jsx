import React, { useState } from "react";
import "./register.css";
import axios from "axios";
import { Link } from 'react-router-dom';

const RegisterForm = ({ setIsLoggedIn }) => {

  const [signupdata, setSignUpData] = useState({ username: "", email: "", password: "" });
  const [errorMessages, setErrorMessages] = useState({});

  const errors = {
    username: "Invalid username",
    password: "Invalid password",
    email: "Invalid email",
    noEmail: "Please enter your Email",
    noUsername: "Please enter your username",
    noPassword: "Please enter your password",

  };

  const handleLogin = async (e) => {
    e.preventDefault();


    if (!signupdata.username) {
      // Username input is empty
      setErrorMessages({ name: "noUsername", message: errors.noUsername });
      return;
    }

    else if (!signupdata.email) {
      // Email input is empty
      setErrorMessages({ name: "noEmail", message: errors.noEmail });
      return;
    }

    else if (!signupdata.password) {
      // Password input is empty
      setErrorMessages({ name: "noPassword", message: errors.noPassword });
      return;
    }

    else {
      try {
        const response = await axios.post("http://localhost:8080/auth/register", signupdata);
        console.log(response.data);
      } catch (error) {
        console.error("Error during register:", error.response.data);
      }
    }
  };

  // Render error messages
  const renderErrorMsg = (name) =>
    name === errorMessages.name && (
      <p className="error_msg">{errorMessages.message}</p>
    );

  return (
    <section className="h-screen flex flex-col md:flex-row justify-center space-y-10 md:space-y-0 md:space-x-16 items-center my-2 mx-5 md:mx-0 md:my-0">

      <div className="md:w-1/3 max-w-sm">
        <img
          src="https://tecdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
          alt="Sample image" />
      </div>
      <div className="md:w-1/3 max-w-sm">
        <div className="text-center md:text-left">
          <label className="mr-1 text-2xl">Sign Up</label>
        </div>
        <form onSubmit={handleLogin}>
          <input className="text-sm w-full mt-5 px-4 py-2 border border-solid border-gray-300 rounded" type="text" placeholder="Username"
            onChange={(e) => setSignUpData({ ...signupdata, username: e.target.value })} />
          {renderErrorMsg("username")}
          {renderErrorMsg("noUsername")}


          <input className="text-sm w-full px-4 py-2 border border-solid border-gray-300 rounded mt-4" type="email" placeholder="Email"
            onChange={(e) => setSignUpData({ ...signupdata, email: e.target.value })} />
          {renderErrorMsg("email")}
          {renderErrorMsg("noEmail")}

          <input className="text-sm w-full px-4 py-2 border border-solid border-gray-300 rounded mt-4" type="password" placeholder="Password"
            onChange={(e) => setSignUpData({ ...signupdata, password: e.target.value })} />
          {renderErrorMsg("password")}
          {renderErrorMsg("noPassword")}


          <div className="text-center md:text-left">
            <button className="mt-4 bg-blue-600 hover:bg-blue-700 px-4 py-2 text-white uppercase rounded text-xs tracking-wider" type="submit">Register</button>
          </div>
          <div className="mt-4 font-semibold text-sm text-slate-500 text-center md:text-left">
            Already an Account? <Link className="text-red-600 hover:underline hover:underline-offset-4" to="/login">Login...</Link>
          </div>
        </form>
      </div >

    </section >

  );
};

export default RegisterForm;