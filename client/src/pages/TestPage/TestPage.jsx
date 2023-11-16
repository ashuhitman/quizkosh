import React, { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import "./TestPage.css";
import Button from "../../Components/Button/Button";
import { useLocation, useNavigate } from "react-router-dom";
import { test_page_validation } from "../../utils/validation";
import Alert from "../../Components/Alert/Alert";
import useNetwork from "../../Hooks/useNetwork";
import { actions } from "../../context/Test/TestState";
import TestContext from "../../context/Test/TestContext";
import { API_ENDPOINTS } from "../../utils/constants";

function TestPage() {
  const navigate = useNavigate();
  const location = useLocation();
  // test context
  const { testState, dispatch } = useContext(TestContext);

  // const [isLoading, testDat] = useNetwork(location);
  const testId = location.state.testData._id;
  const noOfQuestions = parseInt(location.state.testData.questionAmount);

  const lastVisistedQuestions = useRef(0);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [submit, setSubmit] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

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
    console.log(lastVisistedQuestions, currentQuestion);
    if (lastVisistedQuestions.current > currentQuestion) {
      // update input field on previous button click
      console.log("update input field on previous button click");
      setInputField(testData[currentQuestion - 1]);
    } else if (lastVisistedQuestions.current < currentQuestion) {
      console.log("next button clicked");
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
      console.log("from test data");
      setInputField(testData[currentQuestion - 1]);
    }
  }, [currentQuestion]);

  const setInputField = (data) => {
    setQuestion(data.question);
    setOption1(data.options[0]);
    setOption2(data.options[1]);
    setOption3(data.options[2]);
    setOption4(data.options[3]);
  };

  const onNext = (e) => {
    const data = {
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

    // add data to textData
    testData[currentQuestion - 1] = data;
    setTestData(testData);

    // save current question no before upadting it
    lastVisistedQuestions.current = currentQuestion;
    if (currentQuestion === noOfQuestions) {
      setSubmit(true);
    }

    // update current question
    if (currentQuestion < noOfQuestions) {
      setCurrentQuestion(currentQuestion + 1);
    }
    console.log("next button:", testData);
  };

  const onPrevious = () => {
    // save current question no before upadting it
    lastVisistedQuestions.current = currentQuestion;
    if (currentQuestion === 1) return;
    // update current question
    setCurrentQuestion(currentQuestion - 1);
    // set submit to false
    setSubmit(false);
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
    e.preventDefault();
    if (currentQuestion + 1 < noOfQuestions) return;
    setShowAlert(true);
  };

  const addQuestions = async () => {
    const apiUrl = `${API_ENDPOINTS.QUESTIONS_ADD + testId}`;
    try {
      axios.defaults.withCredentials = true;
      const result = await axios.post(apiUrl, testData);
      console.log("result: ", result);
      if (result) {
        // get the data
        const test = result.data.data;
        test && dispatch({ action: actions.update_tests, payload: { test } });
        // navigate to homepage
        navigate("/");
      }
    } catch (error) {
      console.error("Error", error);
    }
  };

  return (
    <div className="form-container">
      <Alert
        show={showAlert}
        title="Add Questions"
        body="Are you sure you want to submit?"
        handleLeft={addQuestions}
        leftText="Yes"
        rightText="No"
        showHandler={() => setShowAlert(false)}
      />
      <form onSubmit={onSubmit}>
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

          <Button
            type={submit ? "submit" : "button"}
            text={currentQuestion === noOfQuestions ? "Submit" : "Next"}
            clickFun={onNext}
          />
        </div>
      </form>
    </div>
  );
}

export default TestPage;
