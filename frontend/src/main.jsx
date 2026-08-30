import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import App from "./App.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Toaster
        position="top-center"
        toastOptions={{
          style: { background: "#0d0f11", color: "#c7ccd1", border: "1px solid #2a2f34" },
        }}
      />
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
