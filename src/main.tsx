import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { StudyProvider } from "@/context/StudyContext";
import React from "react";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <StudyProvider>
      <App />
    </StudyProvider>
  </React.StrictMode>
);