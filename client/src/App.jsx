import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/Home/HomePage";
import Quiz from "./pages/Quiz/Quiz";

import QuizState from "./context/Test/TestState";
import Auth from "./pages/Auth/Auth";
import { AuthState } from "./context/Auth/AuthState";
import CreateTest from "./pages/CreateTest/CreateTest";
import Profile from "./pages/Profile/Profile";
import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute";

function App() {
  const routes = [
    {
      path: "/",
      element: <HomePage />,
      requiresAuth: false,
    },
    {
      path: "/user/profile",
      element: <Profile />,
      requiresAuth: true,
    },
    {
      path: "/tests/create/:testId",
      element: <CreateTest mode="add" />,
      requiresAuth: true,
    },
    {
      path: "/tests/edit/:testId",
      element: <CreateTest mode="edit" />,
      requiresAuth: true,
    },
    {
      path: "/tests/:docId",
      element: <Quiz />,
      requiresAuth: false,
    },

    {
      path: "/auth",
      element: <Auth />,
      requiresAuth: false,
    },
  ];
  return (
    <QuizState>
      <AuthState>
        <BrowserRouter>
          <Routes>
            {routes.map((route, index) => {
              if (route.requiresAuth) {
                return (
                  <Route key={route.path} element={<ProtectedRoute />}>
                    <Route
                      key={route.path}
                      path={route.path}
                      element={route.element}
                    />
                  </Route>
                );
              } else {
                return (
                  <Route
                    key={route.path}
                    path={route.path}
                    element={route.element}
                  />
                );
              }
            })}
          </Routes>
        </BrowserRouter>
      </AuthState>
    </QuizState>
  );
}

export default App;
