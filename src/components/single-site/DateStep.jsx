import FieldError from "./FieldError";

export default function DateStep({
  errors,
  formData,
  onChange,
  onModeChange,
}) {
  return (
    <div className="form-section">
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
