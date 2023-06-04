import React from "react";
import Navigation from "../Navigation/Navigation";
import Header from "../Header/Header";
import './UserProfileLayout.css'

const UserProfileLayout = ({ children }) => {
    return (
        <div>
            {/* Common Header & Navigation panel*/}
            <Header color={'black'}/>
            <Navigation color={'black'}/>
            {/* User profile content */}
            <div className="MainContentUserProfile clearfix">
                {/* User profile content */}
                <div>{children}</div>
            </div>

            {/* Common footer */}
            <footer>
                {/* Footer content */}
            </footer>
        </div>
    );
};

export default UserProfileLayout;
