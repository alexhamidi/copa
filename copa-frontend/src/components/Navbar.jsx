import React from 'react'
import { NavLink } from 'react-router-dom';

export default function Navbar() {
  return (
    <>
        <NavLink to="/">
            <header> About </header>
        </NavLink>
        <NavLink to="/OSCTdb">
            <header> OSCTdb </header>
        </NavLink>
        <NavLink to="/BALOSCTdb">
            <header> BALOSCTdb</header>
        </NavLink>
        <NavLink to="/COPA">
            <header> COPA</header>
        </NavLink>
        <NavLink to="/COPAtwo">
            <header> COPA2</header>
        </NavLink>
    </>
  );
}
