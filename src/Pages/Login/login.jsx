import React, { useState } from "react";
import axios from "axios";
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const LoginForm = ({ onLogin }) => {

  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [errorMessages, setErrorMessages] = useState({});
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const errors = {
    username: "Invalid username",
    password: "Invalid password",
    noUsername: "Please enter your username",
    noPassword: "Please enter your password",
  };

  const handleLogin = async (e) => {
    e.preventDefault();


    if (!loginData.username) {
      // Username input is empty
      setErrorMessages({ name: "noUsername", message: errors.noUsername });
      return;
    }

    else if (!loginData.password) {
      // Password input is empty
      setErrorMessages({ name: "noPassword", message: errors.noPassword });
      return;
    }

    else {
      try {
        const response = await axios.post("http://localhost:8080/auth/login", loginData);
        const token = response.data.token;

        onLogin(token);
        navigate('/task_management/dashboard');
        console.log("Login successful. Token:", token);
        localStorage.setItem('token', token);
        localStorage.setItem('isLoggedIn', 'true');
      } catch (error) {

        console.error("Error during login:", error.response.data);
        setError(error.message)
      }
    }
  };

  // Render error messages
  const renderErrorMsg = (name) =>
    name === errorMessages.name && (
      <p className="text-xs text-red-600 ">{errorMessages.message}</p>
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
          <label className="mr-1 text-2xl">Sign in</label>
        </div>
        <form onSubmit={handleLogin}>
          <input className="text-sm w-full mt-5 px-4 py-2 border border-solid border-gray-300 rounded" type="text" placeholder="Username"
            onChange={(e) => setLoginData({ ...loginData, username: e.target.value })} />
          {renderErrorMsg("username")}
          {renderErrorMsg("noUsername")}

          <input className="text-sm w-full px-4 py-2 border border-solid border-gray-300 rounded mt-4" type="password" placeholder="Password"
            onChange={(e) => setLoginData({ ...loginData, password: e.target.value })} />
          {renderErrorMsg("password")}
          {renderErrorMsg("noPassword")}

          <div className="mt-4 flex justify-between font-semibold text-sm">
            <label className="flex text-slate-500 hover:text-slate-600 cursor-pointer">
              <input className="mr-1" type="checkbox"
              />
              <span>Remember Me</span>
            </label>
            <a className="text-blue-600 hover:text-blue-700 hover:underline hover:underline-offset-4" href="#">Forgot Password?</a>
          </div>
          <div className="text-center md:text-left">
            <button className="mt-4 bg-blue-600 hover:bg-blue-700 px-4 py-2 text-white uppercase rounded text-xs tracking-wider" type="submit">Login</button>
          </div>
          <div className="mt-4 font-semibold text-sm text-slate-500 text-center md:text-left">
            Don't have an account? <Link className="text-red-600 hover:underline hover:underline-offset-4" to="/register">Register...</Link>
          </div>
        </form>
      </div >
      {error &&
        <div
          id="toast-danger"
          className="fixed top-10  m-4 p-4 max-w-xs text-gray-500  rounded-lg  z-50 dark:text-gray-400 dark:bg-gray-800"
          role="alert"
        >

          < div id="toast-danger" class="flex z-100   items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800" role="alert">
            <div class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-red-500 bg-red-100 rounded-lg dark:bg-red-800 dark:text-red-200">
              <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z" />
              </svg>
              <span class="sr-only">Error icon</span>
            </div>I
            <div class="ms-3 text-sm font-normal">{error}</div>
            <button type="button" class="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700" data-dismiss-target="#toast-danger" aria-label="Close">
              <span class="sr-only">Close</span>
              <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
              </svg>
            </button>
          </div>
        </div>}
    </section >

  );
};

export default LoginForm;