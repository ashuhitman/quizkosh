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

import { Link } from "react-router-dom";
import { MdAddCircle } from "react-icons/md";
import Modal from "../../Components/Modal/Modal";
import { FaFilter } from "react-icons/fa";
import Dropdown from "../../Components/Dropdown/Dropdown";
import { isSubArrayNotEmpty, replaceArrayElements } from "../../utils/utils";

function HomePage() {
  // test context
  const { testState, updateTestState } = useContext(TestContext);

  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(false);

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

  const fetchActiveTestData = async () => {
    // get page size
    const pageSize = testState.pageSize;
    // start index
    const start = (currentPage - 1) * pageSize;
    // end index
    const end = start + pageSize;
    const data = visibleTest === 0 ? testState.tests : testState.latest;
    // check the page size if page item is less than pageSize
    if (isSubArrayNotEmpty(data, start, end)) {
      updateTestState({ visibleTests: data.slice(start, end) });
      return;
    }
    const url =
      visibleTest === 0
        ? `${API_ENDPOINTS.TESTS}?page=${currentPage}&pageSize=${pageSize}`
        : `${API_ENDPOINTS.TESTS}/latest?page=${currentPage}&pageSize=${pageSize}`;

    try {
      console.log("fetching...");
      setLoading(true);
      // fetch data
      axios.defaults.withCredentials = true;
      const response = await axios.get(url);

      const tests = response.data.data;

      // append tests
      const updatedData = replaceArrayElements(data, tests, start, end);

      const payload = {
        visibleTests: tests,
        tests: visibleTest === 0 ? updatedData : testState.tests,
        latest: visibleTest === 1 ? updatedData : testState.latest,
        totalPages: {
          alltests:
            visibleTest === 0
              ? response.data.totalPages
              : testState.totalPages.alltests,
          latest:
            visibleTest === 1
              ? response.data.totalPages
              : testState.totalPages.latest,
        },
      };
      // update user tests data

      updateTestState(payload);
    } catch (error) {
      console.error("error: ", error);
    }
    setLoading(false);
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
