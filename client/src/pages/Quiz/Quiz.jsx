import React, {
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import _ from "lodash";
import { useLocation, Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { BiArrowBack } from "react-icons/bi";
import { BiSolidChevronRightSquare } from "react-icons/bi";
import { CgMenu } from "react-icons/cg";
import { AiFillPlayCircle, AiFillPauseCircle } from "react-icons/ai";
import { IoIosRefreshCircle } from "react-icons/io";
import { RiRestartFill } from "react-icons/ri";

import styles from "./Quiz.module.css";

import secondsToTime from "../../utils/timeConversion";

import { API_ENDPOINTS } from "../../utils/constants";
import Alert from "../../Components/Alert/Alert";

import TestContext from "../../context/Test/TestContext";

import quizReducer, {
  quizActions,
  quizintialState,
} from "../../reducers/QuizReducers";
import { actions } from "../../context/Test/TestState";
import {
  analytics,
  getDefinedElemenentCount,
  getNewArray,
  visitedQuestion,
} from "../../utils/utils";
import CircularImage from "../../Components/CircularImage/CircularImage";
import useCountdownTimer from "../../Hooks/useCountDownTimer";
import Loader from "../../Components/Loader/Loader";

function Quiz() {
  const { testState, dispatch } = useContext(TestContext);
  const [quizState, quizDispatch] = useReducer(quizReducer, quizintialState);
  console.log(quizState);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  console.log(testState);

  // console.log("quiz initialized: ", quizState);
  // get document id
  const { docId } = useParams();
  const [isTimeLeft, seconds, isRunning, start, resume, stop, pause] =
    useCountdownTimer(null);

  const time = secondsToTime(seconds);

  useEffect(() => {
    // check if it is mobile
    const isMobile = window.innerWidth > 600;

    setShowSidebar(isMobile);
    let time;

    if (!testState.test) {
      // check if data is locally available
      // const localStorageData = JSON.parse(localStorage.getItem("test") || null);
      // if (localStorageData) {
      //   // data is locally available
      //   // set time
      //   time = localStorageData.timer;
      //   // set test data
      //   dispatch({
      //     type: actions.reset,
      //     payload: { test: localStorageData },
      //   });
      // } else {
      console.log("fetching test data...");
      // else fetch it from the server
      axios(`${API_ENDPOINTS.TESTS}/${docId}`)
        .then((response) => {
          console.log(response.data);
          const { test } = response.data;
          // set timer
          time = test.timer;
          dispatch({
            type: actions.update_test,
            payload: test,
          });
          // save current test to local storage
          // localStorage.setItem("test", JSON.stringify(test));
        })
        .catch((error) => {
          console.log("error", error);
        });
      // }
    } else {
      time = testState.test.timer;
    }

    // save  at local storage
    if (!localStorage.getItem("time")) {
      localStorage.setItem("time", parseInt(time) * 60);
    }
    start();
    // get local storage data
    const localData = JSON.parse(
      localStorage.getItem("testState") || JSON.stringify(quizintialState)
    );

    if (!_.isEqual(localData, quizintialState)) {
      // fetch quiz state

      quizDispatch({
        type: quizActions.state_from_local_state,
        payload: localData,
      });
      console.log("localStorageData: ", localData);
    }
  }, []);

  useEffect(() => {
    if (!isTimeLeft && !quizState.submit) {
      submitTest();
    }

    // save state to local storage
    saveStateToLocalStorage(quizState);
  }, [isTimeLeft, quizState, seconds]);

  const submitTest = () => {
    const analyticData = analytics(quizState.answers, testState.test);

    // dispacth action on submit
    quizDispatch({
      type: quizActions.submit_test,
      payload: analyticData,
    });
    // save state to local storage

    saveStateToLocalStorage(quizState);
    stop();
    console.log("submit: ", testState);
    return true;
  };

  const saveStateToLocalStorage = (state) => {
    // store local state on state change
    if (Object.keys(state).length !== 0) {
      localStorage.setItem("testState", JSON.stringify(state));
    }
  };

  const restartTest = () => {
    console.log("Restarting...");

    // restart the test
    localStorage.setItem("time", parseInt(testState.test.timer) * 60);
    localStorage.setItem("active", true);
    start();
    // reset the local storage
    saveStateToLocalStorage(quizintialState);
    // reset quiz state
    quizDispatch({ type: quizActions.restart_test });
  };
  // on previous button click
  const onPrevious = () => {
    if (!isRunning && !quizState.showSolution) return;
    let currentQuestion = quizState.currentQuestion;
    // if current question is 1
    if (currentQuestion === 0) return;
    //else decrement current question
    currentQuestion = currentQuestion - 1;

    // selected option
    const answers = quizState.answers;
    const answer = answers[currentQuestion];
    const selectedOption = answer && answer.selectedOption;
    // answers
    // check if already answered
    // check if not answered and not visited
    if (!answer) {
      answers[currentQuestion] = { selectedOption: null, correctAnswer: null };
    }

    quizDispatch({
      type: quizActions.pre_button,
      payload: { currentQuestion, selectedOption, answers },
    });
  };
  // on next button click
  const onNext = () => {
    if (!isRunning && !quizState.showSolution) return;
    // if current question is equal to total question
    //else increment current question
    const currentQuestion = quizState.currentQuestion;
    const nextQuestion =
      quizState.currentQuestion === testState.test.questions.length - 1
        ? 0
        : quizState.currentQuestion + 1;

    // answers
    const options = testState.test.questions[quizState.currentQuestion].options;
    const correctOption = options.find((option) => option.isAnswer);
    const answers = [...quizState.answers];

    answers[currentQuestion] = {
      selectedOption: quizState.selectedOption,
      correctAnswer: correctOption.text,
    };

    // selected option
    const selectedOption = answers[nextQuestion]
      ? answers[nextQuestion].selectedOption
      : null;

    quizDispatch({
      type: quizActions.next_button,
      payload: {
        currentQuestion: nextQuestion,
        answers,
        selectedOption,
        visited: quizState.visited + 1,
      },
    });

    // saveStateToLocalStorage(quizState);
  };
  const toggleTimer = () => {
    if (!isRunning) {
      resume();
    } else {
      pause();
    }
  };
  // on option change or question no button click
  const handleChange = (chosenOption) => {
    if (!isRunning) return;
    if (quizState.showSolution) return;
    // setSelectedOption(chosenOption);
    quizDispatch({
      type: quizActions.select_option,
      payload: { selectedOption: chosenOption },
    });
  };
  const questionButtonClasses = (i) => {
    const currentQuestion = quizState.currentQuestion;
    const activeClass = currentQuestion === i ? styles["active-question"] : "";
    if (quizState.showSolution) {
      return activeClass;
    }

    const answer = quizState.answers[i];
    if (answer) {
      const attemptedClass = answer.selectedOption
        ? styles["attempted-question"]
        : "";
      const notAttemptedClass =
        answer.selectedOption === null ? styles["not-attempted"] : "";
      return `${activeClass} ${notAttemptedClass} ${attemptedClass}`;
    }
    return activeClass;
  };
  const handleQuestionButtonClick = (i) => {
    if (!isRunning && !quizState.showSolution) return;
    const currentQuestion = quizState.currentQuestion;
    // if same question
    if (currentQuestion === i) return;
    // else update current question
    const answers = [...quizState.answers];
    const answer = answers[i];
    const selectedOption = answer ? answer.selectedOption : null;
    const correctAnswer = answer ? answer.correctAnswer : null;

    answers[i] = { selectedOption, correctAnswer };
    quizDispatch({
      type: quizActions.visit_question,
      payload: {
        currentQuestion: i,
        selectedOption,
        answers,
        visited: quizState.visited + 1,
      },
    });
  };
  const clearResponse = () => {
    if (!isRunning) return;
    const selectedOption = null;
    const answers = quizState.answers;
    const answer = answers[quizState.currentQuestion];
    console.log("clear resonse button clicked: ", answers);
    if (answer) {
      answers[quizState.currentQuestion] = {
        selectedOption: null,
        correctAnswer: answer.correctAnswer,
      };
    }
    quizDispatch({
      type: quizActions.clear_response,
      payload: { answers, selectedOption },
    });
  };

  const getWrongColor = (option) => {
    if (!quizState.showSolution) return;
    const answer = quizState.answers[quizState.currentQuestion];
    if (option.isAnswer) return;
    if (answer) {
      if (answer.selectedOption) {
        if (answer.selectedOption === option.text) return "red";
      }
    }
  };

  if (!testState.test || testState.test.length === 0) {
    console.log("loading...", testState);
    return (
      <div
        style={{
          position: "absolute",
          top: "0px",
          left: "0px",
          right: "0px",
          bottom: "0px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Loader size="40px" borderWidth="8px" />
      </div>
    );
  }

  return (
    <div className={styles.quiz}>
      <Alert
        show={showAlert}
        showHandler={setShowAlert}
        title="Submit Quiz"
        body="Are you sure?"
        leftText="Yes"
        handleLeft={() => submitTest()}
        rightText="No"
      />
      <header className={styles["quiz-header"]}>
        <div className={styles.navbar}>
          <div className={styles.logo}>
            <Link to="/">
              <BiArrowBack />
            </Link>{" "}
            {testState.test.testName}
          </div>
          <div className={styles.links}>
            {!quizState.showSolution ? (
              <div>
                <Link className={styles.link}>
                  <span className={styles.timeLeft}>Time Left</span>{" "}
                  <span>
                    {time && time.hoursString ? time.hoursString : "00"}
                  </span>{" "}
                  :{" "}
                  <span>
                    {time && time.minutesString ? time.minutesString : "00"}
                  </span>{" "}
                  :{" "}
                  <span>
                    {time && time.secondsString ? time.secondsString : "00"}
                  </span>
                </Link>
              </div>
            ) : (
              <RiRestartFill
                color="6D214F"
                size="1.6rem"
                className={styles.icon}
                onClick={restartTest}
              />
            )}
          </div>
        </div>
      </header>

      <div className={styles["quiz-container"]}>
        {showSidebar && (
          <div
            className={styles.overlay}
            onClick={() => setShowSidebar(false)}
          ></div>
        )}
        <div className={styles["sub-header"]}>
          Subject: {testState.test.subject}
          <div className={styles.marks}>
            Marks
            <span
              style={{
                marginLeft: "4px",
                backgroundColor: "green",
                padding: "4px 6px",
                borderRadius: "20px",
                color: "white",
              }}
            >
              +{testState.test.pmarks ? testState.test.pmarks : 2}
            </span>{" "}
            <span
              style={{
                backgroundColor: "red",
                padding: "5px 8px",
                borderRadius: "20px",
                color: "white",
              }}
            >
              -{testState.test.nmarks ? testState.test.nmarks : 0}
            </span>
          </div>
          <div style={{ marginLeft: "auto" }}>
            {!quizState.showSolution &&
              (!isRunning ? (
                <AiFillPlayCircle
                  color="#6D214F"
                  size="1.6rem"
                  style={{
                    marginRight: "10px",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    quizDispatch({ type: quizActions.restart_test });
                    toggleTimer();
                  }}
                />
              ) : (
                <AiFillPauseCircle
                  color="#6D214F"
                  size="1.6rem"
                  style={{
                    marginRight: "10px",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    quizDispatch({
                      type: quizActions.pause_test,
                      payload: seconds,
                    });
                    toggleTimer();
                  }}
                />
              ))}
            <CgMenu
              color="#6D214F"
              size="1.6rem"
              onClick={() => setShowSidebar(true)}
              style={{
                cursor: "pointer",
              }}
            />
          </div>
        </div>
        <div
          className={
            showSidebar
              ? `${styles["quiz-box"]} ${styles.shiftRight}`
              : `${styles["quiz-box"]} ${styles.shiftLeft}`
          }
        >
          <div>
            <strong>Q{quizState.currentQuestion + 1}. </strong>{" "}
            {testState.test.questions[quizState.currentQuestion].question}
          </div>
          <div className={styles.options}>
            <ul>
              {testState.test.questions[quizState.currentQuestion].options.map(
                (option, index) => {
                  return (
                    <li
                      onClick={() => handleChange(option.text)}
                      key={index}
                      style={{
                        backgroundColor:
                          quizState.showSolution && option.isAnswer
                            ? "green"
                            : getWrongColor(option),
                      }}
                    >
                      <input
                        type="radio"
                        name="option"
                        id={"option" + index}
                        value={option.text}
                        checked={quizState.selectedOption === option.text}
                        onChange={(e) => handleChange(e.target.value)}
                      />
                      <label htmlFor={"option" + index}>{option.text}</label>
                    </li>
                  );
                }
              )}
            </ul>
          </div>
          <div className={styles.footer}>
            <button onClick={onPrevious}>Previous</button>
            {!quizState.showSolution && (
              <button onClick={clearResponse}>
                Clear <span className={styles.clear}>Response</span>
              </button>
            )}
            {/* {testState.showSolution && <div>Re-attempt Questions</div>} */}
            <button onClick={onNext}>Save & Next</button>
          </div>
        </div>
        <div
          className={
            showSidebar
              ? `${styles.sidebar} ${styles.showSidebar}`
              : `${styles.sidebar} ${styles.hideSidebar}`
          }
        >
          <div className={styles.profile}>
            <CircularImage
              size="30px"
              imageUrl="https://sketchok.com/images/articles/02-comics/002-superheroes/132/16.jpg"
            />
            <div>Ashutsh Singh</div>
            <div className={styles.close}>
              {!quizState.showSolution &&
                (!isRunning ? (
                  <AiFillPlayCircle
                    color="#6D214F"
                    size="2rem"
                    style={{
                      marginRight: "10px",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      quizDispatch({ type: quizActions.resume_test });
                      toggleTimer();
                    }}
                  />
                ) : (
                  <AiFillPauseCircle
                    color="#6D214F"
                    size="2rem"
                    style={{
                      marginRight: "10px",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      quizDispatch({
                        type: quizActions.pause_test,
                        payload: seconds,
                      });
                      toggleTimer();
                    }}
                  />
                ))}
              <BiSolidChevronRightSquare
                size="2rem"
                onClick={() => setShowSidebar(false)}
                color="#6D214F"
              />
            </div>
          </div>
          <div className={styles.sideUpper}>
            {!quizState.showSolution ? (
              <table style={{ width: "100%" }}>
                <thead>
                  <tr>
                    <td>Answered</td>
                    <td>Not Answered</td>
                    <td>Not Visited</td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th>{getDefinedElemenentCount(quizState.answers)}</th>
                    <th>
                      {testState.test.questions.length -
                        getDefinedElemenentCount(quizState.answers)}
                    </th>
                    <th>
                      {testState.test.questions.length -
                        visitedQuestion(quizState.answers)}
                    </th>
                  </tr>
                </tbody>
              </table>
            ) : (
              <table style={{ width: "100%" }}>
                <thead>
                  <tr>
                    <td>Correct</td>
                    <td>Wrong</td>
                    <td>Accuracy</td>
                    <td>Score</td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th>
                      {quizState.showSolution && quizState.analytics.correct}
                    </th>
                    <th>
                      {quizState.showSolution && quizState.analytics.wrong}
                    </th>
                    <th>
                      {quizState.showSolution && quizState.analytics.accuracy} %
                    </th>
                    <th>
                      {quizState.showSolution &&
                        quizState.analytics.correct -
                          quizState.analytics.wrong}{" "}
                      /{" "}
                      {quizState.showSolution &&
                        quizState.analytics.totalQuestions}
                    </th>
                  </tr>
                </tbody>
              </table>
            )}
          </div>
          <div className={styles["question-nos"]}>
            {[...Array(testState.test.questions.length)].map((e, i) => (
              <button
                key={i}
                onClick={() => {
                  handleQuestionButtonClick(i);
                }}
                className={questionButtonClasses(i)}
                style={{
                  backgroundColor: quizState.showSolution
                    ? quizState.analytics.solutions[i]
                      ? "green"
                      : quizState.analytics.solutions[i] == 0
                      ? "red"
                      : ""
                    : "",
                  color: quizState.showSolution
                    ? quizState.analytics.solutions[i]
                      ? "white"
                      : quizState.analytics.solutions[i] == 0
                      ? "white"
                      : ""
                    : "",
                }}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <button
            type="button"
            disabled={quizState.showSolution}
            className={styles.submitButton}
            onClick={() =>
              !quizState.showSolution && isRunning && setShowAlert(true)
            }
          >
            Submit Test
          </button>
        </div>
      </div>
    </div>
  );
}

export default Quiz;
