import axios from "axios";
import React, { useEffect, useReducer, useState } from "react";

const initialState = {
  loading: true,
  data: [],
  error: null,
};
const ACTIONS = {
  FETCH_INIT: "api-request",
  FETCH_SUCCESS: "success",
  FETCH_ERROR: "error",
};
const fetchReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.FETCH_INIT:
      return { ...initialState, loading: true };
    case ACTIONS.FETCH_SUCCESS:
      return { ...initialState, loading: false, data: action.payload };
    case ACTIONS.FETCH_ERROR:
      return { ...initialState, loading: false, error: action.payload };
    default:
      return state;
  }
};

function useFetch(url) {
  console.log("RUNNING USEfETCH....");
  const [state, dispatch] = useReducer(fetchReducer, initialState);
  const fetchData = (url) => {
    dispatch({ type: ACTIONS.FETCH_INIT });
    axios
      .get(url)
      .then((response) => {
        console.log(response);
        dispatch({ type: ACTIONS.FETCH_SUCCESS, payload: response.data });
      })
      .catch((e) => dispatch({ type: ACTIONS.FETCH_ERROR, payload: e.error }));
  };
  useEffect(() => {
    if (!url) {
      console.log("provide valid url");
      return;
    }
    fetchData(url);
  }, []);
  const refetchData = (url) => {
    fetchData(url);
  };

  return { ...state, refetchData };
}

export default useFetch;
