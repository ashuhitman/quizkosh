import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/Home/HomePage";
import TestPage from "./pages/TestPage/TestPage";
import Quiz from "./pages/Quiz/Quiz";
import ScorePage from "./pages/ScorePage/ScorePage";
import QuizState from "./context/Test/TestState";
import Auth from "./pages/Auth/Auth";
import { AuthState } from "./context/Auth/AuthState";

function App() {
  const routes = [
    {
      path: "/",
      element: <HomePage />,
      requiresAuth: false,
    },
    {
      path: "/tests/create",
      element: <TestPage />,
      requiresAuth: false,
    },
    {
      path: "/tests/:docId",
      element: <Quiz />,
      requiresAuth: false,
    },
    {
      path: "/tests/:docId/result",
      element: <ScorePage />,
      requiresAuth: false,
    },
    {
      path: "/auth",
      element: <Auth />,
      requiresAuth: false,
    },
  ];
  return (
    <AuthState>
      <QuizState>
        <BrowserRouter>
          <Routes>
            {routes.map((route, index) => (
              <Route
                key={route.path}
                path={route.path}
                element={route.element}
              />
            ))}
          </Routes>
        </BrowserRouter>
      </QuizState>
    </AuthState>
  );
}

export default App;
