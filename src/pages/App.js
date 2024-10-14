import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
import Login from "./Login";
import Register from "./Register";
import Send from "./Send";
import Dashboard from "./Dashboard";
import SendAnon from "./SendAnon";

function App() {
  const { currentUser } = useContext(AuthContext);

  const ProtectedRouteLogin = ({ children }) => {
    if (!currentUser) {
      return <Navigate to="/login" />;
    }
    return children;
  };
  const ProtectedRouteDashboard = ({ children }) => {
    if (currentUser) {
      return <Navigate to="/" />;
    }
    return children;
  };
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route
            index
            element={
              <ProtectedRouteLogin>
                <Dashboard />
              </ProtectedRouteLogin>
            }
          />
          <Route
            path="login"
            element={
              <ProtectedRouteDashboard>
                <Login />
              </ProtectedRouteDashboard>
            }
          />
          <Route path="register" element={<Register />} />
          <Route
            path="sending"
            element={
              <ProtectedRouteLogin>
                <Send />
              </ProtectedRouteLogin>
            }
          />
          <Route path="sendanon" element={<SendAnon />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
