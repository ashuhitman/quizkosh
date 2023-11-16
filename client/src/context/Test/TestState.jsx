import React, { useReducer } from "react";
import TestContext from "./TestContext";
import updateObjectInArray from "../../utils/updateObject";

export const actions = {
  submit_test: "SUBMIT_TEST",
  show_solution: "SHOW_SOLUTION",
  reset: "RESET",
  save_tests: "SAVE_TESTS",
  update_test: "UPDATE_TEST",
  restart_test: "RESTART_TEST",
  update_tests: "UPDATE_TESTS",
};
const intialState = {
  chosenOptions: [],
  correctOptions: [],
  showSolution: false,
  test: null,
  tests: [],
};
const testReducer = (state, action) => {
  console.log(action);
  switch (action.type) {
    case actions.save_tests:
      return {
        ...state,
        tests: action.payload.tests,
      };
    case actions.update_tests:
      return {
        ...state,
        tests: [...state.tests, action.payload.test],
      };
    case actions.submit_test:
      return {
        ...state,
        chosenOptions: action.payload.chosenOptions,
        correctOptions: action.payload.correctOptions,
        test: action.payload.data,
        showSolution: false,
      };
    case actions.show_solution:
      return {
        ...state,
        showSolution: true,
      };
    case actions.reset:
      return intialState;
    case actions.restart_test:
      return {
        ...state,
        chosenOptions: [],
        correctOptions: [],
        showSolution: false,
      };
    default:
      return state;
  }
};

function TestState(props) {
  const [testState, dispatch] = useReducer(testReducer, intialState);
  return (
    <TestContext.Provider value={{ testState, dispatch }}>
      {props.children}
    </TestContext.Provider>
  );
}

export default TestState;
