import { lazy, Suspense, useEffect, useRef, useState } from "react";

import "./carouselselector.css";

const SingleSite = lazy(() => import("./singlesite1.jsx"));
const ExcelUploadTable = lazy(() => import("./exceluploadtable1.jsx"));
const CurrentLocation = lazy(() => import("./currentlocation1.jsx"));
const Docs = lazy(() => import("./docs.jsx"));

const MODES = [
  {
    key: "single",
    number: "01",
    label: "Single Site",
    shortLabel: "Point report",
    description: "One coordinate and time range",
    component: SingleSite,
  },
  {
    key: "multiple",
    number: "02",
    label: "Multiple Site",
    shortLabel: "Station portfolio",
    description: "Spreadsheet batch and export",
    component: ExcelUploadTable,
  },
  {
    key: "current",
    number: "03",
    label: "Current Location",
    shortLabel: "Device position",
    description: "Use browser coordinates",
    component: CurrentLocation,
  },
  {
    key: "docs",
    number: "04",
    label: "Documentation",
    shortLabel: "Operating guide",
    description: "Inputs, coverage and outputs",
    component: Docs,
  },
];

function WorkspaceFallback() {
  return (
    <div className="workspace-fallback" role="status">
      <span className="activity-dot" />
      Loading workspace…
    </div>
  );
}

export default function CarouselSelector() {
  const [activeMode, setActiveMode] = useState("single");
  const [initialCoordinates, setInitialCoordinates] = useState(null);
  const panelRef = useRef(null);
  const shouldFocusPanel = useRef(false);
  const active = MODES.find((mode) => mode.key === activeMode) ?? MODES[0];
  const ActiveComponent = active.component;

  useEffect(() => {
    if (!shouldFocusPanel.current) return;
    panelRef.current?.focus({ preventScroll: true });
    shouldFocusPanel.current = false;
  }, [activeMode]);

  const selectMode = (mode) => {
    shouldFocusPanel.current = true;
    setActiveMode(mode);
    if (mode !== "single") setInitialCoordinates(null);
  };

  return (
    <section className="workspace-shell" id="workspace">
      <div className="workspace-title">
        <div>
          <p className="eyebrow">Resource workstation</p>
          <h1>Solar and wind resource reports.</h1>
        </div>
        <p>
          Choose a workflow to prepare location-based NASA POWER data for
          analysis and export.
        </p>
      </div>

      <nav aria-label="Consultation modes" className="mode-navigation">
        {MODES.map((mode) => {
          const isActive = mode.key === activeMode;
          return (
            <button
              aria-current={isActive ? "page" : undefined}
              className={isActive ? "is-active" : ""}
              key={mode.key}
              onClick={() => selectMode(mode.key)}
              type="button"
            >
              <span className="mode-number">{mode.number}</span>
              <span className="mode-copy">
                <strong>{mode.label}</strong>
                <small>{mode.description}</small>
              </span>
              <span aria-hidden="true" className="mode-arrow">→</span>
            </button>
          );
        })}
      </nav>

      <div
        aria-label={`${active.shortLabel} workspace`}
        className="selected-workspace"
        ref={panelRef}
        tabIndex="-1"
      >
        <Suspense fallback={<WorkspaceFallback />}>
          <ActiveComponent
            initialCoordinates={initialCoordinates}
            onUseLocation={(coordinates) => {
              shouldFocusPanel.current = true;
              setInitialCoordinates(coordinates);
              setActiveMode("single");
            }}
          />
        </Suspense>
      </div>
    </section>
  );
}
