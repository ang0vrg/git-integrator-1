import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import PersonalizarPedido from "./components/PersonalizarPedido/PersonalizarPedido";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <PersonalizarPedido />
  </React.StrictMode>
);
