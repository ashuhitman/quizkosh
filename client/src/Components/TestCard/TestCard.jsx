import React, { useContext, useEffect, useState } from "react";
import styles from "./TestCard.module.css";
import { useNavigate } from "react-router-dom";
import TestContext from "../../context/Test/TestContext";
import { actions } from "../../context/Test/TestState";
import { getNewArray } from "../../utils/utils";
import { MdEditDocument } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { API_ENDPOINTS } from "../../utils/constants";
import axios from "axios";
import { useAuth } from "../../context/Auth/AuthState";
import Alert from "../Alert/Alert";

function TestCard({ cardData, disabled, currentPage, user }) {
  const navigate = useNavigate();
  const { _id, testName, timer, questionAmount, subject, questions } = cardData;
  const { testState, dispatch } = useContext(TestContext);
  console.log(testState);
  const { login, logout, isValidToken, token, _ } = useAuth();
  const [showAlert, setShowAlert] = useState(false);
  useEffect(() => {}, []);
  const goToQuizPage = () => {
    //clear local storage
    localStorage.removeItem("test");
    const data = { ...cardData };
    const questions = getNewArray(data.questions);
    // update the questions
    data.questions = questions;

    // save current test to local storage
    localStorage.setItem("test", JSON.stringify(data));
    console.log("data", data);
    // set test state
    dispatch({ type: actions.reset, payload: { test: data } });
    // goto quiz page
    navigate(`/tests/${_id}`, { state: cardData });
  };

  const deleteTest = async () => {
    try {
      // url
      const url = `${API_ENDPOINTS.TESTS_DELETE}${cardData._id}`;

      // delete the test from database
      axios.defaults.withCredentials = true;
      await axios.delete(url);
      // delete test from test state
      const updatedTests = testState.myTest;
      updatedTests[currentPage - 1] = updatedTests[currentPage - 1].filter(
        (test) => test._id !== cardData._id
      );
      dispatch({
        type: actions.save_mytest,
        payload: {
          tests: updatedTests,
          visibleTest: updatedTests[currentPage - 1],
        },
      });
    } catch (error) {
      console.log("error: ", error);
    }
  };
  return (
    <>
      <Alert
        show={showAlert}
        showHandler={setShowAlert}
        title="Delete Test"
        body="Are you sure?"
        leftText="Yes"
        handleLeft={deleteTest}
        rightText="No"
      />
      <div
        className={`${styles.card} ${!disabled && styles.enabled}`}
        style={{ backgroundColor: disabled ? "#808080d9" : "#c8d6e5" }}
      >
        {user && (
          <div className={styles.icons}>
            <div className={styles.circle} onClick={() => setShowAlert(true)}>
              <MdDelete />
            </div>
            <div
              className={styles.circle}
              onClick={() => {
                console.log("edit clciked");
                localStorage.setItem("test", JSON.stringify(cardData));
                navigate("/tests/edit");
              }}
            >
              <MdEditDocument />
            </div>
          </div>
        )}
        <div className={styles["card-head"]}>{testName}</div>
        <div className={styles["card-body"]}>
          <div>
            Subject: <span>{subject}</span>
          </div>
          <div>
            Question Count: <span>{questions.length}</span>
          </div>
          <div>
            Time: <span>{timer} minutes</span>
          </div>
        </div>
        <div className={styles["card-footer"]}>
          <button
            onClick={goToQuizPage}
            disabled={disabled}
            style={{ backgroundColor: disabled ? "grey" : "#e67e22" }}
          >
            Start the Test
          </button>
        </div>
      </div>
    </>
  );
}

export default TestCard;
