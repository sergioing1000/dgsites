import { useReducer } from "react";

import { buildReportPayload } from "../../domain/dateRange";
import { validateFormStep } from "../../domain/siteValidation";
import useReportDownload from "./useReportDownload";

const EMPTY_FORM = Object.freeze({
  latitude: "",
  longitude: "",
  years: "",
  useCustomDates: false,
  startDate: "",
  endDate: "",
});

const createInitialState = (coordinates) => ({
  step: 1,
  formData: {
    ...EMPTY_FORM,
    latitude: coordinates?.latitude ?? "",
    longitude: coordinates?.longitude ?? "",
  },
  errors: {},
  mapOpen: false,
  markerPosition: coordinates
    ? [Number(coordinates.latitude), Number(coordinates.longitude)]
    : null,
});

function workflowReducer(state, action) {
  switch (action.type) {
    case "change-field":
      return {
        ...state,
        formData: { ...state.formData, [action.name]: action.value },
        errors: { ...state.errors, [action.name]: undefined },
      };
    case "set-date-mode":
      return {
        ...state,
        formData: { ...state.formData, useCustomDates: action.value },
        errors: {},
      };
    case "set-validation":
      return { ...state, errors: action.errors };
    case "set-step":
      return { ...state, step: action.step, errors: {} };
    case "open-map":
      return { ...state, mapOpen: true };
    case "close-map":
      return { ...state, mapOpen: false };
    case "select-location":
      return {
        ...state,
        markerPosition: [action.latitude, action.longitude],
        formData: {
          ...state.formData,
          latitude: action.latitude.toFixed(6),
          longitude: action.longitude.toFixed(6),
        },
        errors: {
          ...state.errors,
          latitude: undefined,
          longitude: undefined,
        },
      };
    default:
      return state;
  }
}

export default function useSingleSiteWorkflow(initialCoordinates) {
  const [state, dispatch] = useReducer(
    workflowReducer,
    initialCoordinates,
    createInitialState
  );
  const report = useReportDownload();

  const validateCurrentStep = () => {
    const errors = validateFormStep(state.step, state.formData);
    dispatch({ type: "set-validation", errors });
    return Object.keys(errors).length === 0;
  };

  const changeField = (event) => {
    dispatch({
      type: "change-field",
      name: event.target.name,
      value: event.target.value,
    });
    report.clearFeedback();
  };

  const setDateMode = (value) => {
    dispatch({ type: "set-date-mode", value });
    report.clearFeedback();
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!validateCurrentStep()) return;

    if (state.step === 1) {
      dispatch({ type: "set-step", step: 2 });
      return;
    }

    await report.generate(buildReportPayload(state.formData));
  };

  return {
    ...state,
    report,
    actions: {
      back: () => dispatch({ type: "set-step", step: 1 }),
      changeField,
      closeMap: () => dispatch({ type: "close-map" }),
      openMap: () => dispatch({ type: "open-map" }),
      selectLocation: ([latitude, longitude]) =>
        dispatch({ type: "select-location", latitude, longitude }),
      setDateMode,
      submit,
    },
  };
}
