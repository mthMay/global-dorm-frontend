import React, {useEffect, useState} from 'react';
import api from '../api/apiConfig';
import Button from "react-bootstrap/Button";
import {Link} from "react-router-dom";
import '../style/Rooms.css';

const Rooms = () =>{
    const[rooms, setRooms] = useState([]);
    const[error, setError] = useState(null);

    useEffect(() => {
        api.get('/rooms/all')
            .then (response => setRooms(response.data))
            .catch (err => {
                console.error("Error fetching rooms: ", err);
                setError(err.message);
            });
    }, [])

    if (error) {
        return <p className='error-color'>Error: {error}</p>
    }

    return (
        <div>
            <h3 style={{textAlign: 'center', padding: '20px'}}>Rooms</h3>
            <div>
                {rooms.map(room => (
                    <div key={room.id} className='room-overview'>
                        <p>{room.name}</p>
                        <p>City: {room.address.city}</p>
                        <p>Price Per Month: {room.pricePerMonthGbp}</p>
                        <p>Available From: {room.availabilityDate}</p>
                        <Link to={`/roomDetails/${room.id}`}>
                            <Button className='view-details-button'>View Details</Button>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Rooms;