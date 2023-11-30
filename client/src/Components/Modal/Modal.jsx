import React, { useContext, useState } from "react";
import styles from "./Modal.module.css";
import Button from "../Button/Button";
import OptionField from "../OptionField/OptionField";
import { validation } from "../../utils/validation";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_ENDPOINTS, MIN_QUESTION } from "../../utils/constants";
import Loader from "../Loader/Loader";
import { useAuth } from "../../context/Auth/AuthState";
import TestContext from "../../context/Test/TestContext";
import { actions } from "../../context/Test/TestState";

function Modal({ leftFun, rightFun, modal, mode = "add" }) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { login, logout, isValidToken, token } = useAuth();
  const { testState, dispatch } = useContext(TestContext);
  // form values
  const [formValues, setFormValues] = useState({
    testName: "",
    subject: "",
    pmarks: 1,
    nmarks: 0,
    timer: "",
  });
  // form errors
  const [formErrors, setFormErrors] = useState({
    testName: "",
    subject: "",
    marks: "",
    timer: "",
  });

  const submitFun = (e) => {
    e.preventDefault();

    const [isSubmit, errors] = validation(formValues);
    if (isSubmit) {
      console.log(formValues);

      // show loader
      setIsLoading(true);
      // add test info to database

      axios.defaults.withCredentials = true;
      axios
        .post(API_ENDPOINTS.TESTS_CREATE, formValues, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          const test = response.data.data;
          console.log("API Response:", test);

          // save data locally
          localStorage.setItem("test", JSON.stringify(test));
          // navigate to create test page
          navigate("/tests/create");
        })
        .catch((error) => {
          console.error("Error", error);
          setIsLoading(false);
        });
    }
    setFormErrors({ ...formErrors, ...errors });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormErrors({ ...formErrors, [name]: "" });
    setFormValues({ ...formValues, [name]: value });
  };

  if (!modal) return <></>;
  return (
    <div className={styles.modal}>
      <div className={styles.overlay} onClick={leftFun}></div>
      <div
        className={`${styles["modal-content"]} ${modal && styles.showModal}`}
      >
        <div className={styles["loader-container"]}>
          {isLoading && <Loader />}
        </div>
        <div className={styles["modal-header"]}>Test Details</div>
        <div className={styles["modal-body"]}>
          <form>
            <div className={styles["form-group"]}>
              <input
                type="text"
                placeholder="Test Name"
                name="testName"
                onChange={handleInputChange}
                maxLength={32}
              />
              <p className={styles.error}>{formErrors.testName}</p>
            </div>
            <div className={styles["form-group"]}>
              <input
                type="text"
                placeholder="Subject Name"
                name="subject"
                onChange={handleInputChange}
              />
              <p className={styles.error}>{formErrors.subject}</p>
            </div>
            <div className={styles["form-group"]}>
              <div className={styles["marks-container"]}>
                <div className={styles.marks}>
                  <label htmlFor="pmarks">Positive Marks</label>
                  <input
                    type="number"
                    value={formValues.pmarks}
                    id="pmarks"
                    name="pmarks"
                    min={0.5}
                    onChange={handleInputChange}
                  />
                </div>
                <div className={styles.marks}>
                  <label htmlFor="nmarks">Negative marks</label>
                  <input
                    type="number"
                    value={formValues.nmarks}
                    id="nmarks"
                    name="nmarks"
                    min={0}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <p className={styles.error}>{formErrors.marks}</p>
            </div>
            <div className={styles["form-group"]}>
              <input
                type="number"
                name="timer"
                onChange={handleInputChange}
                value={formValues.timer}
                placeholder="Test time in minutes (eg. 6)"
              />
              <p className={styles.error}>{formErrors.timer}</p>
            </div>
            <div className={styles["form-footer"]}>
              <Button
                type="button"
                text="Close"
                ph="8px"
                py="5px"
                radius="2px"
                clickFun={leftFun}
              />
              {}
              <span style={{ margin: "0 10px" }} />
              <Button
                type="submit"
                text={mode == "add" ? "Create" : "Update"}
                ph="8px"
                py="5px"
                radius="2px"
                clickFun={submitFun}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Modal;
