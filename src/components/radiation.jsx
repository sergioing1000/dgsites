import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const SolarData = ({
  latitude_prop,
  longitude_prop,
  years_prop,
  batteryType_prop,
  autonomy_prop,
  autonomyOther_prop,
  panelType_prop,
  panelOther_prop,
  load1_prop,
  load2_prop,
  load3_prop,
}) => {

  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    // Define query parameters as variables
    const baseUrl = "https://power.larc.nasa.gov/api/temporal/daily/point";
    const parameters = "ALLSKY_SFC_SW_DWN";
    const community = "RE";
    const latitude = "4.12";
    const longitude = "-72.54612";
    const start = "20220401";
    const end = "20250401";
    const format = "JSON";

    // Build query string
    const queryParams = new URLSearchParams({
      parameters,
      community,
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      start,
      end,
      format,
    });

    // Build full URI
    const uri = `${baseUrl}?${queryParams.toString()}`;

    fetch(uri, requestOptions)
      .then((response) => response.json())
      .then((result) => setData(result.properties.parameter.ALLSKY_SFC_SW_DWN))
      .catch((error) => setError(error.message));
  }, []);

  const formattedData = data
    ? Object.entries(data).map(([date, value]) => ({
        date,
        value,
      }))
    : [];


  const exportToExcel = () => {
    const worksheetData = formattedData.map((item) => ({
      Date: item.date,
      "Solar Radiation (kWh/m²/day)": item.value,
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "SolarData");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const file = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(file, "SolarData.xlsx");
  };

  return (
    <>
      <div>
        <h2>Daily Solar Radiation (kWh/m²/day)</h2>
        {error && <p>Error: {error}</p>}
        {!data && !error && <p>Loading...</p>}
        {data && (
          <table border="1" cellPadding="5">
            <thead>
              <tr>
                <th>Date</th>
                <th>Radiation</th>
              </tr>
            </thead>
            <tbody>
              {formattedData.slice(0, 30).map((item) => (
                <tr key={item.date}>
                  <td>{item.date}</td>
                  <td>{item.value.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {data && (
        <>
          <button onClick={exportToExcel} style={{ margin: "10px 0" }}>
            Export to Excel
          </button>
        </>
      )}
    </>
  );
};

export default SolarData;