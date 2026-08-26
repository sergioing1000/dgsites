export const formatDate = (date) => date.toISOString().split("T")[0];

export const calculateDateRange = (formData, now = new Date()) => {
  if (formData.useCustomDates) {
    return {
      start: formData.startDate,
      end: formData.endDate,
    };
  }

  const endDate = new Date(now);
  const startDate = new Date(now);

  if (formData.years === "30") {
    startDate.setUTCDate(endDate.getUTCDate() - 30);
  } else {
    startDate.setUTCMonth(endDate.getUTCMonth() - Number(formData.years));
  }

  return {
    start: formatDate(startDate),
    end: formatDate(endDate),
  };
};

export const buildReportPayload = (formData, now = new Date()) => {
  const { start, end } = calculateDateRange(formData, now);

  return {
    station_name: "Station Site A",
    latitude: Number(formData.latitude),
    longitude: Number(formData.longitude),
    start,
    end,
  };
};
