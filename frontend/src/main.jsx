import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import Dashboard from "./pages/Dashboard";
import Stats from "./pages/Stats";
import ClientRedirect from "./components/ClientRedirect";
import "./styles.css";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      {/* handle direct short-code visits like /RtyAK9us BEFORE the app routes */}
      <Route path="/:code" element={<ClientRedirect />} />

      {/* normal app shell routes */}
      <Route path="/" element={<App />}>
        <Route index element={<Dashboard />} />
        <Route path="code/:code" element={<Stats />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
