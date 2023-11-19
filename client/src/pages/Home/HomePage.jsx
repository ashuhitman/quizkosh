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
import useFetch from "../../Hooks/useFetch";

function HomePage() {
  // test context
  const { testState, dispatch } = useContext(TestContext);
  const { login, logout, isValidToken, token, user } = useAuth();
  const [loading, setLoading] = useState(true);

  const [visibleTest, setVisibleTest] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = testState.totalPages;
  const [tests, setTests] = useState([]);
  console.log("homepage: ", testState, totalPages, currentPage);

  // console.log(tests);
  const goToPreviousPage = () => {
    const totalPage =
      visibleTest === 0
        ? totalPages.alltests
        : visibleTest === 1
        ? totalPages.latest
        : totalPages.mytest;
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  const goToNextPage = () => {
    const totalPage =
      visibleTest === 0
        ? totalPages.alltests
        : visibleTest === 1
        ? totalPages.latest
        : totalPages.mytest;
    if (currentPage < totalPage) {
      console.log("next clicked");
      setCurrentPage(currentPage + 1);
    }
  };

  const fetchData = async (url, action) => {
    console.log("fetching tests ...");
    setLoading(true);

    try {
      axios.defaults.withCredentials = true;

      const response =
        action === 2
          ? await axios.post(url, { id: user._id })
          : await axios.get(url);

      let data;
      let actionType;
      let pages;
      if (action === 0) {
        data = testState.tests;
        data[currentPage - 1] = response.data.data;
        actionType = actions.save_tests;
        pages = { alltests: response.data.totalPages };
      } else if (action === 1) {
        data = testState.latest;
        data[currentPage - 1] = response.data.data;
        actionType = actions.save_latest;
        pages = { latest: response.data.totalPages };
      } else if (action === 2) {
        data = testState.myTest;
        data[currentPage - 1] = response.data.data;
        actionType = actions.save_mytest;
        pages = { mytest: response.data.totalPages };
      }

      setLoading(false);
      dispatch({
        type: actionType,
        payload: {
          tests: data,
          visibleTest: response.data.data,
          totalPages: pages,
        },
      });
    } catch (error) {
      setLoading(false);
      console.log("error", error);
    }
  };

  const fetchActiveTestData = () => {
    // check if mobile
    const pageSize = /iphone|ipod|android|ie|blackberry|fennec/.test(
      navigator.userAgent.toLowerCase()
    )
      ? 6
      : 12;
    if (visibleTest === 0) {
      console.log(testState.tests.length);
      if (
        testState.tests[currentPage - 1] &&
        testState.tests[currentPage - 1].length > 0
      ) {
        dispatch({
          type: actions.update_visibile_tests,
          payload: testState.tests[currentPage - 1],
        });
        setLoading(false);
        return;
      }
      fetchData(
        `${API_ENDPOINTS.TESTS}?page=${currentPage}&pageSize=${pageSize}`,
        0
      );
    } else if (visibleTest === 1) {
      if (
        testState.latest[currentPage - 1] &&
        testState.latest[currentPage - 1].length > 0
      ) {
        dispatch({
          type: actions.update_visibile_tests,
          payload: testState.latest[currentPage - 1],
        });
        setLoading(false);
        return;
      }
      fetchData(
        `${API_ENDPOINTS.TESTS}/latest?page=${currentPage}&pageSize=${pageSize}`,
        1
      );
    } else if (visibleTest === 2) {
      if (
        testState.myTest[currentPage - 1] &&
        testState.myTest[currentPage - 1].length > 0
      ) {
        dispatch({
          type: actions.update_visibile_tests,
          payload: testState.myTest[currentPage - 1],
        });
        setLoading(false);
        return;
      }
      fetchData(
        `${API_ENDPOINTS.TESTS}?page=${currentPage}&pageSize=${pageSize}`,
        2
      );
    }
  };

  const setActiveTest = (activeTest) => {
    if (visibleTest !== activeTest) {
      setVisibleTest(activeTest);
      setCurrentPage(1);
    }
  };

  const logoutUser = async () => {
    if (await logout()) {
      const data = testState.tests[0] ? testState.tests[0] : [];
      setVisibleTest(0);
      setCurrentPage(1);
      // dispatch({
      //   type: actions.save_mytest,
      //   payload: { tests: [], visibleTest: data },
      // });
      return true;
    }
    return false;
  };
  useEffect(() => {
    fetchActiveTestData();
  }, [visibleTest, currentPage]);

  return (
    <div className="container">
      <Header home={!isValidToken} showAlert={setShowAlert} />
      <Alert
        show={showAlert}
        showHandler={setShowAlert}
        title="Logout"
        body="Are you sure?"
        leftText="Yes"
        handleLeft={logoutUser}
        rightText="No"
      />
      <div className="filter-text">
        <button
          className={visibleTest === 0 ? "active-filter" : ""}
          onClick={() => setActiveTest(0)}
        >
          All
        </button>
        <button
          className={visibleTest === 1 ? "active-filter" : ""}
          onClick={() => setActiveTest(1)}
        >
          Latest
        </button>
        {isValidToken && (
          <button
            className={visibleTest === 2 ? "active-filter" : ""}
            onClick={() => setActiveTest(2)}
          >
            My Test
          </button>
        )}
      </div>
      <div className="outer-test-container">
        {loading ? (
          <HomePageLoader />
        ) : (
          <div className="test-container">
            {testState.visibleTests.map((test, index) =>
              test.questions.length === 0 ? (
                <TestCard key={index} cardData={test} disabled={true} />
              ) : (
                <TestCard key={index} cardData={test} />
              )
            )}
          </div>
        )}
        <Pagination
          goToPrePage={goToPreviousPage}
          goToNextPage={goToNextPage}
          totalPages={
            visibleTest === 0
              ? totalPages.alltests
              : visibleTest === 1
              ? totalPages.latest
              : totalPages.mytest
          }
          page={currentPage}
        />
      </div>
    </div>
  );
}

export default HomePage;
