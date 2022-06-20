import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Button from 'react-bootstrap/Button';
import React, { useState } from "react";
import './navbar.css'
import { algoNameMapping } from '../../../algorithms';

const leftAlgoNameMapping = structuredClone(algoNameMapping);
leftAlgoNameMapping["none"] = "Choose Algorithm 1";
const rightAlgoNameMapping = structuredClone(algoNameMapping);
rightAlgoNameMapping["none"] = "Choose Algorithm 2";

export default function NavBar(props) {

  // Add variable based choosing of algorithm
  const [disabled, setDisabled] = useState(false);


    return (
      <div className="content-nav-bar">
        <Navbar bg="light" expand="lg">
          <Container>
            <Navbar.Brand href="#home">Grid Search Comparison</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="m-auto">
                
              </Nav>
              <Nav>
                <Nav defaultActiveKey="" className="flex-column">
                    <div className="dropdown-wrapper">
                      <div className="left-circle"></div>
                      <NavDropdown 
                      title={leftAlgoNameMapping[props.leftAlgoName]}
                      id="left-algo-dropdown" 
                      className="left-algo-dropdown"
                      variant="dark"
                      onSelect={(eventKey, event) => props.selectLeftAlgo(eventKey.split("-")[1])}
                      disabled={disabled}>
                        {Object.keys(leftAlgoNameMapping).map(function(key, index) {
                          return <NavDropdown.Item eventKey={`left-${key}`}>{leftAlgoNameMapping[key]}</NavDropdown.Item>;
                          
                        })}
                      </NavDropdown>
                    </div>
                    <div className="dropdown-wrapper">
                      <div className="right-circle"></div>
                      <NavDropdown 
                      title={rightAlgoNameMapping[props.rightAlgoName]} 
                      id="right-algo-dropdown"  
                      className="right-algo-dropdown"
                      onSelect={(eventKey, event) => props.selectRightAlgo(eventKey.split("-")[1])}
                      disabled={disabled}>
                        {Object.keys(rightAlgoNameMapping).map(function(key, index) {
                          return <NavDropdown.Item eventKey={`left-${key}`}>{rightAlgoNameMapping[key]}</NavDropdown.Item>
                        })}
                      </NavDropdown>
                    </div>
                    
                  </Nav>
                <Button id="go-button" 
                  className="nav-button"
                  variant="outline-dark" 
                  onClick={() => {
                      setDisabled(true);
                      const speed = props.clickGo();
                      setTimeout(() => {
                        setDisabled(false);
                      }, speed);
                    } 
                  }
                  disabled={disabled}>Compare!</Button>
                <Nav defaultActiveKey="" className="flex-column">
                  <Button id="clear-search-button" 
                  className="nav-clear-button" 
                  variant="outline-warning" 
                  onClick={props.clickSoftReset} 
                  disabled={disabled}>Clear Paths</Button>

                  <Button id="reset-button" 
                  className="nav-reset-button" 
                  variant="outline-secondary" 
                  onClick={props.clickReset} 
                  disabled={disabled}>Reset Board</Button>
                </Nav>
                
              </Nav>
                
              
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </div>
    )
  }
  