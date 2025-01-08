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
    const [weather, setWeather] = useState(null);
    const [loadingWeather, setLoadingWeather] = useState(false);
    const [destinationPostcode, setDestinationPostcode] = useState("");
    const [distance, setDistance] = useState(null);
    const [loadingDistance, setLoadingDistance] = useState(false);

    useEffect(() => {
        api.get(`/api/rooms/${id}`)
            .then((response) => setRoom(response.data ))
            .catch((err) => {
                console.error("Error fetching room details: ", err);
                setError(err.message);
            })
    }, [id]);

    useEffect(() => {
        if (user) {
            api.get(`/api/users/${user.username}`)
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
            await api.post('/api/applications/apply', {
                roomId: id,
                applicantId: userId,
            });

            setMessage("Application submitted successfully!");
        } catch (err) {
            console.error("Error applying for room:", err.response || err.message);
            setMessage(err.response?.data || "An unexpected error occurred.");
        }
    };

    const handleCheckWeather = async () => {
        if (!room?.address?.postcode) {
            setError("Postcode is not available for this room.");
            return;
        }

        setLoadingWeather(true);
        setError(null);
        setWeather(null);

        try {
            const weatherResponse = await api.get('/api/weather/', {
                params: {
                    postcode: room.address.postcode,
                    lang: "en",
                    unit: "metric",
                    output: "json",
                }
            });
            console.log(weatherResponse);
            setWeather(weatherResponse.data);
        } catch (err) {
            console.error("Error checking weather:", err);
            setError("Failed to fetch weather data.");
        } finally {
            setLoadingWeather(false);
        }
    };

    const handleCalculateDistance = async () => {
        if (!room?.address?.postcode || !destinationPostcode) {
            setError("Both origin and destination postcodes are required!");
            return;
        }

        setLoadingDistance(true);
        setError(null);
        setDistance(null);

        try {
            const distanceResponse = await api.get('/api/distance/', {
                params: {
                    originPostcode: room.address.postcode,
                    destinationPostcode: destinationPostcode,
                }
            });
            setDistance(distanceResponse.data);
        } catch (err) {
            console.error("Error calculating distance:", err);
            setError("Failed to calculate distance.");
        } finally {
            setLoadingDistance(false);
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
            <p style={{fontWeight: "bold"}}>Details:</p>
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
            <button onClick={handleCheckWeather} className="weather-button">
                {loadingWeather ? "Checking Weather..." : "Check Weather"}
            </button>
            {error && <p className="error">{error}</p>}
            {weather && (
                <div className="weather-info">
                    <h4>Weather Information:</h4>
                    <p><strong>Date:</strong> {weather.date}</p>
                    <p><strong>Weather:</strong> {weather.weather}</p>
                    <p><strong>Max Temperature:</strong> {weather.maxTemperature}°C</p>
                    <p><strong>Min Temperature:</strong> {weather.minTemperature}°C</p>
                    <p><strong>Max Wind Speed:</strong> {weather.maxWindSpeed} km/h</p>
                </div>
            )}
            <div className="distance-calculation">
                <h4>Calculate Distance</h4>
                <input type="text"
                       placeholder="Enter destination postcode"
                       value={destinationPostcode}
                       onChange={(e) => setDestinationPostcode(e.target.value)}
                />
                <button onClick={handleCalculateDistance} className="distance-button">
                    {loadingDistance ? "Calculating..." : "Calculate Distance"}
                </button>
                {distance && (
                    <div className="distance-info">
                        <p><strong>Distance: </strong> {distance.distance / 1000} km </p>
                        <p><strong>Duration: </strong> {Math.round(distance.duration / 60)} minutes</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default RoomDetails;