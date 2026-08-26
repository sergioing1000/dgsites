import {
  validateCoordinates,
  validateDateSelection,
  validateFormStep,
} from "./siteValidation";

describe("coordinate validation", () => {
  test.each([
    ["", "-74", "Latitude is required"],
    ["north", "-74", "Latitude must be a number"],
    ["91", "-74", "Latitude must be between -90 and 90"],
    ["4", "181", "Longitude must be between -180 and 180"],
  ])("rejects invalid coordinates", (latitude, longitude, message) => {
    expect(validateCoordinates({ latitude, longitude })).toEqual(
      expect.objectContaining(
        message.startsWith("Latitude")
          ? { latitude: message }
          : { longitude: message }
      )
    );
  });

  test("accepts coordinate boundaries", () => {
    expect(validateCoordinates({ latitude: "-90", longitude: "180" })).toEqual(
      {}
    );
  });

  test("limits the report form to coordinates in Colombia", () => {
    expect(
      validateFormStep(1, { latitude: "20", longitude: "-74" })
    ).toEqual({ latitude: "Latitude must be between -4.23 and 12.44" });
  });
});

describe("date validation", () => {
  const today = new Date("2026-08-25T12:00:00.000Z");

  test("requires a supported historic range", () => {
    expect(
      validateDateSelection({ useCustomDates: false, years: "" }, today)
    ).toEqual({ years: "Please select an option for Historic data" });
  });

  test("rejects inverted dates", () => {
    expect(
      validateDateSelection(
        {
          useCustomDates: true,
          startDate: "2026-08-20",
          endDate: "2026-08-19",
        },
        today
      )
    ).toEqual({ startDate: "Start date must be before end date" });
  });

  test("rejects a single-day range required as two equal dates", () => {
    expect(
      validateDateSelection(
        {
          useCustomDates: true,
          startDate: "2026-08-20",
          endDate: "2026-08-20",
        },
        today
      )
    ).toEqual({ startDate: "Start date must be before end date" });
  });

  test("rejects future dates", () => {
    expect(
      validateDateSelection(
        {
          useCustomDates: true,
          startDate: "2026-08-25",
          endDate: "2026-08-26",
        },
        today
      )
    ).toEqual({ endDate: "End date cannot be in the future" });
  });

  test("validates only the requested form step", () => {
    expect(
      validateFormStep(1, { latitude: "4.6", longitude: "-74.1" }, today)
    ).toEqual({});
  });
});
