import React, { useReducer } from "react";
import TestContext from "./TestContext";
import updateObjectInArray from "../../utils/updateObject";

export const actions = {
  submit_test: "SUBMIT_TEST",
  show_solution: "SHOW_SOLUTION",
  reset: "RESET",
  save_tests: "SAVE_TESTS",
  update_test: "UPDATE_TEST",
  save_latest: "LATEST_TEST",
  save_mytest: "SAVE_MYTEST",
  update_visibile_tests: "UPDATE_VISIBLE_TESTS",
};
const intialState = {
  test: null,
  tests: [],
  latest: [],
  myTest: [],
  visibleTests: [],
  totalPages: {
    alltests: 1,
    latest: 1,
    mytest: 1,
  },
  pageSize: /iphone|ipod|android|ie|blackberry|fennec/.test(
    navigator.userAgent.toLowerCase()
  )
    ? 6
    : 12,
  mobile: window.innerWidth < 768 ? true : false,
};
const testReducer = (state, action) => {
  console.log(action);
  switch (action.type) {
    case actions.save_tests:
      return {
        ...state,
        tests: action.payload.tests,
        visibleTests: action.payload.visibleTest,
        totalPages: action.payload.totalPages
          ? { ...state.totalPages, ...action.payload.totalPages }
          : state.totalPages,
      };
    case actions.save_latest:
      return {
        ...state,
        latest: action.payload.tests,
        visibleTests: action.payload.visibleTest,
        totalPages: action.payload.totalPages
          ? { ...state.totalPages, ...action.payload.totalPages }
          : state.totalPages,
      };
    case actions.save_mytest:
      return {
        ...state,
        myTest: action.payload.tests,
        visibleTests: action.payload.visibleTest,
        totalPages: action.payload.totalPages
          ? { ...state.totalPages, ...action.payload.totalPages }
          : state.totalPages,
      };
    case actions.update_visibile_tests:
      return {
        ...state,
        visibleTests: action.payload,
      };
    case actions.update_test:
      return {
        ...state,
        test: action.payload.test,
      };

    case actions.reset:
      return { ...state, tests: state.tests, test: action.payload.test };
    case actions.restart_test:
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
