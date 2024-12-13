import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faHome} from '@fortawesome/free-solid-svg-icons';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import {NavLink} from "react-router-dom";
import Button from "react-bootstrap/Button";
import '../style/Header.css'

const Header = () => {
    return(
        <Navbar bg='dark' variant='dark' expand='lg'>
            <Container fluid>
                <Navbar.Brand href="/" style={{color: 'brown'}}>
                    <FontAwesomeIcon icon={faHome}/> UK Dorm
                </Navbar.Brand>
                <Navbar.Toggle aria-controls='navbarScroll'/>
                <Navbar.Collapse id='navbarScroll'>
                    <Nav
                        className="me-auto my-2 my-lg-0"
                        style={{maxHeight: '100px'}} navbarScroll>
                        <NavLink className="nav-link" to='/rooms'>Rooms</NavLink>
                    </Nav>
                    <Button className='custom-button' >Login</Button>
                    <Button className='custom-button'>Register</Button>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default Header;