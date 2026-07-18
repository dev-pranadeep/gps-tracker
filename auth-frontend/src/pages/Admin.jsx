import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";

function ChangeMapView({ selectedUser }) {
  const map = useMap();

  useEffect(() => {
    if (
      selectedUser?.location?.latitude &&
      selectedUser?.location?.longitude
    ) {
      map.flyTo(
        [
          selectedUser.location.latitude,
          selectedUser.location.longitude,
        ],
        16
      );
    }
  }, [selectedUser, map]);

  return null;
}
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km

  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return (R * c).toFixed(2);
}
function Admin() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState(null);
  const [adminLocation, setAdminLocation] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
useEffect(() => {
  const role = localStorage.getItem("userRole");

  if (role !== "admin") {
    navigate("/profile");
  }
}, [navigate]);
useEffect(() => {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      setAdminLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    },
    (error) => {
      console.log(error);
    },
    {
      enableHighAccuracy: true,
    }
  );
}, []);
  const fetchUsers = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/auth/users"
      );
      setUsers(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUsers();

    const interval = setInterval(() => {
      fetchUsers();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // Search Filter
  const filteredUsers = users.filter((user) => {
  const matchesSearch =
    user.name.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase()) ||
    user.phone.toLowerCase().includes(search.toLowerCase());

  const isOnline =
    user.location?.updatedAt &&
    Date.now() - new Date(user.location.updatedAt).getTime() < 60000;

  if (filter === "online") {
    return matchesSearch && isOnline;
  }

  if (filter === "offline") {
    return matchesSearch && !isOnline;
  }

  return matchesSearch;
});
const totalUsers = users.length;

const onlineUsers = users.filter(
  (user) =>
    user.location?.updatedAt &&
    Date.now() - new Date(user.location.updatedAt).getTime() < 60000
).length;

const offlineUsers = users.filter((user) => {
  const isOnline =
    user.location?.updatedAt &&
    Date.now() - new Date(user.location.updatedAt).getTime() < 60000;
  return !isOnline;
}).length;const distance =
  adminLocation && selectedUser?.location
    ? calculateDistance(
        adminLocation.latitude,
        adminLocation.longitude,
        selectedUser.location.latitude,
        selectedUser.location.longitude
      )
    : null;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Owner Dashboard</h1>
<div
  style={{
    display: "flex",
    gap: "20px",
    margin: "20px 0",
    flexWrap: "wrap",
  }}
>
  {/* Total Users */}
  <div
    onClick={() => setFilter("all")}
    style={{
      flex: 1,
      minWidth: "200px",
      background: "#f8f9fa",
      padding: "20px",
      borderRadius: "10px",
      textAlign: "center",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      cursor: "pointer",
    }}
  >
    <h2>👥 Total Users</h2>
    <h1>{totalUsers}</h1>
  </div>

  {/* Online Users */}
  <div
    onClick={() => setFilter("online")}
    style={{
      flex: 1,
      minWidth: "200px",
      background: "#d4edda",
      padding: "20px",
      borderRadius: "10px",
      textAlign: "center",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      cursor: "pointer",
    }}
  >
    <h2>🟢 Online</h2>
    <h1>{onlineUsers}</h1>
  </div>

  {/* Offline Users */}
  <div
    onClick={() => setFilter("offline")}
    style={{
      flex: 1,
      minWidth: "200px",
      background: "#f8d7da",
      padding: "20px",
      borderRadius: "10px",
      textAlign: "center",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      cursor: "pointer",
    }}
  >
    <h2>🔴 Offline</h2>
    <h1>{offlineUsers}</h1>
  </div>
</div>
{selectedUser && (
  <div
    style={{
      background: "#f8f9fa",
      padding: "20px",
      borderRadius: "10px",
      marginBottom: "20px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    }}
  >
    <h2>👤 Selected User</h2>

    <p><b>Name:</b> {selectedUser.name}</p>

    <p><b>Email:</b> {selectedUser.email}</p>

    <p><b>Phone:</b> {selectedUser.phone}</p>

    <p><b>Latitude:</b> {selectedUser.location?.latitude}</p>

    <p><b>Longitude:</b> {selectedUser.location?.longitude}</p>

    <p>
      <b>Status:</b>{" "}
      {selectedUser.location?.updatedAt &&
      Date.now() -
        new Date(selectedUser.location.updatedAt).getTime() <
        60000
        ? "🟢 Online"
        : "🔴 Offline"}
    </p>
<p>
  <b>Distance from You:</b>{" "}
  {distance ? `${distance} km` : "-"}
</p>
    <p>
      <b>Updated:</b>{" "}
      {selectedUser.location?.updatedAt
        ? new Date(selectedUser.location.updatedAt).toLocaleString()
        : "-"}
    </p>
  <button
  onClick={() => {
    if (!selectedUser?.location) return;

    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${selectedUser.location.latitude},${selectedUser.location.longitude}&travelmode=driving`,
      "_blank"
    );
  }}
  style={{
    marginTop: "15px",
    padding: "10px 20px",
    background: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  }}
>
🚗 Get Directions
</button>
  </div>
)}
      <input
        type="text"
        placeholder="🔍 Search by Name, Email or Phone..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          margin: "15px 0",
          fontSize: "16px",
          borderRadius: "8px",
          border: "1px solid #ccc",
        }}
      />

      <div
        style={{
          height: "500px",
          marginBottom: "20px",
        }}
      >
        <MapContainer
          center={[20.5937, 78.9629]}
          zoom={5}
          style={{
            height: "100%",
            width: "100%",
          }}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <ChangeMapView selectedUser={selectedUser} />

          {filteredUsers.map((user) => {
            if (
              !user.location ||
              user.location.latitude == null ||
              user.location.longitude == null
            )
              return null;

            return (
              <Marker
                key={user._id}
                position={[
                  user.location.latitude,
                  user.location.longitude,
                ]}
                eventHandlers={{
                  click: () => setSelectedUser(user),
                }}
              >
                <Popup>
                  <b>{user.name}</b>
                  <br />
                  {user.email}
                  <br />
                  {user.phone}
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      <table
        border="1"
        cellPadding="10"
        style={{
          borderCollapse: "collapse",
          width: "100%",
        }}
      >
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Latitude</th>
            <th>Longitude</th>
            <th>Updated</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {filteredUsers.map((user) => {
            const isOnline =
              user.location?.updatedAt &&
              Date.now() -
                new Date(user.location.updatedAt).getTime() <
                60000;

            return (
              <tr
                key={user._id}
                onClick={() => setSelectedUser(user)}
                style={{
                  cursor: "pointer",
                  backgroundColor:
                    selectedUser?._id === user._id
                      ? "#dbeafe"
                      : "white",
                }}
              >
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>{user.location?.latitude ?? "-"}</td>
                <td>{user.location?.longitude ?? "-"}</td>
                <td>
                  {user.location?.updatedAt
                    ? new Date(
                        user.location.updatedAt
                      ).toLocaleString()
                    : "-"}
                </td>
                <td>{isOnline ? "🟢 Online" : "🔴 Offline"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
export default Admin;