import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Layout from "./Layout.jsx";
import Github from "./components/Github/Github.jsx";
import Home from "./components/Home/Home.jsx";
import History from "./components/History/History.jsx";
import Liked_Videos from "./components/Liked_Videos/Liked_Videos.jsx";
import Dashboard from "./components/Dashboard/Dashboard.jsx";
import Stats from "./components/Stats/Stats.jsx";



const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route path="" element={<Home />} />
      <Route path="github" element={<Github />} />
      <Route path="history" element={<History />} />
      <Route path="liked_videos" element={<Liked_Videos />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="stats" element={<Stats />} />
    </Route>
  )
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
