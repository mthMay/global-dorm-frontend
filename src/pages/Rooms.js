import React, {useEffect, useState} from 'react';
import api from '../api/apiConfig';

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

    return (
        <div>
            <h3 style={{textAlign: 'center', padding: '20px'}}>Rooms</h3>
            {error && <p style={{color: 'red'}}>Error: {error}</p>}
            <div>
                {rooms.map(room => (
                    <div key={room.id} style={{borderBottom: '1px solid black', marginBottom: '10px', listStyle: 'none', padding: '10px'}}>
                        <p>{room.name}</p>
                        <p>City: {room.address.city}</p>
                        <p>Price Per Month: {room.pricePerMonthGbp}</p>
                        <p>Available From: {room.availabilityDate}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Rooms;