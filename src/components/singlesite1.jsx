import { lazy, Suspense } from "react";

import CoordinateStep from "./single-site/CoordinateStep";
import DateStep from "./single-site/DateStep";
import ReportFeedback from "./single-site/ReportFeedback";
import useSingleSiteWorkflow from "./single-site/useSingleSiteWorkflow";
import WorkflowRail from "./single-site/WorkflowRail";

import "./singlesite1.css";
import "leaflet/dist/leaflet.css";

const SiteMapDialog = lazy(() => import("./single-site/SiteMapDialog"));

export default function SingleSite({ initialCoordinates = null }) {
  const workflow = useSingleSiteWorkflow(initialCoordinates);
  const { actions, errors, formData, mapOpen, markerPosition, report, step } =
    workflow;

  return (
    <div className="single-site-workspace">
      <WorkflowRail step={step} />

      <form className="report-form" onSubmit={actions.submit}>
        {step === 1 ? (
          <CoordinateStep
            errors={errors}
            formData={formData}
            onChange={actions.changeField}
            onOpenMap={actions.openMap}
          />
        ) : (
          <DateStep
            errors={errors}
            formData={formData}
            onChange={actions.changeField}
            onModeChange={actions.setDateMode}
          />
        )}

        <div className="form-actions">
          {step === 2 && (
            <button
              className="button button--quiet"
              onClick={actions.back}
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

        <ReportFeedback report={report} />
      </form>

      {mapOpen && (
        <Suspense fallback={null}>
          <SiteMapDialog
            onClose={actions.closeMap}
            onSelect={actions.selectLocation}
            position={markerPosition}
          />
        </Suspense>
      )}
    </div>
  );
}
