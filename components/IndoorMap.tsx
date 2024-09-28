import React, { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polygon,
  Tooltip,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

//https://engr.ku.edu/sites/engr/files/2023-02/EXPOPacketsRenewed.pdf

// Types for room data
type Room = {
  id: number;
  name: string;
  coordinates: [number, number][]; // Coordinates to define room boundaries
};

// Props for the IndoorMap component
interface IndoorMapProps {
  rooms: Room[];
  mapCenter: [number, number]; // Default center of the map
  zoomLevel: number; // Default zoom level
}

const IndoorMap: React.FC<IndoorMapProps> = ({
  rooms,
  mapCenter,
  zoomLevel,
}) => {
  useEffect(() => {
    // Fix for default icon issues in Leaflet
    // No need to delete _getIconUrl as it does not exist on L.Icon.Default.prototype
    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
      iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
      shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    });
  }, []);

  return (
    <div style={{ width: "100%", height: "500px" }}>
      <MapContainer
        center={mapCenter}
        zoom={zoomLevel}
        style={{ width: "100%", height: "100%" }}
      >
        {/* TileLayer for background; you can use your own tiles or background image */}
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* Render each room as a Polygon with label */}
        {rooms.map((room) => (
          <Polygon
            key={room.id}
            positions={room.coordinates}
            pathOptions={{ color: "blue" }}
          >
            <Tooltip direction="center" sticky>
              <span>{room.name}</span>
            </Tooltip>
          </Polygon>
        ))}

        {/* Optional: Add a marker to indicate the main entrance or other points */}
        <Marker position={mapCenter}>
          <Popup>
            <span>Main Entrance</span>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default IndoorMap;
