import { isError } from "lodash";
import { MIN_QUESTION, TEXT_LENGTH } from "./constants";

const test_page_validation = (values) => {
  const errors = { options: [], alert: false };
  let isNext = true;
  if (!values.question.trim()) {
    errors.question = "Question is required";
    isNext = false;
  } else if (values.question.trim().length <= 5) {
    errors.question = "Question must be longer than 5 characters";
    isNext = false;
  }
  let count = 0;
  for (let option of values.options) {
    errors.options[count] = "";
    if (!option.text) {
      errors.options[count] = "option is required";
      isNext = false;
    }

    count++;
  }

  if (isCorrectOptionChosen(values.options)) {
    if (isNext) {
      isNext = false;
      errors.alert = true;
    }
  }

  return [isNext, errors];
};

const isCorrectOptionChosen = (data) => {
  var valueArr = data.map(function (item) {
    return item.isAnswer;
  });
  return valueArr.every((val, i, arr) => val === arr[0]);
};

const validation = (values) => {
  const errors = {};
  let isSubmit = true;
  if (!values.testName.trim()) {
    errors.testName = "Test name is required";
    isSubmit = false;
  } else if (values.testName.trim().length <= TEXT_LENGTH) {
    errors.testName = `Test name must be longer than ${TEXT_LENGTH} characters`;
    isSubmit = false;
  }

  if (!values.subject.trim()) {
    errors.subject = "Subject name is required";
    isSubmit = false;
  }

  if (values.pmarks < values.nmarks) {
    errors.marks =
      "+ve marks per question cann't be less than -v marks per question";
    isSubmit = false;
  }

  if (values.timer === "0" || !values.timer.trim()) {
    errors.timer = "Enter the timer value in minutes";
    isSubmit = false;
  }
  return [isSubmit, errors];
};

const validateUseData = (data, reg = 1) => {
  console.log("validation", data);
  const errors = {};
  let isError = false;

  if (!data.email) {
    errors.email = "Email is required";
    isError = true;
  }
  if (!data.password) {
    errors.password = "Password is required";
    isError = true;
  }

  if (reg) {
    if (!data.name) {
      errors.name = "Name is required";
      isError = true;
    }

    if (data.password && !data.psd) {
      errors.psd = "Re-enter password";
      isError = true;
    }
    // if(!data.mobile.trim()){
    //   errors.mobile = "Mobile no is required";
    //   isError = true;
    // }
    if (data.password) {
      if (data.password !== data.psd) {
        errors.psd = "Password mismatch";
        isError = true;
      }
    }
  }
  const userData = { ...data };
  if (!isError && reg) {
    // delete re password key
    delete userData.psd;
  }
  return [isError, errors, userData];
};
export { validation, test_page_validation, validateUseData };
