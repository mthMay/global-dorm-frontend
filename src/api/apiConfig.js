import axios from 'axios';

export default axios.create({
    baseURL: "http://localhost:8080" || process.env.REACT_APP_BACKEND_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});