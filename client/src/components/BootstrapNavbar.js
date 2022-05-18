import React from 'react'
import 'bootstrap/dist/css/bootstrap.css';
import { Navbar, Nav, Container } from 'react-bootstrap'

class BootstrapNavbar extends React.Component {
    render(){
        return(
            <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="m-auto">
                    <Nav.Link href="/dashboard">Dashboard</Nav.Link>
                    <Nav.Link href="/garage">Garage</Nav.Link>
                    <Nav.Link href="/report">Report</Nav.Link>
                </Nav>
                </Navbar.Collapse>
            </Container>
            </Navbar>
        )  
    }
}

export default BootstrapNavbar;