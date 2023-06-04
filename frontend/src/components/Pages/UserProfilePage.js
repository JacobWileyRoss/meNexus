// UserProfilePage.js
import React from "react";
import UserProfile from "../UserProfile/UserProfile";
import UserProfileLayout from "../Layouts/UserProfileLayout";

const UserProfilePage = () => {
    return (
        <UserProfileLayout>
            <UserProfile />
        </UserProfileLayout>
    );
};

export default UserProfilePage;
