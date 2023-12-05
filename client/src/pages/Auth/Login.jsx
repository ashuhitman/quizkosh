import React, { useEffect, useState } from "react";
import styles from "./Auth.module.css";
import Input from "../../Components/Input/Input";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { validateUseData } from "../../utils/validation";
import { useAuth } from "../../context/Auth/AuthState";
import { parseJwt } from "../../utils/parsejwt";
import { AUTH_API_ENDPOINTS } from "../../utils/constants";
import Loader from "../../Components/Loader/Loader";

function Login({ handleShowAlert, loading, setLoading }) {
  const { login, logout, user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [fromErrors, setFormErrors] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormErrors({ ...fromErrors, [e.target.name]: "" });
  };
  const submit = async (e) => {
    e.preventDefault();

    // validate form data
    setLoading(true);
    const [isError, errors, data] = validateUseData(formData, 0);
    // if validation fails, show error message
    if (isError) {
      setFormErrors(errors);
      setLoading(false);
      return;
    }
    console.log("data", data);
    // else submit data
    try {
      const result = await axios.post(AUTH_API_ENDPOINTS.LOGIN, data, {
        withCredentials: true,
      });
      console.log(result);

      if (result) {
        // go to home page
        // navigate("/");
        const message = result.data.success;
        handleShowAlert(true, message, "#def0d8", "#49754b");
        login(result);
      }
    } catch (error) {
      console.log("error", error);
      handleShowAlert(true, error.response.data.error);
      setLoading(false);
    }
  };
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user]);
  return (
    <div className={styles.loginContainer}>
      <form className={styles.loginForm} onSubmit={submit}>
        <Input
          handleChange={handleChange}
          value={formData.mobile}
          type="email"
          name="email"
          placeholder="Email"
          error={fromErrors.email}
        />

        <Input
          handleChange={handleChange}
          value={formData.mobile}
          type="password"
          name="password"
          placeholder="Password"
          error={fromErrors.password}
        />

        <button type="submit">{loading ? "Logging in..." : "LOGIN"}</button>
      </form>
      <Link to="/">Go to Home Page</Link>
    </div>
  );
}

export default Login;
