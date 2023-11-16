import React, { useState } from "react";
import styles from "./Modal.module.css";
import Button from "../Button/Button";
import OptionField from "../OptionField/OptionField";
import { validation } from "../../utils/validation";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_ENDPOINTS, MIN_QUESTION } from "../../utils/constants";
import Loader from "../Loader/Loader";
import { useAuth } from "../../context/Auth/AuthState";

function Modal({ closeModal, modal }) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { login, logout, isValidToken, token } = useAuth();
  // form values
  const [formValues, setFormValues] = useState({
    testName: "",
    subject: "",
    questionAmount: "",
    timer: "",
  });
  // form errors
  const [formErrors, setFormErrors] = useState({
    testName: "",
    subject: "",
    questionAmount: "",
    timer: "",
  });
  const [options, setOptions] = useState([
    { label: "Select Timer", value: "0" },
  ]);

  const submitFun = (e) => {
    e.preventDefault();

    const [isSubmit, errors] = validation(formValues);
    if (isSubmit) {
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
          const testData = response.data.data;
          console.log("API Response:", testData);

          navigate("/tests/create", { state: { testData } });
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
    const optionItem = [{ label: "Select Timer", value: "0" }];
    if (name === "questionAmount") {
      // update timer field on change question amount field
      if (value >= MIN_QUESTION) {
        for (let i = 0.5; i <= 3; i = i + 0.5) {
          let val = Math.floor((value * i) / 5) * 5;
          if (val !== 0) {
            optionItem.push({ value: val, label: val + " minutes" });
          }
        }
      }
      setOptions(optionItem);
    }
    console.log(e.target.value);
    setFormValues({ ...formValues, [name]: value });
  };

  if (!modal) return <></>;
  return (
    <div className={styles.modal}>
      <div className={styles.overlay} onClick={closeModal}></div>
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
              <input
                type="number"
                placeholder="Number of questions"
                name="questionAmount"
                onChange={handleInputChange}
                min="10"
              />
              <p className={styles.error}>{formErrors.questionAmount}</p>
            </div>
            <div className={styles["form-group"]}>
              <OptionField
                options={options}
                onChange={handleInputChange}
                error={formErrors.timer}
              />
            </div>
            <div className={styles["form-footer"]}>
              <Button
                type="button"
                text="Close"
                ph="8px"
                py="5px"
                radius="2px"
                clickFun={closeModal}
              />
              {}
              <span style={{ margin: "0 10px" }} />
              <Button
                type="submit"
                text="Create"
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
