import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from '../api/axios'; // Import our configured axios instance

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [userToken, setUserToken] = useState(null);
    const [userInfo, setUserInfo] = useState(null);

    const isLoggedIn = async () => {
        try {
            setIsLoading(true);
            let userToken = await AsyncStorage.getItem('userToken');
            let userInfo = await AsyncStorage.getItem('userInfo');
            userInfo = JSON.parse(userInfo);

            if (userToken) {
                setUserToken(userToken);
                setUserInfo(userInfo);
            }

            setIsLoading(false);
        } catch (e) {
            console.log('Login Error:', e);
            if (e.response) {
                console.log('Error Response:', e.response.data);
                console.log('Error Status:', e.response.status);
            } else if (e.request) {
                console.log('Error Request (No Response):', e.request);
            } else {
                console.log('Error Message:', e.message);
            }
            setIsLoading(false);
            throw e;
        }
    };

    useEffect(() => {
        isLoggedIn();
    }, []);

    const login = async (email, password) => {
        setIsLoading(true);
        console.log(`Attempting login to: ${axios.defaults.baseURL}/auth/login`);
        try {
            const response = await axios.post('/auth/login', {
                email,
                password
            });

            // Assuming the backend returns { token: '...', user: { ... } }
            let userInfo = response.data.user;
            let userToken = response.data.token;

            setUserInfo(userInfo);
            setUserToken(userToken);

            AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
            AsyncStorage.setItem('userToken', userToken);

            console.log('Login successful');
        } catch (e) {
            console.log(`Login error ${e}`);
            throw e; // Propagate error to update UI
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (name, email, password, role) => {
        setIsLoading(true);
        try {
            const response = await axios.post('/auth/register', {
                name,
                email,
                password,
                role,
            });

            // Assuming registration automatically logs the user in (returns token)
            // If not, you might want to navigate to login screen or auto-login
            let userInfo = response.data.user;
            let userToken = response.data.token;

            setUserInfo(userInfo);
            setUserToken(userToken);

            AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
            AsyncStorage.setItem('userToken', userToken);

            console.log('Registration successful');
        } catch (e) {
            console.log(`Register error ${e}`);
            throw e;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        setIsLoading(true);
        setUserToken(null);
        setUserInfo(null);
        AsyncStorage.removeItem('userToken');
        AsyncStorage.removeItem('userInfo');
        setIsLoading(false);
    };

    return (
        <AuthContext.Provider value={{
            login,
            logout,
            register,
            isLoading,
            userToken,
            userInfo
        }}>
            {children}
        </AuthContext.Provider>
    );
};
