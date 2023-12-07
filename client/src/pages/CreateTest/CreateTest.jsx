import React, { useRef, useState, useContext, useEffect } from "react";
import Header from "../../Components/Header/Header";
import { MdAddCircle, MdDelete } from "react-icons/md";
import { useAuth } from "../../context/Auth/AuthState";
import { Link, useNavigate } from "react-router-dom";
import TestContext from "../../context/Test/TestContext";
import Alert from "../../Components/Alert/Alert";
import Button from "../../Components/Button/Button";
import "./CreateTest.css";
import { test_page_validation } from "../../utils/validation";
import Modal from "../../Components/Modal/Modal";
import { actions } from "../../context/Test/TestState";
import { API_ENDPOINTS } from "../../utils/constants";
import axios from "axios";
import { MdEditDocument } from "react-icons/md";
import AlertMessage from "../../Components/AlertMessage/AlertMessage";
import CircularComponent from "../../Components/CircularComponent/CircularComponent";
function CreateTest({ mode = "add" }) {
  const { login, logout, isValidToken, token, user } = useAuth();

  const navigate = useNavigate();

  // test context
  const { testState, dispatch } = useContext(TestContext);

  // const [isLoading, testDat] = useNetwork(location);

  const [testId, setTestId] = useState(null);

  const lastVisistedQuestions = useRef(1);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [submit, setSubmit] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [enableSubmitBtn, setEnableSubmitBtn] = useState(false);
  const [modal, setModal] = useState(false);
  const [delQuestion, setDelQuestion] = useState(false);
  const [alertData, setAlertData] = useState({
    show: false,
    message: "",
    success: true,
    style: undefined,
  });

  const [formErrors, setFormErrors] = useState({
    question: "",
    options: [],
    alert: false,
  });

  const [testData, setTestData] = useState([]);
  const [question, setQuestion] = useState("");
  const [option1, setOption1] = useState({ text: "", isAnswer: false });
  const [option2, setOption2] = useState({ text: "", isAnswer: false });
  const [option3, setOption3] = useState({ text: "", isAnswer: false });
  const [option4, setOption4] = useState({ text: "", isAnswer: false });
  useEffect(() => {
    // get id from local storage
    const test = JSON.parse(localStorage.getItem("test") || null);
    if (test) {
      setTestId(test._id);
      if (test.questions[0]) {
        setTestData(test.questions);
        setInputField(test.questions[0]);
      }
    }
    console.log("mode is " + mode);
  }, []);

  useEffect(() => {
    console.log("running on currentpage chstart");
    if (lastVisistedQuestions.current > currentQuestion) {
      // update input field on previous button click
      console.log("update input field on previous button click");
      setInputField(testData[currentQuestion - 1]);
    } else if (lastVisistedQuestions.current < currentQuestion) {
      console.log(
        "next button clicked",
        lastVisistedQuestions.current,
        currentQuestion
      );
      if (typeof testData[currentQuestion - 1] === "undefined") {
        console.log("reset input field");
        setInputField({
          question: "",
          options: [
            { text: "", isAnswer: false },
            { text: "", isAnswer: false },
            { text: "", isAnswer: false },
            { text: "", isAnswer: false },
          ],
        });
        return;
      }

      setInputField(testData[currentQuestion - 1]);
    }
  }, [currentQuestion]);

  const setInputField = (data) => {
    console.log("set input field", mode, data);
    setQuestion(data.question);
    setOption1(data.options[0]);
    setOption2(data.options[1]);
    setOption3(data.options[2]);
    setOption4(data.options[3]);
  };

  const onNext = async (e) => {
    let data = {
      question: question,
      options: [
        { text: option1.text, isAnswer: option1.isAnswer },
        { text: option2.text, isAnswer: option2.isAnswer },
        { text: option3.text, isAnswer: option3.isAnswer },
        { text: option4.text, isAnswer: option4.isAnswer },
      ],
    };
    // validate inputs
    const [isNext, errors] = test_page_validation(data);

    if (!isNext) {
      setFormErrors(errors);

      if (errors.alert) {
        alert("Choose a coorect option");
      }

      return;
    }
    // update question in database
    const updatedData = await updateQuestion(data);
    console.log("updated data: ", updatedData);
    if (updatedData) data = updatedData;
    // add data to textData
    testData[currentQuestion - 1] = data;
    setTestData(testData);
    // save it to localStorage
    const test = JSON.parse(localStorage.getItem("test"));
    test.questions = testData;
    localStorage.setItem("test", JSON.stringify(test));

    // save current question no before upadting it
    lastVisistedQuestions.current = currentQuestion;

    // update current question

    setCurrentQuestion(currentQuestion + 1);

    console.log("next button:", testData);
  };

  const onPrevious = () => {
    // save current question no before upadting it
    lastVisistedQuestions.current = currentQuestion;
    if (currentQuestion === 1) return;
    // update current question
    setCurrentQuestion(currentQuestion - 1);
    // reset form erros
    setFormErrors({
      question: "",
      options: [],
      alert: false,
    });
  };
  const handleRadioChange = (id) => {
    setOption1({ ...option1, isAnswer: false });
    setOption2({ ...option2, isAnswer: false });
    setOption3({ ...option3, isAnswer: false });
    setOption4({ ...option4, isAnswer: false });
    if (id === 0) {
      setOption1({ ...option1, isAnswer: true });
    } else if (id === 1) {
      setOption2({ ...option2, isAnswer: true });
    } else if (id === 2) {
      setOption3({ ...option3, isAnswer: true });
    } else if (id === 3) {
      setOption4({ ...option4, isAnswer: true });
    }
  };

  const handleInputChange = (e, id) => {
    // on change update state connected to input fields

    if (id === -1) {
      setQuestion(e.target.value);
      formErrors.question = "";
    } else {
      formErrors.options[id] = "";
      if (id === 0) {
        setOption1({ ...option1, text: e.target.value });
      } else if (id === 1) {
        setOption2({ ...option2, text: e.target.value });
      } else if (id === 2) {
        setOption3({ ...option3, text: e.target.value });
      } else if (id === 3) {
        setOption4({ ...option4, text: e.target.value });
      }
    }
    setFormErrors(formErrors);
  };

  const onSubmit = (e) => {
    console.log(testData);
    e.preventDefault();

    setShowAlert(true);
  };

  const addQuestions = async () => {
    if (mode === "edit") {
      const test = JSON.parse(localStorage.getItem("test") || null);
      if (test) {
        const testData = testState.myTest;
        for (let i = 0; i < testData.length; i++) {
          for (let j = 0; j < testData[i].length; j++) {
            if (testData[i][j]._id === test._id) {
              testData[i][j] = test;
              break;
            }
          }
        }
        dispatch({
          type: actions.save_mytest,
          payload: {
            tests: testData,
            visibleTest: testState.visibleTests,
          },
        });
      }
      return true;
    }
    const apiUrl = `${API_ENDPOINTS.QUESTIONS_ADD + testId}`;
    console.log(apiUrl);
    try {
      axios.defaults.withCredentials = true;
      const result = await axios.post(apiUrl, testData);
      console.log("result: ", result);
      if (result) {
        // get the data
        const test = result.data.data;
        console.log(test);
        // add test to the list of my tests
        // add it to the myTest
        let myTest = testState.myTest;

        let totalMyPage =
          testState.totalPages.mytest === 0
            ? 0
            : testState.totalPages.mytest - 1;
        console.log(myTest, testState, totalMyPage);

        if (myTest && myTest[0]) {
          const ln = !myTest[totalMyPage] ? 0 : myTest[totalMyPage].length;
          if (ln < testState.pageSize) {
            myTest[totalMyPage][ln + 1] = test;
          } else if (ln === testState.pageSize) {
            myTest[totalMyPage + 1][0] = test;
            totalMyPage = totalMyPage + 1;
          }
          console.log(test, myTest, totalMyPage);
          dispatch({
            type: actions.save_mytest,
            payload: {
              tests: myTest,
              visibleTest: testState.tests[0],
              totalPages: { ...testState.totalPages, mytest: totalMyPage },
            },
          });
        }
        localStorage.removeItem("test");
        setShowAlert(false);
        // navigate to homepage
        navigate("/");
      }
    } catch (error) {
      console.error("Error", error);
      setShowAlert(false);
    }
  };
  const handleShowAlert = (alert) => {
    setAlertData({ ...alertData, ...alert });
  };
  const updateQuestion = async (data) => {
    // update the question in database
    // let data = {
    //   question: question,
    //   options: [
    //     { text: option1.text, isAnswer: option1.isAnswer },
    //     { text: option2.text, isAnswer: option2.isAnswer },
    //     { text: option3.text, isAnswer: option3.isAnswer },
    //     { text: option4.text, isAnswer: option4.isAnswer },
    //   ],
    // };
    // check if data has been changed

    if (currentQuestion <= testData.length) {
      const { _id: id, question, options } = testData[currentQuestion - 1];
      console.log(options, testData[currentQuestion - 1]);
      const { _id: id1, ...rest1 } = options[0];
      const { _id: id2, ...rest2 } = options[1];
      const { _id: id3, ...rest3 } = options[2];
      const { _id: id4, ...rest4 } = options[3];
      const oldData = { question, options: [rest1, rest2, rest3, rest4] };
      if (JSON.stringify(data) === JSON.stringify(oldData)) {
        console.log("no change");
        return;
      }
    }

    try {
      if (mode === "edit") {
        console.log(testData);
        const url =
          currentQuestion > testData.length
            ? API_ENDPOINTS.QUESTIONS_APPEND + testId
            : API_ENDPOINTS.QUESTIONS_UPDATE + testId;
        if (
          testData[currentQuestion - 1] &&
          testData[currentQuestion - 1]._id
        ) {
          data._id = testData[currentQuestion - 1]._id;
        }

        axios.defaults.withCredentials = true;
        const result = await axios.put(url, data);
        data = result.data.data;
        handleShowAlert({
          show: true,
          message: `Question no ${currentQuestion} updated`,
          success: true,
        });
      }
      console.log(data);
      return data;
    } catch (error) {
      console.log("error", error);
      handleShowAlert({
        show: true,
        message: error.response.data.error,
        success: false,
      });
      return null;
    }
  };

  const deleteQuestion = async () => {
    console.log("deleting question");
    const emptyField = {
      question: "",
      options: [
        { text: "", isAnswer: false },
        { text: "", isAnswer: false },
        { text: "", isAnswer: false },
        { text: "", isAnswer: false },
      ],
    };

    try {
      const questionId = testData[currentQuestion - 1]._id;
      const url = `${API_ENDPOINTS.QUESTIONS_DELETE + testId}/${questionId}`;
      axios.defaults.withCredentials = true;
      const result = await axios.delete(url);
      if (result) {
        console.log();
        const test = result.data.test;
        // update test in local storage
        localStorage.setItem("test", JSON.stringify(test));
        // update test in testState
        let mytest = testState.myTest;
        mytest = mytest.map((item) => {
          if (item._id === testId) {
            return test;
          }
          return item;
        });

        dispatch({
          type: actions.save_mytest,
          payload: { tests: mytest, visibleTest: testState.visibleTests },
        });
        // update testData
        setTestData(test.questions);
        setInputField(emptyField);
      }
      console.log(result, url, questionId);
    } catch (error) {
      console.log("error", error);
    }
    return true;
  };

  return (
    <div className="create-test-container">
      <Modal leftFun={() => setModal(false)} modal={modal} mode={mode} />
      <Header home={!isValidToken} showAlert={setShowAlert}>
        <div
          className="edit-circle"
          onClick={() => {
            setModal(true);
            console.log("edit clciked");
            // localStorage.setItem("test", JSON.stringify(cardData));
            // navigate("/tests/edit");
          }}
        >
          <MdEditDocument />
        </div>
      </Header>

      <div className="form-container">
        <AlertMessage data={alertData} handleShowAlert={handleShowAlert} />
        <Alert
          show={showAlert}
          title="Add Questions"
          body="Are you sure you want to submit?"
          handleLeft={addQuestions}
          leftText="Yes"
          rightText="No"
          showHandler={() => setShowAlert(false)}
        />
        <Alert
          show={delQuestion}
          title="Delete Question"
          body={`Are you sure you want to delete question ${currentQuestion} ?`}
          handleLeft={deleteQuestion}
          leftText="Yes"
          rightText="No"
          showHandler={() => setDelQuestion(false)}
        />

        <form>
          <CircularComponent
            color="#2c3e50"
            backgroundColor="#c0392b"
            size="15"
            marginLeft="auto"
            hoverStyle={{ color: "#e74c3c", border: "2px solid #e74c3c" }}
            onClick={() => setDelQuestion(true)}
          >
            <MdDelete />
          </CircularComponent>

          <div className="form-group question-title">
            <div>
              <strong>{currentQuestion}.</strong>

              <textarea
                type="text"
                id="question_title"
                name="question_title"
                placeholder="Enter the question here"
                onChange={(e) => handleInputChange(e, -1)}
                value={question}
              />
            </div>
            <p
              style={{
                color: "red",
                fontSize: "0.8em",
                marginTop: "0px",
                marginBottom: "0px",
              }}
            >
              {formErrors.question}
            </p>
          </div>

          <div className="form-group question-option">
            <div>
              <input
                type="radio"
                id="option1"
                checked={option1.isAnswer}
                onChange={() => handleRadioChange(0)}
                name="option-group"
              />

              <input
                type="text"
                name="option1"
                placeholder="option 1"
                onChange={(e) => handleInputChange(e, 0)}
                value={option1.text}
              />
            </div>
            <p
              style={{
                color: "red",
                fontSize: "0.8em",
                marginTop: "0px",
                marginBottom: "0px",
              }}
            >
              {formErrors.options[0]}
            </p>
          </div>
          <div className="form-group question-option">
            <div>
              <input
                type="radio"
                id="option2"
                checked={option2.isAnswer}
                onChange={() => handleRadioChange(1)}
                name="option-group"
              />

              <input
                type="text"
                name="option2"
                placeholder="option 2"
                onChange={(e) => handleInputChange(e, 1)}
                value={option2.text}
              />
            </div>
            <p
              style={{
                color: "red",
                fontSize: "0.8em",
                marginTop: "0px",
                marginBottom: "0px",
              }}
            >
              {formErrors.options[1]}
            </p>
          </div>
          <div className="form-group question-option">
            <div>
              <input
                type="radio"
                id="option3"
                checked={option3.isAnswer}
                onChange={() => handleRadioChange(2)}
                name="option-group"
              />

              <input
                type="text"
                name="option3"
                placeholder="option 3"
                onChange={(e) => handleInputChange(e, 2)}
                value={option3.text}
              />
            </div>
            <p
              style={{
                color: "red",
                fontSize: "0.8em",
                marginTop: "0px",
                marginBottom: "0px",
              }}
            >
              {formErrors.options[2]}
            </p>
          </div>
          <div className="form-group question-option">
            <div>
              <input
                type="radio"
                id="option4"
                checked={option4.isAnswer}
                onChange={() => handleRadioChange(3)}
                name="option-group"
              />

              <input
                type="text"
                placeholder="option 4"
                name="option4"
                onChange={(e) => handleInputChange(e, 3)}
                value={option4.text}
              />
            </div>
            <p
              style={{
                color: "red",
                fontSize: "0.8em",
                marginTop: "0px",
                marginBottom: "0px",
              }}
            >
              {formErrors.options[3]}
            </p>
          </div>

          <div className="form-footer">
            <Button
              type="button"
              text="Previous"
              disabled={currentQuestion === 1 ? true : false}
              clickFun={onPrevious}
            />
            <div style={{ display: "flex", alignItems: "stretch" }}>
              <Button
                type="button"
                text={mode === "add" ? "Save & Next" : "Update & Next"}
                clickFun={onNext}
              />

              <Button
                type="button"
                text="Submit"
                disabled={!enableSubmitBtn}
                clickFun={onSubmit}
                // style={{ padding: " 6px 10px" }}
              >
                <input
                  style={{ marginRight: "10px" }}
                  type="checkbox"
                  onChange={() => setEnableSubmitBtn((prev) => !prev)}
                />
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateTest;
