import React, { useContext, useEffect, useState } from "react";
import "./Profile.css";
import Header from "../../Components/Header/Header";
import { useAuth } from "../../context/Auth/AuthState";
import { useNavigate } from "react-router-dom";
import Dropdown from "../../Components/Dropdown/Dropdown";
import { FaFilter, FaStar } from "react-icons/fa";
import { API_ENDPOINTS, subjects } from "../../utils/constants";
import axios from "axios";
import TestContext from "../../context/Test/TestContext";
import TestCard from "../../Components/TestCard/TestCard";
import { actions } from "../../context/Test/TestState";
import CircularImage from "../../Components/CircularImage/CircularImage";
import Pagination from "../../Components/Pagination/Pagination";
import HomePageLoader from "../../Components/HomePageLoader/HomePageLoader";
import { MdAddCircle } from "react-icons/md";
import CircularComponent from "../../Components/CircularComponent/CircularComponent";
import { FcNext, FcPrevious } from "react-icons/fc";
import { GrNext, GrPrevious } from "react-icons/gr";
import Modal from "../../Components/Modal/Modal";
import Loader from "../../Components/Loader/Loader";
import { MdEmail } from "react-icons/md";
import { MdContactPhone } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import { toSentenceCase } from "../../utils/utils";
import PersonalInfo from "../../Components/PersonalInfo/PersonalInfo";
import AlertMessage from "../../Components/AlertMessage/AlertMessage";
function Profile() {
  const { user } = useAuth();
  console.log(user);
  const [loading, setLoading] = useState(false);
  const [userLoading, setUserLoading] = useState(false);
  const [filter, setFilter] = useState(0);
  const [selectedOptions, onOptionSelect] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { testState, dispatch } = useContext(TestContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [modal, setModal] = useState(false);
  const [alertData, setAlertData] = useState({
    show: false,
    message: "",
    success: true,
    style: undefined,
  });

  useEffect(() => {
    // get user data
    // getUserData();
    getUserTests();
  }, [currentPage, filter]);
  const getUserData = async () => {};

  const getUserTests = async () => {
    console.log(filter, currentPage);
    // if (filter !== 1) return;
    setLoading(true);
    // check if current page data is already loaded
    const data = testState.myTest;
    if (data[currentPage - 1] && data[currentPage - 1].length > 0) {
      dispatch({
        type: actions.update_visibile_tests,
        payload: data[currentPage - 1],
      });
      setLoading(false);
      return;
    }
    try {
      // else fetch user test data
      const pageSize = testState.mobile ? 4 : 8;
      const url = `${API_ENDPOINTS.TESTS}?page=${currentPage}&pageSize=${pageSize}`;
      axios.defaults.withCredentials = true;
      // fetch user tests data
      const response = await axios.post(url, { id: user._id });
      console.log("user tests: ", response.data);
      // save user tests data

      data[currentPage - 1] = response.data.data;
      dispatch({
        type: actions.save_mytest,
        payload: {
          tests: data,
          visibleTest: response.data.data,
          totalPages: {
            ...testState.totalPages,
            mytest: response.data.totalPages,
          },
        },
      });
    } catch (error) {
      console.log("error: ", error);
    }
    setLoading(false);
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
            console.log("clicked");
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
                  <div class="spacer"></div>

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
