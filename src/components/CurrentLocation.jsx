import React, { useState } from "react";
import "./currentLocation.css";

const CurrentLocation = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState("");

  const handleGetLocation = () => {
    setError("");
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude.toFixed(6),
          longitude: position.coords.longitude.toFixed(6),
        });
      },
      () => {
        setError("Unable to retrieve your location.");
      }
    );
  };

  return (
    <div className="currentlocation-container">
      <h3 className="currentlocation-title">Use Your Current Location</h3>
      <p className="currentlocation-description">
        Click the button below to detect your current location.
      </p>
      <button className="currentlocation-button" onClick={handleGetLocation}>
        Get Current Location
      </button>

      {location && (
        <div className="location-result">
          <p>
            <strong>Latitude:</strong> {location.latitude}
          </p>
          <p>
            <strong>Longitude:</strong> {location.longitude}
          </p>
        </div>
      )}

      {error && <p className="location-error">{error}</p>}
    </div>
  );
};

export default CurrentLocation;
