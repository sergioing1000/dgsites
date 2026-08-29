import { useState } from "react";

import { fetchWeatherBatch } from "../../services/multiSiteWeather";
import { calculateWeatherDateWindow } from "../../services/weatherDataApi";

const EMPTY_BATCH = Object.freeze({
  status: "idle",
  progress: 0,
  currentStation: "",
  errors: [],
});

export default function useWeatherWorkbook(sites) {
  const [batch, setBatch] = useState(EMPTY_BATCH);

  const reset = () => setBatch(EMPTY_BATCH);

  const generate = async () => {
    setBatch({
      status: "pending",
      progress: 0,
      currentStation: "",
      errors: [],
    });

    try {
      const { results, errors } = await fetchWeatherBatch(
        sites,
        calculateWeatherDateWindow(),
        {
          concurrency: 3,
          onProgress: ({ completed, total, site }) => {
            setBatch((current) => ({
              ...current,
              currentStation: site.baseStation,
              progress: Math.round((completed / total) * 100),
            }));
          },
        }
      );

      if (errors.length) {
        setBatch({
          status: "error",
          progress: 0,
          currentStation: "",
          errors,
        });
        return;
      }

      const { exportWeatherWorkbook } = await import(
        "../../services/weatherWorkbook"
      );
      await exportWeatherWorkbook(results);
      setBatch({
        status: "success",
        progress: 100,
        currentStation: "",
        errors: [],
      });
    } catch {
      setBatch({
        status: "error",
        progress: 0,
        currentStation: "",
        errors: ["The results file could not be generated."],
      });
    }
  };

  return { ...batch, generate, reset };
}
