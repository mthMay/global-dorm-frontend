import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import {NavLink, useNavigate} from "react-router-dom";
import Button from "react-bootstrap/Button";
import '../style/Header.css'
import {useContext} from "react";
import UserContext from "./UserContext";

const Header = () => {
    const {user, logout} = useContext(UserContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    // code for navbar is modified from https://react-bootstrap.netlify.app/docs/components/navbar/ (React Bootstrap, n.d.)
    return(
        <Navbar bg='dark' variant='dark' expand='lg'>
            <Container fluid>
                <Navbar.Brand href="/" style={{color: 'brown'}}>
                    UK Dorm
                </Navbar.Brand>
                <Navbar.Toggle aria-controls='navbarScroll'/>
                <Navbar.Collapse id='navbarScroll'>
                    <Nav
                        className="me-auto my-2 my-lg-0"
                        style={{maxHeight: '100px'}} navbarScroll>
                        <NavLink className="nav-link" to='/rooms'>Rooms</NavLink>
                    </Nav>
                    {user ? (
                        <span className="welcome-message" style={{color: 'white'}}>
                            Welcome, {user.username}
                            <Button className="custom-button" onClick={() => navigate('/profile')}>Profile</Button>
                            <Button className="custom-button" onClick={handleLogout}>Logout</Button>
                        </span>
                    ) : (
                        <>
                            <Button className='custom-button' onClick={() => navigate('/login')}>Login</Button>
                            <Button className='custom-button' onClick={() => navigate('/register')}>Register</Button>
                        </>
                    )}
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default Header;