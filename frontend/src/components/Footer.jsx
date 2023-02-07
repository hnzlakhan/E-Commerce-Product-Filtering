import React from "react";
import {  Navbar } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";


const Footer = () => {
  return (

    <>
      <footer className="bg-dark text-light  text-center ">

        <div className="row mx-auto p-4">
          <div className="col-3"></div>
          <div className="col-6 ">  All rights reserved &copy; {new Date().getFullYear()}</div>
         <div className="col-2 contact " variant="dark">
          <LinkContainer to="/cont">
            <Navbar.Brand className="contactus">Contact Us</Navbar.Brand>
            </LinkContainer>
            </div>
</div>

    
    </footer></>
  
  );
};

export default Footer;
