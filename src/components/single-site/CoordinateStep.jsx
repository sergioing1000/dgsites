import FieldError from "./FieldError";

export default function CoordinateStep({
  errors,
  formData,
  onChange,
  onOpenMap,
}) {
  return (
    <div className="form-section">
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
