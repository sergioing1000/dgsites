import React from "react";
import "./MultiSite.css";

const MultiSite = () => (
  <div className="multisite-container">
    <h3 className="multisite-title">Upload Excel for Multiple Sites</h3>
    <p className="multisite-description">
      Please upload a valid Excel file containing site data.
    </p>
    <input type="file" accept=".xlsx, .xls" className="multisite-file-input" />
  </div>
);

export default MultiSite;
