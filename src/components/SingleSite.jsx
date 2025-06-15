import React from "react";
import "./SingleSite.css";

const SingleSite = () => (
  <div className="singlesite-container">
    <h3 className="singlesite-title">Single Site Input</h3>
    <p className="singlesite-description">
      Please enter information for a single site.
    </p>
    <input type="text" placeholder="Site Name" className="singlesite-input" />
  </div>
);

export default SingleSite;
