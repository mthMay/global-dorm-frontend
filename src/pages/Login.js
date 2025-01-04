import React, {useContext, useState} from "react";
import api from '../api/apiConfig';
import UserContext from "../components/UserContext";
import "../style/Form.css";

const Login = () => {
    const { login } = useContext(UserContext);
    const [formData, setFormData] = useState({username: '', password: ''});
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            const response = await api.post('/api/users/login', formData);
            setMessage(response.data);
            login({ username: formData.username });
        } catch (error) {
            setMessage(error.response?.data || "An unexpected error occurred.");
        }
    };

    return (
        <div className="form-container">
            <div className="form-box">
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Username: </label>
                        <input type="text" name="username" value={formData.username} onChange={handleChange} required/>
                    </div>
                    <div>
                        <label>Password: </label>
                        <input type="password" name="password" value={formData.password} onChange={handleChange} required/>
                    </div>
                    <button type="submit" >Login</button>
                </form>
                {message && <p>{message}</p>}
            </div>
        </div>
    );
}

export default Login;