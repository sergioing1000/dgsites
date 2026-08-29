import { useState } from "react";

import "./currentlocation1.css";

export default function CurrentLocation({ onUseLocation }) {
  const [status, setStatus] = useState("idle");
  const [location, setLocation] = useState(null);
  const [error, setError] = useState("");

  const detectLocation = () => {
    setError("");
    setStatus("pending");

    if (!navigator.geolocation) {
      setStatus("error");
      setError("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude.toFixed(6),
          longitude: position.coords.longitude.toFixed(6),
        });
        setStatus("success");
      },
      () => {
        setStatus("error");
        setError(
          "Unable to retrieve your location. Check browser permissions and try again."
        );
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  return (
    <div className="location-workspace">
      <div className="location-copy">
        <div className="section-heading">
          <p className="eyebrow">Browser position</p>
          <h2>Use your current location</h2>
          <p>
            Read your device coordinates, review them, then continue into a
            single-site weather report.
          </p>
        </div>

        <div className="privacy-note">
          <span aria-hidden="true">◎</span>
          <p>
            <strong>Location stays in this session.</strong>
            Your browser asks for permission and the coordinates are not stored.
          </p>
        </div>

        <button
          className="button button--primary"
          disabled={status === "pending"}
          onClick={detectLocation}
          type="button"
        >
          {status === "pending" ? "Finding location…" : "Get current location"}
        </button>
      </div>

      <div className="coordinate-instrument" aria-live="polite">
        <div className="instrument-orbit" aria-hidden="true">
          <span />
        </div>
        {location ? (
          <div className="location-result">
            <p>Position acquired</p>
            <dl>
              <div>
                <dt>Latitude</dt>
                <dd>{location.latitude}</dd>
              </div>
              <div>
                <dt>Longitude</dt>
                <dd>{location.longitude}</dd>
              </div>
            </dl>
            {onUseLocation && (
              <button
                className="button button--light"
                onClick={() => onUseLocation(location)}
                type="button"
              >
                Build a report here
              </button>
            )}
          </div>
        ) : (
          <p className="instrument-placeholder">
            <strong>Waiting for a coordinate signal</strong>
            Permission is requested only when you start detection.
          </p>
        )}
      </div>

      {error && (
        <div className="status-message status-message--error" role="alert">
          <strong>Location unavailable</strong>
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
