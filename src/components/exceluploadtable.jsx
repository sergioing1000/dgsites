import React, { useState, useMemo, useEffect, useRef } from "react";
import * as XLSX from 'xlsx';
import ExcelJS from "exceljs";
import { saveAs } from 'file-saver';
import './ExcelUploadTable.css';
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from 'leaflet';

import 'leaflet/dist/leaflet.css';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const ExcelUploadTable = () => {
  const [tableData, setTableData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showProgress, setShowProgress] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStation, setCurrentStation] = useState("");
  const markerRef = useRef();


  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });

      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      const [, ...rows] = jsonData;

      const parsedData = rows.map((row) => ({
        baseStation: row[1] || "",
        state: row[2] || "",
        latitude: row[3] || "",
        longitude: row[4] || "",
        load: row[5] || "",
      }));

      setTableData(parsedData);
      setCurrentPage(1);
    };

    reader.readAsArrayBuffer(file);
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredData = useMemo(() => {
    const lowerSearch = searchTerm.toLowerCase();
    return tableData.filter((row) =>
      Object.values(row).some((val) =>
        String(val).toLowerCase().includes(lowerSearch)
      )
    );
  }, [searchTerm, tableData]);

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;
    return [...filteredData].sort((a, b) => {
      const valA = String(a[sortConfig.key]);
      const valB = String(b[sortConfig.key]);
      return sortConfig.direction === 'asc'
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    });
  }, [filteredData, sortConfig]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return sortedData.slice(start, start + rowsPerPage);
  }, [sortedData, currentPage, rowsPerPage]);

  const totalPages = Math.ceil(sortedData.length / rowsPerPage);

  const handleRowClick = (row) => {
    const lat = parseFloat(row.latitude);
    const lng = parseFloat(row.longitude);
    if (!isNaN(lat) && !isNaN(lng)) {
      setSelectedLocation({ ...row, lat, lng });
    }
  };

  const closeModal = () => setSelectedLocation(null);

  function formatDateKeys(obj) {
    const formatted = {};
    for (const key in obj) {
      if (/^\d{8}$/.test(key)) {
        // Format "20240101" → "2024-01-01"
        const formattedKey = `${key.slice(0, 4)}-${key.slice(4, 6)}-${key.slice(
          6
        )}`;
        formatted[formattedKey] = obj[key];
      } else {
        formatted[key] = obj[key];
      }
    }
    return formatted;
  }
  

  const fetchAPI = async () => {
    const start = new Date(Date.now() - 1125 * 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 10)
      .replace(/-/g, "");
    const end = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 10)
      .replace(/-/g, "");

    setShowProgress(true);
    const results = [];

    for (let i = 0; i < tableData.length; i++) {
      const row = tableData[i];
      const url = `https://power.larc.nasa.gov/api/temporal/daily/point?parameters=ALLSKY_SFC_SW_DWN&community=RE&latitude=${row.latitude}&longitude=${row.longitude}&start=${start}&end=${end}&format=JSON`;

      setCurrentStation(row.baseStation);

      try {
        const res = await fetch(url);
        const json = await res.json();
        const rawDailyData =
          json.properties?.parameter?.ALLSKY_SFC_SW_DWN || {};
        const dailyData = formatDateKeys(rawDailyData);

        results.push({
          baseStation: row.baseStation,
          state: row.state,
          latitude: row.latitude,
          longitude: row.longitude,
          load: row.load,
          ...dailyData,
        });
      } catch (err) {
        results.push({
          baseStation: row.baseStation,
          state: row.state,
          latitude: row.latitude,
          longitude: row.longitude,
          load: row.load,
          error: "Fetch failed",
        });
      }

      setProgress(Math.round(((i + 1) / tableData.length) * 100));
      await new Promise((resolve) => setTimeout(resolve, 5));
    }

    // Create a workbook
    const workbook = new ExcelJS.Workbook();

    // Sheet 1: Results
    const resultSheet = workbook.addWorksheet("Results");

    const headerOrder = [
      "baseStation",
      "state",
      "latitude",
      "longitude",
      "load",
      ...Object.keys(results[0]).filter(
        (key) =>
          !["baseStation", "state", "latitude", "longitude"].includes(key)
      ),
    ];

    resultSheet.addRow(headerOrder);
    results.forEach((row) => {
      const rowData = headerOrder.map((key) => row[key] ?? "");
      resultSheet.addRow(rowData);
    });

    // Sheet 2: newsheet1 with vertical text in first row
    const newsheet1 = workbook.addWorksheet("newsheet1");

    const firstRowData = tableData.map((row) => row.baseStation || "Unnamed");
    const secondRowData = tableData.map((row) => row.load || "");

    const row1 = newsheet1.addRow(firstRowData);
    const row2 = newsheet1.addRow(secondRowData);

    row1.eachCell((cell) => {
      cell.alignment = {
        textRotation: 90,
        vertical: "middle",
        horizontal: "center",
      };
    });

    row2.eachCell((cell) => {
      cell.alignment = {
        textRotation: 0,
        vertical: "middle",
        horizontal: "center",
      };
    })

    
    // Sheet 3: newsheet2 (static)
    const newsheet2 = workbook.addWorksheet("newsheet2");
    newsheet2.addRow(["Info"]);
    newsheet2.addRow(["Additional"]);
    newsheet2.addRow(["Data"]);

    // Generate and download
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, "results.xlsx");

    setShowProgress(false);
  };

  return (
    <div className="excel-upload-container">
      <h2 className="title">Upload Excel File</h2>
      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileUpload}
        className="upload-button"
      />

      {tableData.length > 0 && (
        <>
          <div className="table-controls">
            <input
              type="text"
              placeholder="Search..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
            <select
              className="rows-select"
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              <option value={10}>10 rows</option>
              <option value={20}>20 rows</option>
              <option value={50}>50 rows</option>
            </select>
          </div>

          <table className="styled-table">
            <thead>
              <tr>
                <th onClick={() => handleSort("baseStation")}>Base Station</th>
                <th onClick={() => handleSort("state")}>State</th>
                <th onClick={() => handleSort("latitude")}>Latitude</th>
                <th onClick={() => handleSort("longitude")}>Longitude</th>
                <th onClick={() => handleSort("load")}>Load</th>{" "}
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((row, index) => (
                <tr
                  key={index}
                  onClick={() => handleRowClick(row)}
                  className="clickable-row"
                >
                  <td>{row.baseStation}</td>
                  <td>{row.state}</td>
                  <td>{row.latitude}</td>
                  <td>{row.longitude}</td>
                  <td>{row.load}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              ◀ Prev
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              Next ▶
            </button>
          </div>

          <div className="api-button-container">
            <button className="api-button" onClick={fetchAPI}>
              API
            </button>
          </div>
        </>
      )}

      {showProgress && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h3>Requesting NASA Information...</h3>
            <p>
              <strong>Base Station:</strong> {currentStation} ...
            </p>
            <div className="progress-bar">
              <div
                className="progress-bar-fill"
                style={{ width: `${progress}%` }}
              >
                {progress}%
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedLocation && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <button className="modal-close" onClick={closeModal}>
              ×
            </button>
            <h3>
              {selectedLocation.baseStation} - {selectedLocation.state}
            </h3>
            <p>
              <strong>Load:</strong> {selectedLocation.load || "N/A"}
            </p>
            
            <MapContainer
              center={[selectedLocation.lat, selectedLocation.lng]}
              zoom={6}
              style={{ height: "400px", width: "100%", borderRadius: "8px" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution=""
              />

              <Marker
                position={[selectedLocation.lat, selectedLocation.lng]}
                ref={markerRef}
              >
                <Popup>
                  <div style={{ minWidth: "150px" }}>
                    <strong>{selectedLocation.baseStation}</strong>
                    <br />
                    State: {selectedLocation.state}
                    <br />
                    Load: {selectedLocation.load || "N/A"}
                  </div>
                </Popup>
              </Marker>

              <AutoOpenPopup markerRef={markerRef} />
            </MapContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExcelUploadTable;

const AutoOpenPopup = ({ markerRef }) => {
  const map = useMap();

  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.openPopup();
      map.setView(markerRef.current.getLatLng(), 6);
    }
  }, [markerRef, map]);

  return null;
};