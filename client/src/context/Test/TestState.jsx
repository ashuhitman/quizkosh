import React, { useReducer } from "react";
import TestContext from "./TestContext";
import updateObjectInArray from "../../utils/updateObject";

export const actions = {
  reset: "RESET",
  save_tests: "SAVE_TESTS",
  update_test: "UPDATE_TEST",
  save_latest: "LATEST_TEST",
  save_mytest: "SAVE_MYTEST",
  update_visibile_tests: "UPDATE_VISIBLE_TESTS",
  update_tests: "UPDATE_TESTS",
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
    case actions.update_tests:
      return {
        ...state,
        tests: action.payload.tests,
        myTest: action.payload.myTest,
        latest: action.payload.latest,
        visibleTests: action.payload.visibleTests,
        totalPages: action.payload.totalPages,
      };
    case actions.update_test:
      return {
        ...state,
        test: action.payload,
      };

    case actions.reset:
      return { ...state, test: action.payload.test };
    case actions.restart_test:
    default:
      return state;
  }
};

function TestState(props) {
  const [testState, dispatch] = useReducer(testReducer, intialState);
  const updateTestState = ({
    tests = testState.tests,
    latest = testState.latest,
    myTest = testState.myTest,
    visibleTests = testState.visibleTests,
    totalPages = testState.totalPages,
  }) => {
    dispatch({
      type: actions.update_tests,
      payload: {
        tests,
        latest,
        myTest,
        visibleTests,
        totalPages: !totalPages
          ? testState.totalPages
          : { ...testState.totalPages, ...totalPages },
      },
    });
  };
  return (
    <TestContext.Provider value={{ testState, dispatch, updateTestState }}>
      {props.children}
    </TestContext.Provider>
  );
}

export default TestState;
