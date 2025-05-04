import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Menu from "./Menu";
import AuthChecker from "./AuthCheker";

const Layout = () => {
  return (
    <>
      <AuthChecker />
      <Menu />
      <Outlet />
      <Footer />
    </>
  );
};

export default Layout;
