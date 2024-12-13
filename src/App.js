import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Rooms from './pages/Rooms';
import RoomDetails from "./pages/RoomDetails";

function App() {
    return (
        <Layout>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/rooms" element={<Rooms />} />
                <Route path="/roomDetails/:id" element={<RoomDetails />} />
            </Routes>
        </Layout>
    );
}

export default App;
