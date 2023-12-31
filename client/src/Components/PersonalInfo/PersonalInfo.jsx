import React, { useEffect, useState } from "react";
import { MdContactPhone, MdEdit, MdEmail } from "react-icons/md";
import CircularImage from "../CircularImage/CircularImage";
import { toSentenceCase } from "../../utils/utils";
import styles from "./PersonalInfo.module.css";
import Button from "../Button/Button";
import Input from "../Input/Input";
import axios from "axios";
import Loader from "../../Components/Loader/Loader";
import { API_ENDPOINTS, USER_ENDPOINTS } from "../../utils/constants";
import { convertToBase64 } from "../../utils/convertToBase64";
import avatar from "../../../src/assets/profilepic.png";

function PersonalInfo({ user, handleShowAlert }) {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [edit, setEdit] = useState(false);

  const [userInfo, setUserInfo] = useState({
    email: "",
    mobile: "",
    name: "",
    image: "",
  });
  const [error, setError] = useState({ mobile: "", name: "" });
  const handleFileUpload = async (e) => {
    // upload the file to the server
    setUploading(true);
    try {
      const file = e.target.files[0];
      const base64 = await convertToBase64(file);

      axios.defaults.withCredentials = true;
      const response = await axios.post(USER_ENDPOINTS.UPLOAD_IMAGE, {
        id: user._id,
        image: base64,
      });
      if (response) {
        const { image } = response.data;
        setUserInfo({ ...userInfo, image });
      }
    } catch (error) {
      console.log("error", error);
    }
    setUploading(false);
  };

  const onChangeHandler = (e) => {
    setError({ ...error, [e.target.name]: "" });
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };

  const updateUserInfo = async () => {
    try {
      setLoading(false);
      const data = { name: userInfo.name, mobile: userInfo.mobile };
      const url = USER_ENDPOINTS.UPDATE + user._id;
      axios.defaults.withCredentials = true;
      const result = await axios.put(url, data);
      const updatedUser = result.data.user;
      if (updatedUser) {
        setUserInfo(updatedUser);
      }

      setEdit(false);
      setLoading(false);
      // show Alert message if user info update is successful
      handleShowAlert({
        show: true,
        success: true,
        message: result.data.message,
      });
    } catch (error) {
      console.log("error updating user: ", error);
      // show Alert if user info update is unsuccessful

      handleShowAlert({
        show: true,
        success: false,
        message: "Couldn't update user information",
      });
      setEdit(false);
      setLoading(false);
    }
  };
  const cancelUpdate = () => {
    setEdit(false);
  };
  useEffect(() => {
    setLoading(true);
    axios.defaults.withCredentials = true;
    axios
      .post(USER_ENDPOINTS.FETCH_USER_INFO + user._id)
      .then((response) => {
        const data = response.data.user;
        if (data) {
          setUserInfo(data);
        }
      })
      .catch((error) => console.log("error: ", error))
      .finally(() => setLoading(false));
  }, []);
  return (
    <div className={styles["personal-info"]}>
      {loading && (
        <div
          style={{
            position: "absolute",
            top: "0px",
            left: "0px",
            bottom: "0px",
            right: "0px",
            backgroundColor: "grey",
            opacity: "0.6",
          }}
        >
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
        </div>
      )}
      {!edit && (
        <div className={styles["personal-info-edit"]}>
          <MdEdit size="20" onClick={() => setEdit(true)} />
        </div>
      )}

      <div className={styles.header}>
        <div className={styles["image-container"]}>
          {uploading && (
            <div
              style={{
                position: "absolute",
                top: "0px",
                left: "0px",
                bottom: "0px",
                right: "0px",
                backgroundColor: "grey",
                opacity: "0.7",
                borderRadius: "50%",
              }}
            >
              <Loader
                style={{
                  height: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                }}
              />
            </div>
          )}
          <CircularImage imageUrl={userInfo.image || avatar} size="120px" />
          <div className={styles.overlay}>
            <label htmlFor="file-upload">Upload</label>
            <input
              type="file"
              name="file"
              id="file-upload"
              accept=".jpeg, .png, .jpg"
              onChange={handleFileUpload}
            />
          </div>
        </div>
        <div>
          {!edit ? (
            toSentenceCase(userInfo.name)
          ) : (
            <Input
              type="text"
              name="name"
              value={userInfo.name}
              disabled={!edit}
              handleChange={onChangeHandler}
            />
          )}
        </div>
      </div>

      <div className={styles.body}>
        <Input type="email" name="email" value={user.email} disabled={true} />
        <Input
          type="text"
          name="mobile"
          value={userInfo.mobile}
          handleChange={onChangeHandler}
          disabled={!edit}
        />
      </div>

      {edit && (
        <div className={styles.footer}>
          <Button
            text="Cancel"
            ph="10px"
            py="8px"
            radius="4px"
            bgColor="grey"
            color="white"
            clickFun={cancelUpdate}
          />
          <Button
            text="Save"
            ph="10px"
            py="8px"
            radius="4px"
            color="white"
            bgColor="green"
            clickFun={updateUserInfo}
          />
        </div>
      )}
    </div>
  );
}

export default PersonalInfo;
