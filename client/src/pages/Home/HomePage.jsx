import React, { useContext, useEffect, useState } from "react";

import "./HomePage.css";
import Header from "../../Components/Header/Header";
import TestCard from "../../Components/TestCard/TestCard";
import axios from "axios";
import { API_ENDPOINTS, subjects } from "../../utils/constants";
import HomePageLoader from "../../Components/HomePageLoader/HomePageLoader";
import TestContext from "../../context/Test/TestContext";
import { actions } from "../../context/Test/TestState";
import Pagination from "../../Components/Pagination/Pagination";
import { useAuth } from "../../context/Auth/AuthState";
import { parseJwt } from "../../utils/parsejwt";
import Alert from "../../Components/Alert/Alert";
import useFetch from "../../Hooks/useFetch";
import { Link } from "react-router-dom";
import { MdAddCircle } from "react-icons/md";
import Modal from "../../Components/Modal/Modal";
import { FaFilter } from "react-icons/fa";
import Dropdown from "../../Components/Dropdown/Dropdown";

function HomePage() {
  // test context
  const { testState, dispatch } = useContext(TestContext);
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  // console.log("testState", testState);

  const [visibleTest, setVisibleTest] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOptions, onOptionSelect] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const totalPages = testState.totalPages;

  // console.log(tests);
  const goToPreviousPage = () => {
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
      setCurrentPage(currentPage + 1);
    }
  };

  const fetchData = async (url, action) => {
    setLoading(true);

    try {
      axios.defaults.withCredentials = true;

      const response = await axios.get(url);

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
    const pageSize = testState.pageSize;
    if (visibleTest === 0) {
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
    }
  };

  const setActiveTest = (activeTest) => {
    if (visibleTest !== activeTest) {
      setVisibleTest(activeTest);
      setCurrentPage(1);
    }
  };

  const clearStorage = (array) => {
    for (let i = 0; i < array.length; i++) {
      localStorage.removeItem(array[i]);
    }
  };
  useEffect(() => {
    const clearFields = [
      "test",
      "time",
      "active",
      "testState",
      "protectedRouteVisited",
    ];
    clearStorage(clearFields);
  }, []);
  useEffect(() => {
    fetchActiveTestData();
  }, [visibleTest, currentPage]);

  return (
    <div className="container">
      <Modal leftFun={() => setModal(false)} modal={modal} />

      <Header showAlert={setShowAlert}>
        {user && (
          <MdAddCircle
            size="23"
            onClick={() => setModal(true)}
            style={{ cursor: "pointer" }}
          />
        )}
      </Header>

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

        <Dropdown
          style={{ marginLeft: "auto" }}
          options={subjects}
          onSearchTerm={setSearchTerm}
          selectedOptions={selectedOptions}
          onOptionSelect={onOptionSelect}
        >
          <FaFilter color="#2c3e50" />
        </Dropdown>
      </div>
      <div className="outer-test-container">
        {loading ? (
          <HomePageLoader />
        ) : (
          <div className="test-container">
            {testState.visibleTests
              .filter((item) => {
                if (selectedOptions.length === 0) return true;
                if (selectedOptions.includes(item.subject.toLowerCase()))
                  return true;
                return false;
              })
              .filter((item) => {
                if (searchTerm.length === 0) return true;
                if (
                  item.subject.toLowerCase().includes(searchTerm.toLowerCase())
                )
                  return true;
                return false;
              })
              .map(
                (test, index) =>
                  test.questions.length !== 0 && (
                    <TestCard
                      key={index}
                      cardData={test}
                      user={visibleTest == 2 && user}
                      currentPage={currentPage}
                    />
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
