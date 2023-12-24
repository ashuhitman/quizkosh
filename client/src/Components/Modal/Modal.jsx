import React, { useContext, useEffect, useState } from "react";
import styles from "./Modal.module.css";
import Button from "../Button/Button";
import { validation } from "../../utils/validation";
import { useNavigate } from "react-router-dom";
import { API_ENDPOINTS, MIN_QUESTION } from "../../utils/constants";
import Loader from "../Loader/Loader";
import TestContext from "../../context/Test/TestContext";
import { onTestAdd } from "../../utils/utils";
import useNetwork from "../../Hooks/useNetwork";
const initialState = {
  testName: "",
  subject: "",
  pmarks: "",
  nmarks: "",
  timer: "",
};

function Modal({ leftFun, rightFun, modal, mode = "add", handleShowAlert }) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const { handleRequest } = useNetwork();
  const { testState, updateTestState } = useContext(TestContext);
  const data = JSON.parse(localStorage.getItem("test"));

  // form values
  const [formValues, setFormValues] = useState(initialState);
  // form errors
  const [formErrors, setFormErrors] = useState({
    testName: "",
    subject: "",
    marks: "",
    timer: "",
  });

  const submitFun = async (e) => {
    e.preventDefault();
    setMessage("");

    const [isSubmit, errors] = validation(formValues);
    if (isSubmit) {
      // show loader
      setIsLoading(true);

      try {
        const response =
          mode === "edit"
            ? await handleRequest(
                API_ENDPOINTS.TESTS_UPDATE + data._id,
                "PUT",
                formValues
              )
            : await handleRequest(
                API_ENDPOINTS.TESTS_CREATE,
                "POST",
                formValues
              );
        const test = response.test;
        const pageSize = testState.pageSize;
        // add test to global store
        const { tests, myTest, latest, totalPages } = onTestAdd(
          testState,
          test,
          pageSize
        );
        updateTestState({ tests, myTest, latest, totalPages });
        // navigate to create test page
        localStorage.setItem("test", JSON.stringify(test));
        if (mode !== "edit") {
          navigate("/tests/create/" + test._id);
        }
        if (handleShowAlert)
          handleShowAlert({
            show: true,
            success: true,
            message: response.message,
          });
        leftFun();
      } catch (error) {
        console.error("Error", error);
        setMessage(error.response.message);
      }
      setIsLoading(false);
    }
    setFormErrors({ ...formErrors, ...errors });
    // setFormValues(initialState);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormErrors({ ...formErrors, [name]: "" });
    setFormValues({ ...formValues, [name]: value });
  };
  useEffect(() => {
    if (mode === "edit" && data) {
      setFormValues({
        testName: data.testName,
        subject: data.subject,
        timer: data.timer,
        pmarks: data.pmarks,
        nmarks: data.nmarks,
      });
    }
  }, []);
  if (!modal) return <></>;
  return (
    <div className={styles.modal}>
      <div className={styles.overlay} onClick={leftFun}></div>
      <div
        className={`${styles["modal-content"]} ${modal && styles.showModal}`}
      >
        <div className={styles["loader-container"]}>
          {isLoading && <Loader />}
          {<p className={styles.error}>{message}</p>}
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
                value={formValues.testName}
              />
              <p className={styles.error}>{formErrors.testName}</p>
            </div>
            <div className={styles["form-group"]}>
              <input
                type="text"
                placeholder="Subject Name"
                name="subject"
                onChange={handleInputChange}
                value={formValues.subject}
              />
              <p className={styles.error}>{formErrors.subject}</p>
            </div>
            <div className={styles["form-group"]}>
              <input
                type="number"
                value={formValues.pmarks}
                id="pmarks"
                name="pmarks"
                min={0.5}
                onChange={handleInputChange}
                placeholder="Positive marks per correct question"
              />

              <p className={styles.error}>{formErrors.marks}</p>
            </div>
            <div className={styles["form-group"]}>
              <input
                type="number"
                value={formValues.nmarks}
                id="nmarks"
                name="nmarks"
                min={0}
                placeholder="Negative marks per wrong question"
                onChange={handleInputChange}
              />
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
                clickFun={() => {
                  leftFun();
                  setIsLoading(false);
                }}
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
