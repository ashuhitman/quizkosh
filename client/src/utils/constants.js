// constants.js
const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://quizkosh.onrender.com"
    : "http://127.0.0.1:8000";
export const API_ENDPOINTS = {
  TESTS: API_BASE_URL + "/tests",
  TESTS_CREATE: API_BASE_URL + "/tests/create",
  TESTS_UPDATE: API_BASE_URL + "/tests/",
  TESTS_DELETE: API_BASE_URL + "/tests/",
  QUESTIONS: API_BASE_URL + "/questions",
  QUESTIONS_ADD: API_BASE_URL + "/questions/add/",
  QUESTIONS_UPDATE: API_BASE_URL + "/questions/update/",
  QUESTIONS_APPEND: API_BASE_URL + "/questions/append/",
  QUESTIONS_DELETE: API_BASE_URL + "/questions/delete/",
};

export const AUTH_API_ENDPOINTS = {
  SIGNUP: API_BASE_URL + "/auth/signup",
  LOGIN: API_BASE_URL + "/auth/login",
  LOGOUT: API_BASE_URL + "/auth/logout",
  VALID_TOKEN: API_BASE_URL + "/auth/validate-token",
  TOKEN: API_BASE_URL + "/auth/token",
};

export const MIN_QUESTION = 2;
export const TEXT_LENGTH = 5;

export const subjects = [
  "Maths",
  "Physics",
  "Science",
  "Chemistry",
  "Biology",
  "Current Affairs",
  "GK",
  "History",
  "Polity",
  "Geology",
  "Economics",
];
