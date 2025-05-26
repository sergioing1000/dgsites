import React, { useState, useMemo } from "react";
import * as XLSX from "xlsx";
import "./ExcelUploadTable.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

// Fix default marker icon path in Leaflet
import "leaflet/dist/leaflet.css";
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const ExcelUploadTable = () => {
  const [tableData, setTableData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      const [, ...rows] = jsonData;

      const parsedData = rows.map((row) => ({
        baseStation: row[1] || "",
        state: row[2] || "",
        latitude: row[3] || "",
        longitude: row[4] || "",
      }));

      setTableData(parsedData);
      setCurrentPage(1);
    };

    reader.readAsArrayBuffer(file);
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
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
      return sortConfig.direction === "asc"
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
        </>
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
            <MapContainer
              center={[selectedLocation.lat, selectedLocation.lng]}
              zoom={6}
              style={{ height: "400px", width: "100%", borderRadius: "8px" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy;"
              />
              <Marker position={[selectedLocation.lat, selectedLocation.lng]}>
                <Popup>
                  {selectedLocation.baseStation} <br /> {selectedLocation.state}
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExcelUploadTable;