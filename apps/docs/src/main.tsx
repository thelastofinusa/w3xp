import React from "react";
import ReactDOM from "react-dom/client";
import ContractDocs from "./contract.mdx";
// import "@w3docs/ui/dist/ui.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ContractDocs />
  </React.StrictMode>,
);
