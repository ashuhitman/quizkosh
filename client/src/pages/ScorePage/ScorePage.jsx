import React, { useContext, useEffect, useState } from "react";
import styles from "./ScorePage.module.css";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";

import { actions } from "../../context/Test/TestState";
import TestContext from "../../context/Test/TestContext";
import { BarChart } from "../../Components/BarChart/BarChart";

Chart.register(CategoryScale);

function ScorePage() {
  // get data passed from previous page
  const { state } = useLocation();

  const [
    score,
    attempted,
    accuracy,
    totalQuestions,
    timeTaken,
    totalTime,
    data,
  ] = state;

  const [chartData, setChartData] = useState(data);
  const navigate = useNavigate();
  const { docId } = useParams();

  // context
  const { testState, dispatch } = useContext(TestContext);

  return (
    <div className={styles.scoreBox}>
      <div className={styles.scorePage}>
        <div className={styles.scoreHead}>Analysis</div>
        <div className={styles.summary}>
          <div className={styles.section}>
            <div>Score</div>
            <div>
              {score}/{totalQuestions}
            </div>
          </div>
          <div className={styles.section}>
            <div>Attempted</div>
            <div>
              {attempted}/{totalQuestions}
            </div>
          </div>
          <div className={styles.section}>
            <div>Accuracy</div>
            <div>{accuracy}%</div>
          </div>
          <div className={styles.section}>
            <div>Time</div>
            <div>
              {timeTaken.hoursString}:{timeTaken.minutesString}:
              {timeTaken.secondsString} /{totalTime} minutes
            </div>
          </div>
        </div>
        <div className={styles.chartSection}>
          {/* <div className={styles.chartHeader}>Question Distribution</div> */}

          <BarChart chartData={chartData} />
        </div>
        <div className={styles.scoreFooter}>
          <button
            onClick={() => {
              dispatch({ type: actions.show_solution });

              navigate(`/tests/${docId}`);
            }}
          >
            Show Solutions
          </button>
          <button onClick={() => navigate("/")}>Go to Tests</button>
          <button
            onClick={() => {
              dispatch({ type: actions.restart_test });
              navigate(`/tests/${docId}`);
            }}
          >
            Restart the Test
          </button>
        </div>
      </div>
    </div>
  );
}

export default ScorePage;
