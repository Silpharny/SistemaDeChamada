import { Routes, Route } from "react-router-dom";

import SignIn from "../pages/SignIn";
import SignUp from "../pages/SignUp";
import Dashboard from "../pages/Dashboard";
import Profile from "../pages/Profile";
import Custormer from "../pages/Customer";

import Private from "./private";
import New from "../pages/New";

export default function RoutesApp() {
  return (
    <Routes>
      <Route path="/" element={<SignIn />} />
      <Route path="/register" element={<SignUp />} />
      <Route
        path="/dashboard"
        element={
          <Private>
            <Dashboard />
          </Private>
        }
      />
      <Route
        path="/profile"
        element={
          <Private>
            <Profile />
          </Private>
        }
      />
      <Route
        path="/customers"
        element={
          <Private>
            <Custormer />
          </Private>
        }
      />
      <Route
        path="/new"
        element={
          <Private>
            <New />
          </Private>
        }
      />

      <Route
        path="/new/:id"
        element={
          <Private>
            <New />
          </Private>
        }
      />
    </Routes>
  );
}
