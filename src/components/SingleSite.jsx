import React, { useState } from "react";
import { FaGlobe } from "react-icons/fa";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";

import Radiation from "./radiation.jsx";
import NasaPower from "../assets/images/nasapower.jpeg";

import "./singlesite.css";
import "leaflet/dist/leaflet.css";

const SingleSite = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    latitude: "",
    longitude: "",
    years: "",
    batteryType: "",
    autonomy: "",
    autonomyOther: "",
    panelType: "",
    panelOther: "",
    load1: "0",
    load2: "0",
    load3: "0",
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
      case 3:
        if (!formData.batteryType)
          newErrors.batteryType = "Please select a battery type";
        break;
      case 4:
        if (!formData.autonomy) newErrors.autonomy = "Please select autonomy";
        if (formData.autonomy === "Other" && !formData.autonomyOther)
          newErrors.autonomyOther = "Please input autonomy value in hours...";
        break;
      case 5:
        if (!formData.panelType)
          newErrors.panelType = "Please select Solar panel type";
        if (formData.panelType === "Other" && !formData.panelOther)
          newErrors.panelOther = "Please input panel value in Watts peak";
        break;
      case 6:
        if (!formData.load1) newErrors.load1 = "Please input Load 1 in Watts";
        if (!formData.load2) newErrors.load2 = "Please input Load 2 in Watts";
        if (!formData.load3) newErrors.load3 = "Please input Load 3 in Watts";
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
                <img src={NasaPower} alt="Nasa Power Logo" />
              </a>
            </div>
            <label>Historic Data:</label>
            <select name="years" value={formData.years} onChange={handleChange}>
              <option value="">--Select--</option>
              <option value="1">One year</option>
              <option value="2">Two years</option>
              <option value="3">Three years</option>
            </select>
            {errors.years && <span className="error">{errors.years}</span>}
          </div>
        )}

        {step === 3 && (
          <div>
            <label>Battery Type [Ah]</label>
            <select
              name="batteryType"
              value={formData.batteryType}
              onChange={handleChange}
            >
              <option value="">--Select--</option>
              <option value="411">411 (150Ah)</option>
              <option value="311">311 (100Ah)</option>
              <option value="121">121 (50Ah)</option>
            </select>
            {errors.batteryType && (
              <span className="error">{errors.batteryType}</span>
            )}
          </div>
        )}

        {step === 4 && (
          <div>
            <label>Autonomy [h]:</label>
            <select
              name="autonomy"
              value={formData.autonomy}
              onChange={handleChange}
            >
              <option value="">--Select--</option>
              <option value="6">6 hours</option>
              <option value="12">12 hours</option>
              <option value="18">18 hours</option>
              <option value="24">24 hours</option>
              <option value="36">36 hours</option>
              <option value="Other">Other</option>
            </select>
            {formData.autonomy === "Other" && (
              <input
                name="autonomyOther"
                placeholder="Enter hours"
                value={formData.autonomyOther}
                onChange={handleChange}
              />
            )}
            {(errors.autonomy || errors.autonomyOther) && (
              <span className="error">
                {errors.autonomy || errors.autonomyOther}
              </span>
            )}
          </div>
        )}

        {step === 5 && (
          <div>
            <label>Solar Panel Type:</label>
            <select
              name="panelType"
              value={formData.panelType}
              onChange={handleChange}
            >
              <option value="">--Select--</option>
              <option value="530">530 Wp</option>
              <option value="550">550 Wp</option>
              <option value="585">585 Wp</option>
              <option value="Other">Other</option>
            </select>
            {formData.panelType === "Other" && (
              <input
                name="panelOther"
                placeholder="Enter Wp"
                value={formData.panelOther}
                onChange={handleChange}
              />
            )}
            {(errors.panelType || errors.panelOther) && (
              <span className="error">
                {errors.panelType || errors.panelOther}
              </span>
            )}
          </div>
        )}

        {step === 6 && (
          <>
            <div>
              <label>Load 1 [W]:</label>
              <input
                name="load1"
                value={formData.load1}
                onChange={handleChange}
              />
              {errors.load1 && <span className="error">{errors.load1}</span>}
            </div>
            <div>
              <label>Load 2 [W]:</label>
              <input
                name="load2"
                value={formData.load2}
                onChange={handleChange}
              />
              {errors.load2 && <span className="error">{errors.load2}</span>}
            </div>
            <div>
              <label>Load 3 [W]:</label>
              <input
                name="load3"
                value={formData.load3}
                onChange={handleChange}
              />
              {errors.load3 && <span className="error">{errors.load3}</span>}
            </div>
          </>
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
          <h2>INPUNT DATA</h2>
          <div className="step-content fade-in">{renderStep()}</div>
          <div className="button-group">
            {step > 1 && step <= 6 && (
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
            {step > 1 && step < 6 && (
              <button onClick={handleNext} className="btn next">
                Next
              </button>
            )}
            {step === 6 && (
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