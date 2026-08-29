import { Marker, MapContainer, TileLayer, useMapEvents } from "react-leaflet";

import Dialog from "../ui/Dialog";

function LocationMarker({ onSelect, position }) {
  useMapEvents({
    click(event) {
      onSelect([event.latlng.lat, event.latlng.lng]);
    },
  });

  return position ? <Marker position={position} /> : null;
}

export default function SiteMapDialog({ onClose, onSelect, position }) {
  return (
    <Dialog labelledBy="site-map-title" onClose={onClose} size="map">
      <div className="dialog__heading">
        <p className="eyebrow">Coordinate picker</p>
        <h2 id="site-map-title">Choose a point in Colombia</h2>
        <p>Click the map to set precise latitude and longitude.</p>
      </div>

      <div className="map-frame">
        <MapContainer center={position ?? [4.6, -74.08]} zoom={5}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker onSelect={onSelect} position={position} />
        </MapContainer>
      </div>

      <div className="dialog__actions">
        <p className="coordinate-readout">
          {position
            ? `${position[0].toFixed(6)}, ${position[1].toFixed(6)}`
            : "No point selected"}
        </p>
        <button className="button button--primary" onClick={onClose} type="button">
          Confirm location
        </button>
      </div>
    </Dialog>
  );
}
