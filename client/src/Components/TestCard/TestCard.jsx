import React, { useContext, useEffect, useState } from "react";
import styles from "./TestCard.module.css";
import { useNavigate } from "react-router-dom";
import TestContext from "../../context/Test/TestContext";
import { actions } from "../../context/Test/TestState";
import { getNewArray } from "../../utils/utils";

function TestCard({ cardData }) {
  const navigate = useNavigate();
  const { _id, testName, timer, questionAmount, subject, questions } = cardData;
  const { testState, dispatch } = useContext(TestContext);
  const [test, setTest] = useState();
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
    // set test state
    dispatch({ type: actions.reset, payload: { test: data } });
    // goto quiz page
    navigate(`/tests/${_id}`, { state: cardData });
  };
  return (
    <div className={styles.card}>
      <div className={styles["card-head"]}>{testName}</div>
      <div className={styles["card-body"]}>
        <div>
          Subject: <span>{subject}</span>
        </div>
        <div>
          Question Count: <span>{questionAmount}</span>
        </div>
        <div>
          Time: <span>{timer} minutes</span>
        </div>
      </div>
      <div className={styles["card-footer"]}>
        <button onClick={goToQuizPage}>Start the Test</button>
      </div>
    </div>
  );
}

export default TestCard;
