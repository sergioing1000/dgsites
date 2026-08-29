import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import markerIconUrl from "leaflet/dist/images/marker-icon.png";
import markerIcon2xUrl from "leaflet/dist/images/marker-icon-2x.png";
import markerShadowUrl from "leaflet/dist/images/marker-shadow.png";

import Dialog from "../ui/Dialog";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2xUrl,
  iconUrl: markerIconUrl,
  shadowUrl: markerShadowUrl,
});

export default function StationMapDialog({ onClose, station }) {
  const position = [Number(station.latitude), Number(station.longitude)];

  return (
    <Dialog labelledBy="station-map-title" onClose={onClose} size="map">
      <div className="dialog__heading">
        <p className="eyebrow">Station detail</p>
        <h2 id="station-map-title">{station.baseStation}</h2>
        <p>
          {station.state} · {station.latitude}, {station.longitude}
        </p>
      </div>
      <div className="map-frame">
        <MapContainer center={position} zoom={7}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={position}>
            <Popup>
              <strong>{station.baseStation}</strong>
              <br />
              Load: {station.load || "Not provided"}
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </Dialog>
  );
}
