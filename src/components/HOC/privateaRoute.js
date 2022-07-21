import React from "react";
import { Outlet, Navigate } from "react-router";

/**
 * This function handles the private routings
 */
const PrivateWrapper = () => {
  const token = window.localStorage.getItem("token");
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};
export default PrivateWrapper;
