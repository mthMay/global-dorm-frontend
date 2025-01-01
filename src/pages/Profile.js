import React, { useEffect, useState, useContext } from "react";
import api from "../api/apiConfig";
import UserContext from "../components/UserContext";
import {Link} from "react-router-dom";
import '../style/Profile.css';

const Profile = () => {
    const { user } = useContext(UserContext);
    const [applications, setApplications] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (user) {
            api.get(`/users/${user.username}`)
                .then(response => {
                    return api.get(`/applications/applicant/${response.data.id}`);
                })
                .then(async response => {
                    const apps = response.data;

                    const activeApplications = apps.filter(app => app.status !== "CANCELLED");
                    const applicationsWithRoomNames = await Promise.all(
                        activeApplications.map(async app => {
                            const roomResponse = await api.get(`/rooms/${app.roomId}`);
                            return { ...app, roomName: roomResponse.data.name };
                        })
                    );

                    setApplications(applicationsWithRoomNames);
                })
                .catch(err => {
                    setMessage("Failed to load applications.");
                })
        }
    }, [user]);

    const handleUpdateStatus = async (applicationId, status) => {
        try {
            await api.patch(`/applications/${status}/${applicationId}`);
            if (status === "CANCELLED") {
                setApplications(applications.filter(app => app.id !== applicationId));
            } else {
                setApplications(applications.map(app =>
                    app.id === applicationId ? { ...app, status } : app
                ));
            }
        } catch (err) {
            console.error("Error updating application status:", err);
            setMessage("Failed to update application status.");
        }
    };

    if (!user) {
        return <p>Please log in to view your profile.</p>;
    }

    return (
        <div className="profile">
            <h2>{user.username}'s Applications</h2>
            {message && <p className="message">{message}</p>}
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
                            <p><strong>Status:</strong> {app.status}</p>
                            <button
                                onClick={() => handleUpdateStatus(app.id, "accept")}
                                disabled={!(app.status === "PENDING" || app.status === "ACCEPTED" || app.status === "REJECTED")}
                            >
                                Accept
                            </button>
                            <button
                                onClick={() => handleUpdateStatus(app.id, "reject")}
                                disabled={!(app.status === "PENDING" || app.status === "ACCEPTED" || app.status === "REJECTED")}
                            >
                                Reject
                            </button>
                            <button
                                onClick={() => handleUpdateStatus(app.id, "cancel")}
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