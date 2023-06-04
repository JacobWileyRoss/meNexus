import './Navigation.css'
import {NavLink} from "react-router-dom";
import React, {useState} from "react";

const Navigation = ({color, textColor, fontSize}) => {
    return (
        <header className='NavigationPanel' style={{backgroundColor:color, color:textColor, fontSize: fontSize}}>
            <nav>
                <ul>
                    <li>
                        <NavLink to="/home">Home</NavLink>
                    </li>
                    <li>
                        <NavLink to="/profile">Profile</NavLink>
                    </li>
                    <li>
                        <NavLink to="/messages">Messages</NavLink>
                    </li>
                    <li>
                        <NavLink to="/settings">Settings</NavLink>
                    </li>
                </ul>
            </nav>
        </header>
    )
};

export default Navigation;