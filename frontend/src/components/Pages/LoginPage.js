import LoginLayout from "../Layouts/LoginLayout";
import LoginForm from "../LoginForm/LoginForm";
import React, { useState, useEffect } from 'react';
import axios from "axios";


const LoginPage = () => {

    return(
        <LoginLayout>
            <LoginForm/>
        </LoginLayout>



    );
}

export default LoginPage;
