import React, { useContext, useEffect, useState } from "react";
import "./Profile.css";
import Header from "../../Components/Header/Header";
import { useAuth } from "../../context/Auth/AuthState";
import Dropdown from "../../Components/Dropdown/Dropdown";
import { FaFilter } from "react-icons/fa";
import { API_ENDPOINTS, subjects } from "../../utils/constants";
import axios from "axios";
import TestContext from "../../context/Test/TestContext";
import TestCard from "../../Components/TestCard/TestCard";
import Pagination from "../../Components/Pagination/Pagination";
import HomePageLoader from "../../Components/HomePageLoader/HomePageLoader";
import { MdAddCircle } from "react-icons/md";
import CircularComponent from "../../Components/CircularComponent/CircularComponent";
import { GrNext, GrPrevious } from "react-icons/gr";
import Modal from "../../Components/Modal/Modal";
import { isSubArrayNotEmpty, replaceArrayElements } from "../../utils/utils";
import PersonalInfo from "../../Components/PersonalInfo/PersonalInfo";
import AlertMessage from "../../Components/AlertMessage/AlertMessage";
import useNetwork from "../../Hooks/useNetwork";
function Profile() {
  const { user } = useAuth();
  const { handleRequest } = useNetwork();
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState(0);
  const [selectedOptions, onOptionSelect] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { testState, dispatch, updateTestState } = useContext(TestContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [modal, setModal] = useState(false);
  const [alertData, setAlertData] = useState({
    show: false,
    message: "",
    success: true,
    style: undefined,
  });

  // console.log(testState);

  useEffect(() => {
    // get user data
    getUserTests();
  }, [currentPage, filter]);

  const getUserTests = async () => {
    console.log(filter, currentPage);

    // get page size
    const pageSize = testState.mobile ? 4 : 8;
    //get user test data
    const data = testState.myTest;
    // start index
    const start = (currentPage - 1) * pageSize;
    // end index
    const end = start + pageSize;
    // check if user test for this page is already loaded
    if (isSubArrayNotEmpty(data, start, end)) {
      console.log("subarray is not empty");
      updateTestState({ visibleTests: data.slice(start, end) });
      return;
    }
    // if first time rendering, fetch user test data
    try {
      setLoading(true);
      console.log("fetching user test data...");
      const url = `${API_ENDPOINTS.TESTS}?page=${currentPage}&pageSize=${pageSize}`;
      // fetch user tests data
      const response = await handleRequest(url, "POST", { id: user._id });
      console.log("user tests: ", response.data);
      // save user tests data
      const tests = response.data;
      // append tests data
      const updatedData = replaceArrayElements(data, tests, start, end);
      const payload = {
        visibleTests: tests,
        myTest: updatedData,
        totalPages: {
          mytest: response.totalPages,
        },
      };
      // update user tests data
      updateTestState(payload);
    } catch (error) {
      console.log("error: ", error);
    } finally {
      setLoading(false);
    }
  };

  const goToPrevPage = () => {
    console.log("prev page");
    if (currentPage === 1) return;
    setCurrentPage((prev) => prev - 1);
  };
  const goToNextPage = () => {
    if (currentPage < testState.totalPages.mytest) {
      setCurrentPage((prev) => prev + 1);
    }
  };
  const handleShowAlert = (alert) => {
    setAlertData({ ...alertData, ...alert });
  };

  return (
    <div className="profile-container">
      <AlertMessage data={alertData} handleShowAlert={handleShowAlert} />
      <Modal leftFun={() => setModal(false)} modal={modal} />
      <Header>
        {user && (
          <MdAddCircle
            size="23"
            onClick={() => setModal(true)}
            style={{ cursor: "pointer" }}
          />
        )}
      </Header>

      <div className="filter-header">
        <button
          className={filter === 0 ? "filter-item" : ""}
          onClick={() => setFilter(0)}
        >
          Profile
        </button>
        <button
          className={filter === 1 ? "filter-item" : ""}
          onClick={() => {
            setFilter(1);
          }}
        >
          My Test
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

      {filter === 0 && (
        <div className="user-data-container">
          <PersonalInfo user={user} handleShowAlert={handleShowAlert} />

          {
            <div className="user-test">
              <Dropdown
                style={{ position: "absolute", top: "6px", right: "8px" }}
                options={subjects}
                onSearchTerm={setSearchTerm}
                selectedOptions={selectedOptions}
                onOptionSelect={onOptionSelect}
              >
                <FaFilter color="#2c3e50" />
              </Dropdown>
              {testState.totalPages.mytest > 1 && (
                <div className="profile-pagination">
                  {currentPage > 1 && (
                    <CircularComponent
                      onClick={goToPrevPage}
                      color="#2c3e50"
                      backgroundColor="red"
                      size="20"
                    >
                      <GrPrevious color="#2c3e50" />
                    </CircularComponent>
                  )}
                  <div className="spacer"></div>

                  {currentPage < testState.totalPages.mytest && (
                    <CircularComponent
                      onClick={goToNextPage}
                      color="#2c3e50"
                      backgroundColor="red"
                      size="20"
                    >
                      <GrNext color="#2c3e50" />
                    </CircularComponent>
                  )}
                </div>
              )}
              <div className="outer-test-container">
                {loading ? (
                  <HomePageLoader />
                ) : (
                  <div className="test-container">
                    {testState.visibleTests
                      .filter((item) => {
                        if (selectedOptions.length === 0) return true;
                        if (
                          selectedOptions.includes(item.subject.toLowerCase())
                        )
                          return true;
                        return false;
                      })
                      .filter((item) => {
                        if (searchTerm.length === 0) return true;
                        if (
                          item.subject
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase())
                        )
                          return true;
                        return false;
                      })
                      .map((test, index) => (
                        <TestCard
                          key={index}
                          disabled={test.questions.length === 0}
                          cardData={test}
                          user={user}
                          currentPage={currentPage}
                        />
                      ))}
                  </div>
                )}
              </div>
            </div>
          }
        </div>
      )}
      {filter === 1 && (
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
                    item.subject
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase())
                  )
                    return true;
                  return false;
                })
                .map((test, index) => (
                  <TestCard
                    key={index}
                    disabled={test.questions.length === 0}
                    cardData={test}
                    user={user}
                    currentPage={currentPage}
                  />
                ))}
            </div>
          )}
          {
            <Pagination
              page={currentPage}
              goToNextPage={goToNextPage}
              goToPrePage={goToPrevPage}
              totalPages={testState.totalPages.mytest}
            />
          }
        </div>
      )}
    </div>
  );
}

export default Profile;
