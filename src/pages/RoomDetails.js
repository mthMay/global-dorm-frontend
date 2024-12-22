import {useParams} from "react-router-dom";
import React, {useContext, useEffect, useState} from "react";
import api from '../api/apiConfig';
import '../style/Rooms.css';
import UserContext from "../components/UserContext";

const RoomDetails = () => {
    const {id} = useParams(); // To extract the id from URL
    const {user} = useContext(UserContext);
    const [room, setRoom] = useState();
    const [userId, setUserId] = useState(null);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState('');

    useEffect(() => {
        api.get(`/rooms/${id}`)
            .then((response) => setRoom(response.data ))
            .catch((err) => {
                console.error("Error fetching room details: ", err);
                setError(err.message);
            })
    }, [id]);

    useEffect(() => {
        if (user) {
            api.get(`/users/${user.username}`)
                .then(response => setUserId(response.data.id))
                .catch(err => {
                    console.error("Error fetching user details: ", err);
                });
        }
    }, [user]);

    const handleApply = async () => {
        if (!userId) {
            setMessage("Please log in to apply for this room.");
            return;
        }

        try {
            const response = await api.post('/applications/apply', {
                roomId: id,
                applicantId: userId,
            });

            setMessage("Application submitted successfully!");
        } catch (err) {
            console.error("Error applying for room:", err.response || err.message);
            setMessage(err.response?.data || "An unexpected error occurred.");
        }
    };

    if (error) {
        return <p className='error-color'>Error: {error}</p>;
    }

    if (!room) {
        return <p>Loading room details...</p>;
    }

    return (
        <div className="room-details">
            <h3>{room.name}</h3>
            <p>City: {room.address.city}</p>
            <p>County: {room.address.county}</p>
            <p>Postcode: {room.address.postcode}</p>
            <p style={{ fontWeight: "bold" }}>Details:</p>
            <p>Furnished: {room.details.furnished ? "Yes" : "No"}</p>
            <p>Amenities: {room.details.amenities.join(", ")}</p>
            <p>Shared with: {room.details.sharedWith}</p>
            <p>Bills Included: {room.details.billsIncluded ? "Yes" : "No"}</p>
            <p>Shared Bathroom: {room.details.bathroomShared ? "Yes" : "No"}</p>
            <p>Price Per Month: £{room.pricePerMonthGbp}</p>
            <p>Available From: {room.availabilityDate}</p>
            <p>Spoken Language: {room.spokenLanguages.join(", ")}</p>

            <button onClick={handleApply} className="apply-button">Apply</button>
            {message && <p>{message}</p>}
        </div>
    )
}

export default RoomDetails;