import React, { useContext, useEffect, useState } from "react";
import "./Profile.css";
import Header from "../../Components/Header/Header";
import { useAuth } from "../../context/Auth/AuthState";
import { useNavigate } from "react-router-dom";
import Dropdown from "../../Components/Dropdown/Dropdown";
import { FaFilter } from "react-icons/fa";
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
  console.log("test: ", testState);
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

  return (
    <div className="profile-container">
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
      {testState.mobile && (
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
      )}

      {filter === 0 && (
        <div className="user-data-container">
          <div className="personal-info">
            {userLoading ? (
              <Loader
                style={{
                  height: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  border: "1px solid red",
                  textAlign: "center",
                }}
              />
            ) : (
              <>
                <div className="header">
                  <CircularImage
                    imageUrl="https://m.media-amazon.com/images/I/81M8l5kVdVL._SL1500_.jpg"
                    size="120px"
                  />
                  <div>
                    <span></span>
                    {user.name}
                  </div>
                  <div>
                    <button>Edit</button>
                  </div>
                </div>
                <div className="body">
                  <div>
                    <span style={{ color: "grey", fontSize: ".9em" }}>
                      Email -{" "}
                    </span>
                    {user.email}
                  </div>
                  <div>
                    <span style={{ color: "grey", fontSize: ".9em" }}>
                      Mobile No -{" "}
                    </span>
                    {user.mobile}
                  </div>
                </div>
                <div className="footer"></div>
              </>
            )}
          </div>

          {!testState.mobile && (
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
                        />
                      ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
      {testState.mobile && filter === 1 && (
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
