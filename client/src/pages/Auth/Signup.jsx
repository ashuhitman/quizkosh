import React, { useState } from "react";
import styles from "./Auth.module.css";
import { Link } from "react-router-dom";
import axios from "axios";
import Input from "../../Components/Input/Input";
import { validateUseData } from "../../utils/validation";
import { AUTH_API_ENDPOINTS } from "../../utils/constants";

function Signup({ changeAuthState, handleShowAlert, loading, setLoading }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    psd: "",
    mobile: "",
  });

  const [fromErrors, setFormErrors] = useState({
    name: "",
    email: "",
    password: "",
    psd: "",
    mobile: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value.trim() });
    setFormErrors({ ...fromErrors, [e.target.name]: "" });
  };
  const submit = async (e) => {
    setLoading(true);
    e.preventDefault();
    // validate form data

    const [isError, errors, data] = validateUseData(formData);
    // if validation fails, show error message
    if (isError) {
      setFormErrors(errors);
      setLoading(false);
      return;
    }
  
    // else submit data
    try {
      axios.defaults.withCredentials = true;
      const result = await axios.post(
        AUTH_API_ENDPOINTS.SIGNUP,
        data
      );
      console.log(result);
      if (result) {
        const message = result.data.success;
        changeAuthState(0);
        handleShowAlert({ show: true, success: true, message });
      }
    } catch (error) {
      console.log("error", error);
      const message = error.response.data.message;
      handleShowAlert({ show: true, success: false, message });
    }
    setLoading(false);
  };
  return (
    <div className={styles.singUp}>
      <form onSubmit={submit}>
        <Input
          handleChange={handleChange}
          value={formData.name}
          type="text"
          name="name"
          placeholder="Name"
          error={fromErrors.name}
        />
        <Input
          handleChange={handleChange}
          value={formData.email}
          type="email"
          name="email"
          placeholder="Email"
          error={fromErrors.email}
        />
        <Input
          handleChange={handleChange}
          value={formData.password}
          type="password"
          name="password"
          placeholder="Password"
          error={fromErrors.password}
        />
        <Input
          handleChange={handleChange}
          value={formData.psd}
          type="password"
          name="psd"
          placeholder="Re-enter Password"
          error={fromErrors.psd}
        />
        <Input
          handleChange={handleChange}
          value={formData.mobile}
          type="text"
          name="mobile"
          placeholder="Mobile number"
          error={fromErrors.mobile}
        />

        <button type="submit">{loading ? "Signing up..." : "SIGN UP"}</button>
      </form>
      <Link to="/">Go to Home Page</Link>
    </div>
  );
}

export default Signup;
