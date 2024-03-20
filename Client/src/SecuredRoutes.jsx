import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Outlet, Navigate } from 'react-router-dom';
const SecuredRoutes = () => {
    const [userData, setUserData] = useState();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setIsLoading(true)
                const response = await axios.get('/api/user-data');
                setUserData(response.data.data);
                console.log(response.data);
                setIsLoading(false);
            } catch (error) {
                setIsLoading(false);
                console.error('Error fetching user data:', error);
            }
        };
        fetchUserData();
    }, [setUserData]);

    return (
        isLoading ? <h1>Loading....</h1> : {userData} ? <Outlet /> : <Navigate to='/login' />
    );
};

export default SecuredRoutes;
