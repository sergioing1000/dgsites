import { formatDate } from "./dateRange";

const HISTORIC_RANGE_OPTIONS = new Set(["30", "12", "24", "36"]);
const COLOMBIA_BOUNDS = Object.freeze({
  latitude: { minimum: -4.23, maximum: 12.44 },
  longitude: { minimum: -79.09, maximum: -66.88 },
});

const isEmpty = (value) => String(value ?? "").trim() === "";

const isIsoDate = (value) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && formatDate(date) === value;
};

const validateCoordinate = (value, label, minimum, maximum) => {
  if (isEmpty(value)) return `${label} is required`;

  const coordinate = Number(value);
  if (!Number.isFinite(coordinate)) return `${label} must be a number`;
  if (coordinate < minimum || coordinate > maximum) {
    return `${label} must be between ${minimum} and ${maximum}`;
  }

  return null;
};

export const validateCoordinates = ({ latitude, longitude }) => {
  const errors = {};
  const latitudeError = validateCoordinate(latitude, "Latitude", -90, 90);
  const longitudeError = validateCoordinate(longitude, "Longitude", -180, 180);

  if (latitudeError) errors.latitude = latitudeError;
  if (longitudeError) errors.longitude = longitudeError;

  return errors;
};

export const validateReportCoordinates = ({ latitude, longitude }) => {
  const errors = {};
  const latitudeError = validateCoordinate(
    latitude,
    "Latitude",
    COLOMBIA_BOUNDS.latitude.minimum,
    COLOMBIA_BOUNDS.latitude.maximum
  );
  const longitudeError = validateCoordinate(
    longitude,
    "Longitude",
    COLOMBIA_BOUNDS.longitude.minimum,
    COLOMBIA_BOUNDS.longitude.maximum
  );

  if (latitudeError) errors.latitude = latitudeError;
  if (longitudeError) errors.longitude = longitudeError;

  return errors;
};

export const validateDateSelection = (formData, today = new Date()) => {
  const errors = {};

  if (!formData.useCustomDates) {
    if (!HISTORIC_RANGE_OPTIONS.has(formData.years)) {
      errors.years = "Please select an option for Historic data";
    }
    return errors;
  }

  const { startDate, endDate } = formData;

  if (isEmpty(startDate)) {
    errors.startDate = "Start Date is required";
  } else if (!isIsoDate(startDate)) {
    errors.startDate = "Start date is invalid";
  }

  if (isEmpty(endDate)) {
    errors.endDate = "End Date is required";
  } else if (!isIsoDate(endDate)) {
    errors.endDate = "End date is invalid";
  }

  if (errors.startDate || errors.endDate) return errors;

  const todayValue = formatDate(today);
  if (startDate > todayValue) {
    errors.startDate = "Start date cannot be in the future";
  }
  if (endDate > todayValue) {
    errors.endDate = "End date cannot be in the future";
  }
  if (!errors.startDate && !errors.endDate && startDate >= endDate) {
    errors.startDate = "Start date must be before end date";
  }

  return errors;
};

export const validateFormStep = (step, formData, today = new Date()) => {
  if (step === 1) return validateReportCoordinates(formData);
  if (step === 2) return validateDateSelection(formData, today);
  return {};
};
