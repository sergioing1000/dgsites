import React, { useState } from "react";
import { FaGlobe } from "react-icons/fa";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";

import Radiation from "./radiation.jsx";
import NasaPower from "../assets/images/nasapower.jpeg";

import "./singlesite1.css";
import "leaflet/dist/leaflet.css";

const SingleSite = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    latitude: "",
    longitude: "",
    years: "",
  });
  const [errors, setErrors] = useState({});
  const [showMapModal, setShowMapModal] = useState(false);
  const [markerPosition, setMarkerPosition] = useState(null);
  const [showRadiation, setShowRadiation] = useState(false);

  const LocationMarker = ({ setMarkerPosition, setFormData }) => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setMarkerPosition([lat, lng]);
        setFormData((prev) => ({
          ...prev,
          latitude: lat.toFixed(6),
          longitude: lng.toFixed(6),
        }));
      },
    });
    return null;
  };

  const validateStep = () => {
    const newErrors = {};
    switch (step) {
      case 1:
        if (!formData.latitude) newErrors.latitude = "Latitude is required";
        if (!formData.longitude) newErrors.longitude = "Longitude is required";
        break;
      case 2:
        if (!formData.years)
          newErrors.years = "Please select an option for Historic data";
        break;
      default:
        break;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) setStep((prev) => prev + 1);
  };

  const handleBack = () => setStep((prev) => prev - 1);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSend = () => {
    if (validateStep()) {
      alert(JSON.stringify(formData, null, 2));
      setShowRadiation(true);
    }
  };

  const renderStep = () => {
    return (
      <div className={`form-step step-${step}`}>
        {step === 1 && (
          <>
            <div>
              <label>Latitude:</label>
              <input
                name="latitude"
                value={formData.latitude}
                onChange={handleChange}
              />
              {errors.latitude && (
                <span className="error">{errors.latitude}</span>
              )}
            </div>
            <div>
              <label>Longitude:</label>
              <input
                name="longitude"
                value={formData.longitude}
                onChange={handleChange}
              />
              {errors.longitude && (
                <span className="error">{errors.longitude}</span>
              )}
            </div>
            <button className="map-btn" onClick={() => setShowMapModal(true)}>
              <FaGlobe /> Select on Map
            </button>
          </>
        )}

        {step === 2 && (
          <div>
            <div>
              <a target="" href="https://power.larc.nasa.gov/">
                <img src={NasaPower} alt="Nasa Power Logo" width={200}/>
              </a>
            </div>
            <label>Historic Data:</label>
            <select name="years" value={formData.years} onChange={handleChange}>
              <option value="">--Select--</option>
              <option value="30">Last 30 days</option>
              <option value="12">Last 12 months</option>
              <option value="24">Last 24 months</option>
              <option value="36">Last 36 months</option>
            </select>
            {errors.years && <span className="error">{errors.years}</span>}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="multi-step-form">
      {showRadiation ? (
        <Radiation {...formData} />
      ) : (
        <>
          <h2>INPUT DATA</h2>
          <div className="step-content fade-in">{renderStep()}</div>
          <div className="button-group">
            {step > 1 && (
              <button onClick={handleBack} className="btn back">
                Back
              </button>
            )}
            {step === 1 && (
              <div className="btn_next1_container">
                <button onClick={handleNext} className="btn next">
                  Next
                </button>
              </div>
            )}
            {step === 2 && (
              <button onClick={handleSend} className="btn send">
                Send
              </button>
            )}
          </div>

          {showMapModal && (
            <div className="modal">
              <div className="modal-content">
                <div className="modal-close-button">
                  <button
                    onClick={() => setShowMapModal(false)}
                    style={{
                      position: "relative",
                      background: "#00B0F0",
                      border: "none",
                      color: "#012146",
                      cursor: "pointer",
                      borderRadius: "20px",
                    }}
                    aria-label="Close"
                  >
                    X
                  </button>
                </div>

                <h3>Select Site Location</h3>
                <div
                  style={{
                    height: "300px",
                    width: "100%",
                    marginBottom: "1rem",
                  }}
                >
                  <MapContainer
                    center={[4, -72]}
                    zoom={4}
                    style={{
                      height: "100%",
                      width: "100%",
                      cursor: "crosshair",
                    }}
                  >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <LocationMarker
                      setMarkerPosition={setMarkerPosition}
                      setFormData={setFormData}
                    />
                    {markerPosition && <Marker position={markerPosition} />}
                  </MapContainer>
                </div>
                <button onClick={() => setShowMapModal(false)} className="btn">
                  Confirm
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SingleSite;