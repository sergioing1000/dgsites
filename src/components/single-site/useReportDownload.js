import { useEffect, useRef, useState } from "react";

import { getReportErrorMessage, requestReport } from "../../services/reportApi";

const INITIAL_STATE = Object.freeze({
  status: "idle",
  file: null,
  error: "",
});

export default function useReportDownload() {
  const [state, setState] = useState(INITIAL_STATE);
  const activeUrl = useRef(null);

  useEffect(
    () => () => {
      if (activeUrl.current) URL.revokeObjectURL(activeUrl.current);
    },
    []
  );

  const generate = async (payload) => {
    if (activeUrl.current) {
      URL.revokeObjectURL(activeUrl.current);
      activeUrl.current = null;
    }

    setState({ status: "pending", file: null, error: "" });

    try {
      const report = await requestReport(payload);
      const url = URL.createObjectURL(report.blob);
      activeUrl.current = url;
      setState({
        status: "success",
        file: { url, fileName: report.fileName },
        error: "",
      });
    } catch (error) {
      setState({
        status: "error",
        file: null,
        error: getReportErrorMessage(error),
      });
    }
  };

  const clearFeedback = () => {
    if (activeUrl.current) {
      URL.revokeObjectURL(activeUrl.current);
      activeUrl.current = null;
    }
    setState((current) =>
      current.status === "pending" ? current : INITIAL_STATE
    );
  };

  return { ...state, generate, clearFeedback };
}
