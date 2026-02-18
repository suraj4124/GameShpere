import { Link, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const location = useLocation();

    return (
        <nav className="bg-white py-4 sticky top-0 z-50">
            <div className="container mx-auto px-4 flex justify-between items-center">
                <Link to="/" className="text-2xl font-extrabold text-indigo-900 flex items-center gap-2">
                    🏀 TeamUp
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-8 font-medium text-sm text-gray-600">
                    <Link to="/find-games" className="hover:text-indigo-600 transition">Games</Link>
                    <Link to="#" className="hover:text-indigo-600 transition">Events</Link>
                    <Link to="#" className="hover:text-indigo-600 transition">About</Link>
                </div>

                <div className="flex items-center gap-4">
                    {user ? (
                        <>
                            <div className="hidden md:flex items-center gap-2">
                                <span className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-xs">
                                    {user.name.charAt(0)}
                                </span>
                                <span className="text-sm font-semibold text-gray-700">{user.name}</span>
                            </div>
                            <Link to="/create-game" className="hidden md:block text-sm font-bold text-indigo-600 hover:underline">
                                Create Game
                            </Link>
                            <button
                                onClick={logout}
                                className="text-sm font-bold text-gray-500 hover:text-red-500 transition"
                            >
                                Log Out
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="text-sm font-bold text-gray-700 hover:text-indigo-600 px-4 py-2">
                                Log In
                            </Link>
                            <Link to="/register" className="text-sm font-bold bg-indigo-600 text-white px-6 py-2.5 rounded-full hover:bg-indigo-700 transition shadow-lg shadow-indigo-200">
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
