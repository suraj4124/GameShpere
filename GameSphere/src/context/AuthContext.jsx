import { createContext, useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadUser = async () => {
        try {
            const res = await axios.get("/api/auth/me"); // Updated path to match new routes
            setUser(res.data.data); // Updated to match new response structure { success: true, data: user }
        } catch (error) {
            setUser(null);
        }
        setLoading(false);
    };

    useEffect(() => {
        loadUser();
    }, []);

    const login = async (email, password) => {
        try {
            await axios.post("/api/auth/login", { email, password });
            await loadUser();
            toast.success("Logged in successfully!");
        } catch (err) {
            toast.error(err.response?.data?.error || "Login failed");
            throw err;
        }
    };

    const register = async (userData) => {
        try {
            await axios.post("/api/auth/register", userData);
            await loadUser();
            toast.success("Account created successfully!");
        } catch (err) {
            toast.error(err.response?.data?.error || "Registration failed");
            throw err;
        }
    };

    const logout = async () => {
        try {
            await axios.get("/api/auth/logout"); // Updated to GET based on new controller
            setUser(null);
            toast.success("Logged out successfully");
            // Clear local games/data if needed
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
