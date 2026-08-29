import { fireEvent, render, screen } from "@testing-library/react";

import CurrentLocation from "./currentlocation1.jsx";

test("detects coordinates and passes them to the report workflow", async () => {
  const onUseLocation = vi.fn();
  const getCurrentPosition = vi.fn((onSuccess) =>
    onSuccess({ coords: { latitude: 4.60971, longitude: -74.08175 } })
  );
  Object.defineProperty(navigator, "geolocation", {
    configurable: true,
    value: { getCurrentPosition },
  });

  render(<CurrentLocation onUseLocation={onUseLocation} />);
  fireEvent.click(
    screen.getByRole("button", { name: "Get current location" })
  );

  expect(await screen.findByText("4.609710")).toBeInTheDocument();
  expect(screen.getByText("-74.081750")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Build a report here" }));

  expect(onUseLocation).toHaveBeenCalledWith({
    latitude: "4.609710",
    longitude: "-74.081750",
  });
});

test("shows a useful error when geolocation is unavailable", () => {
  Object.defineProperty(navigator, "geolocation", {
    configurable: true,
    value: undefined,
  });

  render(<CurrentLocation />);
  fireEvent.click(
    screen.getByRole("button", { name: "Get current location" })
  );

  expect(screen.getByRole("alert")).toHaveTextContent(
    "Geolocation is not supported by your browser."
  );
});
