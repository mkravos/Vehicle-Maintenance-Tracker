import React from 'react'
import 'bootstrap/dist/css/bootstrap.css';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

class BootstrapNavbar extends React.Component {
    render(){
        return(
            <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="m-auto">
                    <Nav.Link><Link to="/dashboard" className="nav-link">Dashboard</Link></Nav.Link>
                    <Nav.Link><Link to="/garage" className="nav-link">Garage</Link></Nav.Link>
                    <Nav.Link><Link to="/account" className="nav-link">Account</Link></Nav.Link>
                </Nav>
                </Navbar.Collapse>
            </Container>
            </Navbar>
        )  
    }
}

export default BootstrapNavbar;