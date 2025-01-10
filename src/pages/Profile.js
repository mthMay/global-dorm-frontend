import React, { useEffect, useState, useContext } from "react";
import api from "../api/apiConfig";
import UserContext from "../components/UserContext";
import {Link} from "react-router-dom";
import '../style/Profile.css';

const Profile = () => {
    const { user } = useContext(UserContext);
    const [applications, setApplications] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        if (user) {
            api.get(`/api/users/${user.username}`)
                .then(response => {
                    return api.get(`/api/applications/applicant/${response.data.id}`);
                })
                .then(async response => {
                    const apps = response.data;

                    const activeApplications = apps.filter(app => app.status !== "CANCELLED");
                    const applicationsWithRoomNames = await Promise.all(
                        activeApplications.map(async app => {
                            const roomResponse = await api.get(`/api/rooms/${app.roomId}`);
                            return { ...app, roomName: roomResponse.data.name };
                        })
                    );

                    setApplications(applicationsWithRoomNames);
                })
                .catch(err => {
                    setError("Failed to load applications.");
                })
        }
    }, [user]);

    const handleUpdateStatus = async (applicationId, status) => {
        try {
            await api.patch(`/api/applications/${status}/${applicationId}`);
            if (status === "CANCELLED") {
                setApplications(applications.filter(app => app.id !== applicationId));
            } else {
                setApplications(applications.map(app =>
                    app.id === applicationId ? { ...app, status } : app
                ));
            }
        } catch (err) {
            console.error("Error updating application status:", err);
            setError("Failed to update application status.");
        }
    };

    if (!user) {
        return <p className="error">Please log in to view your profile.</p>;
    }

    return (
        <div className="profile">
            <h2>{user.username}'s Applications</h2>
            {error && <p className="error">{error}</p>}
            <div className="applications">
                {applications.length === 0 ? (
                    <p>No applications found.</p>
                ) : (
                    applications.map(app => (
                        <div key={app.id} className="application">
                            <p>
                                <strong>Room Name:</strong>{" "}
                                <Link to={`/roomDetails/${app.roomId}`} className="room-link">
                                    {app.roomName || app.roomId}
                                </Link>
                            </p>
                            <p><strong>Status:</strong> {app.status.toUpperCase()}</p>
                            <button
                                onClick={() => handleUpdateStatus(app.id, "accepted")}
                                disabled={(app.status === "CANCELLED")}
                            >
                                Accept
                            </button>
                            <button
                                onClick={() => handleUpdateStatus(app.id, "rejected")}
                                disabled={(app.status === "CANCELLED")}
                            >
                                Reject
                            </button>
                            <button
                                onClick={() => handleUpdateStatus(app.id, "cancelled")}
                            >
                                Cancel
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Profile;