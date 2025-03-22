import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./components/Header/Header";
import Sidebar from "./components/Sidebar/Sidebar";

export default function Layout() {
  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <Header />

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Outlet (Main Content) */}
        <div className="flex-1 bg-darkbg overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}