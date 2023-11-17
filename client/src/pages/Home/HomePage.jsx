import React, { useContext, useEffect, useState } from "react";

import "./HomePage.css";
import Header from "../../Components/Header/Header";
import TestCard from "../../Components/TestCard/TestCard";
import axios from "axios";
import { API_ENDPOINTS } from "../../utils/constants";
import HomePageLoader from "../../Components/HomePageLoader/HomePageLoader";
import TestContext from "../../context/Test/TestContext";
import { actions } from "../../context/Test/TestState";
import Pagination from "../../Components/Pagination/Pagination";
import { useAuth } from "../../context/Auth/AuthState";
import { parseJwt } from "../../utils/parsejwt";
import Alert from "../../Components/Alert/Alert";

function HomePage() {
  // test context
  const { testState, dispatch } = useContext(TestContext);
  const { login, logout, isValidToken, token, user } = useAuth();

  // get yesterday
  const ystDate = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
  const [tests, setTests] = useState([]);
  const [visibleTest, setVisibleTest] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  // console.log(tests);

  useEffect(() => {
    console.log("homepage: ", testState);
    if (testState.tests.length > 0) {
      return;
    }

    console.log("fetching test data ...");
    axios.defaults.withCredentials = true;
    axios
      .get(API_ENDPOINTS.TESTS)
      .then((response) =>
        dispatch({
          type: actions.save_tests,
          payload: {
            tests: response.data,
          },
        })
      )
      .catch((error) => console.log(error));
  }, []);

  return (
    <div className="container">
      <Header home={!isValidToken} showAlert={setShowAlert} />
      <Alert
        show={showAlert}
        showHandler={setShowAlert}
        title="Logout"
        body="Are you sure?"
        leftText="Yes"
        handleLeft={logout}
        rightText="No"
      />
      <div className="filter-text">
        <button
          className={visibleTest === 0 ? "active-filter" : ""}
          onClick={() => setVisibleTest(0)}
        >
          All
        </button>
        <button
          className={visibleTest === 1 ? "active-filter" : ""}
          onClick={() => setVisibleTest(1)}
        >
          Latest
        </button>
        {isValidToken && (
          <button
            className={visibleTest === 2 ? "active-filter" : ""}
            onClick={() => setVisibleTest(2)}
          >
            My Test
          </button>
        )}
      </div>
      <div className="outer-test-container">
        {testState.tests.length === 0 ? (
          <HomePageLoader />
        ) : (
          <div className="test-container">
            {testState.tests
              .filter((test) => {
                switch (visibleTest) {
                  case 0:
                    return true;
                  case 1:
                    return new Date(test.createdAt) >= ystDate;
                  case 2:
                    console.log("homepage: ", test.user, user);
                    return isValidToken && test.user
                      ? test.user == user._id
                      : false;
                }
              })
              .map((test, index) =>
                test.questions.length === 0 ? (
                  ""
                ) : (
                  <TestCard key={index} cardData={test} />
                )
              )}
          </div>
        )}
        <Pagination />
      </div>
    </div>
  );
}

export default HomePage;
