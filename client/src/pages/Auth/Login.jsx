import React, { useEffect, useState } from "react";
import styles from "./Auth.module.css";
import Input from "../../Components/Input/Input";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { validateUseData } from "../../utils/validation";
import { useAuth } from "../../context/Auth/AuthState";
import { parseJwt } from "../../utils/parsejwt";
import { AUTH_API_ENDPOINTS } from "../../utils/constants";

function Login() {
  const { login, logout, isValidToken } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [fromErrors, setFormErrors] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormErrors({ ...fromErrors, [e.target.name]: "" });
  };
  const submit = async (e) => {
    e.preventDefault();

    // validate form data

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
        login(result);
        // go to home page
        // navigate("/");
      }
    } catch (error) {
      console.log("error", error);
    }
    setLoading(false);
  };
  useEffect(() => {
    if (isValidToken) {
      navigate("/");
    }
  }, [isValidToken]);
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
