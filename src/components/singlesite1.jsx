import { lazy, Suspense, useState } from "react";

import { buildReportPayload } from "../domain/dateRange";
import { validateFormStep } from "../domain/siteValidation";
import useReportDownload from "./single-site/useReportDownload";

import "./singlesite1.css";
import "leaflet/dist/leaflet.css";

const EMPTY_FORM = Object.freeze({
  latitude: "",
  longitude: "",
  years: "",
  useCustomDates: false,
  startDate: "",
  endDate: "",
});

const SiteMapDialog = lazy(() => import("./single-site/SiteMapDialog"));

function FieldError({ id, message }) {
  if (!message) return null;
  return (
    <span className="field-error" id={id} role="status">
      {message}
    </span>
  );
}

function CoordinateStep({ errors, formData, onChange, onOpenMap }) {
  return (
    <div className="form-section" key="coordinates">
      <div className="section-heading">
        <p className="eyebrow">Step 01 / Position</p>
        <h2>Locate the station</h2>
        <p>Enter coordinates within the supported territory of Colombia.</p>
      </div>

      <div className="coordinate-grid">
        <div className="field-group">
          <label htmlFor="site-latitude">Latitude</label>
          <div className="field-with-unit">
            <input
              aria-describedby={errors.latitude ? "latitude-error" : undefined}
              aria-invalid={Boolean(errors.latitude)}
              autoComplete="off"
              id="site-latitude"
              inputMode="decimal"
              name="latitude"
              onChange={onChange}
              placeholder="4.609710"
              value={formData.latitude}
            />
            <span aria-hidden="true">N</span>
          </div>
          <FieldError id="latitude-error" message={errors.latitude} />
        </div>

        <div className="field-group">
          <label htmlFor="site-longitude">Longitude</label>
          <div className="field-with-unit">
            <input
              aria-describedby={errors.longitude ? "longitude-error" : undefined}
              aria-invalid={Boolean(errors.longitude)}
              autoComplete="off"
              id="site-longitude"
              inputMode="decimal"
              name="longitude"
              onChange={onChange}
              placeholder="-74.081750"
              value={formData.longitude}
            />
            <span aria-hidden="true">W</span>
          </div>
          <FieldError id="longitude-error" message={errors.longitude} />
        </div>
      </div>

      <button className="text-action" onClick={onOpenMap} type="button">
        <span aria-hidden="true">⌖</span>
        Select coordinates on the map
      </button>
    </div>
  );
}

function DateStep({ errors, formData, onChange, onModeChange }) {
  return (
    <div className="form-section" key="dates">
      <div className="section-heading">
        <p className="eyebrow">Step 02 / Period</p>
        <h2>Set the observation window</h2>
        <p>Use a rolling history or define an exact date interval.</p>
      </div>

      <fieldset className="segmented-fieldset">
        <legend>Time range</legend>
        <label className={!formData.useCustomDates ? "is-selected" : ""}>
          <input
            checked={!formData.useCustomDates}
            name="dateMode"
            onChange={() => onModeChange(false)}
            type="radio"
          />
          <span>Use historic data</span>
        </label>
        <label className={formData.useCustomDates ? "is-selected" : ""}>
          <input
            checked={formData.useCustomDates}
            name="dateMode"
            onChange={() => onModeChange(true)}
            type="radio"
          />
          <span>Use custom dates</span>
        </label>
      </fieldset>

      {!formData.useCustomDates ? (
        <div className="field-group field-group--wide">
          <label htmlFor="historic-period">Historic period</label>
          <select
            aria-describedby={errors.years ? "years-error" : undefined}
            aria-invalid={Boolean(errors.years)}
            id="historic-period"
            name="years"
            onChange={onChange}
            value={formData.years}
          >
            <option value="">Select a period</option>
            <option value="30">Last 30 days</option>
            <option value="12">Last 12 months</option>
            <option value="24">Last 24 months</option>
            <option value="36">Last 36 months</option>
          </select>
          <FieldError id="years-error" message={errors.years} />
        </div>
      ) : (
        <div className="date-grid">
          <div className="field-group">
            <label htmlFor="start-date">Start date</label>
            <input
              aria-describedby={errors.startDate ? "start-date-error" : undefined}
              aria-invalid={Boolean(errors.startDate)}
              id="start-date"
              name="startDate"
              onChange={onChange}
              type="date"
              value={formData.startDate}
            />
            <FieldError id="start-date-error" message={errors.startDate} />
          </div>
          <div className="field-group">
            <label htmlFor="end-date">End date</label>
            <input
              aria-describedby={errors.endDate ? "end-date-error" : undefined}
              aria-invalid={Boolean(errors.endDate)}
              id="end-date"
              name="endDate"
              onChange={onChange}
              type="date"
              value={formData.endDate}
            />
            <FieldError id="end-date-error" message={errors.endDate} />
          </div>
        </div>
      )}
    </div>
  );
}

export default function SingleSite({ initialCoordinates = null }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(() => ({
    ...EMPTY_FORM,
    latitude: initialCoordinates?.latitude ?? "",
    longitude: initialCoordinates?.longitude ?? "",
  }));
  const [errors, setErrors] = useState({});
  const [showMap, setShowMap] = useState(false);
  const [markerPosition, setMarkerPosition] = useState(() =>
    initialCoordinates
      ? [Number(initialCoordinates.latitude), Number(initialCoordinates.longitude)]
      : null
  );
  const report = useReportDownload();

  const validateStep = () => {
    const nextErrors = validateFormStep(step, formData);
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
    report.clearFeedback();
  };

  const handleNext = () => {
    if (validateStep()) setStep(2);
  };

  const handleSend = async () => {
    if (!validateStep()) return;
    await report.generate(buildReportPayload(formData));
  };

  const handleMapSelection = ([latitude, longitude]) => {
    setMarkerPosition([latitude, longitude]);
    setFormData((current) => ({
      ...current,
      latitude: latitude.toFixed(6),
      longitude: longitude.toFixed(6),
    }));
    setErrors((current) => ({
      ...current,
      latitude: undefined,
      longitude: undefined,
    }));
  };

  return (
    <div className="single-site-workspace">
      <aside className="workflow-rail" aria-label="Report progress">
        <p className="eyebrow">Single-site report</p>
        <ol>
          <li className={step === 1 ? "is-active" : "is-complete"}>
            <span>01</span>
            <div>
              <strong>Position</strong>
              <small>Coordinates</small>
            </div>
          </li>
          <li className={step === 2 ? "is-active" : ""}>
            <span>02</span>
            <div>
              <strong>Period</strong>
              <small>Date window</small>
            </div>
          </li>
        </ol>
        <div className="coverage-note">
          <span aria-hidden="true">CO</span>
          <p>
            <strong>Coverage</strong>
            Colombia · daily solar and wind observations
          </p>
        </div>
      </aside>

      <form
        className="report-form"
        onSubmit={(event) => {
          event.preventDefault();
          if (step === 1) handleNext();
          else handleSend();
        }}
      >
        {step === 1 ? (
          <CoordinateStep
            errors={errors}
            formData={formData}
            onChange={handleChange}
            onOpenMap={() => setShowMap(true)}
          />
        ) : (
          <DateStep
            errors={errors}
            formData={formData}
            onChange={handleChange}
            onModeChange={(useCustomDates) => {
              setFormData((current) => ({ ...current, useCustomDates }));
              setErrors({});
              report.clearFeedback();
            }}
          />
        )}

        <div className="form-actions">
          {step === 2 && (
            <button
              className="button button--quiet"
              onClick={() => {
                setStep(1);
                setErrors({});
              }}
              type="button"
            >
              Back
            </button>
          )}
          <button
            className="button button--primary"
            disabled={report.status === "pending"}
            type="submit"
          >
            {step === 1
              ? "Next: choose period"
              : report.status === "pending"
                ? "Generating report…"
                : "Send request"}
          </button>
        </div>

        {report.status === "pending" && (
          <div className="inline-status" data-testid="loader" role="status">
            <span className="activity-dot" />
            NASA POWER is preparing the weather workbook.
          </div>
        )}

        {report.error && (
          <div className="status-message status-message--error" role="alert">
            <strong>Report unavailable</strong>
            <span>{report.error}</span>
          </div>
        )}

        {report.file && (
          <div className="download-result" role="status">
            <div>
              <span className="download-result__icon" aria-hidden="true">XLSX</span>
              <p>
                <strong>Your report is ready</strong>
                <small>{report.file.fileName}</small>
              </p>
            </div>
            <a
              className="button button--download"
              download={report.file.fileName}
              href={report.file.url}
            >
              Download Excel file
            </a>
          </div>
        )}
      </form>

      {showMap && (
        <Suspense fallback={null}>
          <SiteMapDialog
            onClose={() => setShowMap(false)}
            onSelect={handleMapSelection}
            position={markerPosition}
          />
        </Suspense>
      )}
    </div>
  );
}
