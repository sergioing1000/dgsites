import React, { useState } from "react";

import SingleSite from "./singlesite.jsx";
import ExcelUploadTable from "./exceluploadtable.jsx";
import CurrentLocation from "./currentlocation.jsx";
import "./options1.css";


const Options1 = () => {
  const [selectedOption, setSelectedOption] = useState("");
  const [showComponent, setShowComponent] = useState(false);

  const handleNext = () => {
    if (selectedOption) setShowComponent(true);
  };

  return (
    <div className="options-container">
      <h2 className="options-title">Select Input Mode</h2>

      <select
        className="options-dropdown"
        value={selectedOption}
        onChange={(e) => {
          setSelectedOption(e.target.value);
          setShowComponent(false); // Reset on change
        }}
      >
        <option value="" disabled>
          Select an option...
        </option>
        <option value="single">Single Site</option>
        <option value="multi">Multiple Sites (Upload an Excel File)</option>
        <option value="current">Current Location</option>
      </select>

      <button
        className={`options-next-button ${
          selectedOption ? "active" : "disabled"
        }`}
        onClick={handleNext}
        disabled={!selectedOption}
      >
        Next
      </button>

      <div className={`options-content ${showComponent ? "show" : ""}`}>
        {showComponent && selectedOption === "single" && <SingleSite />}
        {showComponent && selectedOption === "multi" && <ExcelUploadTable />}
        {showComponent && selectedOption === "current" && <CurrentLocation />}
      </div>
    </div>
  );
};

export default Options1;