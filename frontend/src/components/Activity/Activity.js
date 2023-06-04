import './Activity.css'
import {NavLink} from "react-router-dom";
import React, {useState} from "react";

const Activity = ({color, textColor, fontSize}) => {
    return (
        <header className='ActivityPanel' style={{backgroundColor:color, color:textColor, fontSize: fontSize}}>
            <nav>
                <ul>
                    <li>
                        <h1>ACTIVITY</h1>
                        <p>myNexus has been initiated! </p>
                        <p>@enki is trending</p>
                        <p>@heavenlyyart is beautiful</p>
                    </li>
                </ul>
            </nav>
        </header>
    )
};

export default Activity;