import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import { useState, useEffect } from "react";
import axios from "axios";
import "leaflet/dist/leaflet.css";

function ChangeView({ center }) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, 16);
  }, [center, map]);

  return null;
}

function MapPage() {
  const [position, setPosition] = useState([17.385, 78.4867]);

  useEffect(() => {
    const sendLocation = () => {
      navigator.geolocation.getCurrentPosition(
        async (location) => {
          const latitude = location.coords.latitude;
          const longitude = location.coords.longitude;

          setPosition([latitude, longitude]);

          const email = localStorage.getItem("userEmail");

          if (email) {
            try {
              const res = await axios.put(
                "http://localhost:5000/api/auth/update-location",
                {
                  email,
                  latitude,
                  longitude,
                }
              );
            } catch (error) {
              console.log(error);
            }
          }
        },
        (error) => {
          console.log(error);
          alert("Please allow location access.");
        },
        {
          enableHighAccuracy: true,
          maximumAge: 0,
          timeout: 5000,
        }
      );
    };

    // Send location immediately
    sendLocation();

    // Send every 30 seconds
    const interval = setInterval(sendLocation, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <MapContainer
        center={[17.385, 78.4867]}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <ChangeView center={position} />

        <Marker position={position}>
          <Popup>You are here 📍</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

export default MapPage;