import { Link, useLocation } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AuthContext from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

    const isActive = (path) => {
        if (path === '/' && location.pathname !== '/') return false;
        return location.pathname.startsWith(path);
    };

    const navLinks = [
        { path: '/', label: 'Home' },
        { path: '/find-games', label: 'Games' },
        { path: '/events', label: 'Events' },
        { path: '/about', label: 'About' },
    ];

    const menuVariants = {
        closed: {
            opacity: 0,
            y: -20,
            transition: {
                staggerChildren: 0.05,
                staggerDirection: -1
            }
        },
        open: {
            opacity: 1,
            y: 0,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        closed: { opacity: 0, x: -10 },
        open: { opacity: 1, x: 0 }
    };

    return (
        <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100/50 supports-[backdrop-filter]:bg-white/60">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <Link to="/" className="relative z-10 text-2xl font-extrabold text-indigo-900 flex items-center gap-2 tracking-tight group">
                    <span className="transform group-hover:rotate-12 transition-transform duration-300">🏀</span>
                    GameSphere
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-2 bg-gray-100/50 p-1.5 rounded-full border border-gray-200/50">
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`relative px-4 py-1.5 rounded-full text-sm font-bold transition-colors ${isActive(link.path) ? 'text-indigo-900' : 'text-gray-500 hover:text-indigo-700'
                                }`}
                        >
                            {isActive(link.path) && (
                                <motion.div
                                    layoutId="navbar-active"
                                    className="absolute inset-0 bg-white rounded-full shadow-sm"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            <span className="relative z-10">{link.label}</span>
                        </Link>
                    ))}
                </div>

                <div className="flex items-center gap-2 md:gap-4">
                    {user ? (
                        <div className="flex items-center gap-2 md:gap-3">
                            {user.role === 'organizer' && (
                                <Link
                                    to="/create-game"
                                    className="hidden sm:flex items-center gap-2 text-xs font-bold bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition border border-indigo-100"
                                >
                                    <span>+</span> Create
                                </Link>
                            )}

                            <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
                                <Link to="/profile" className="flex items-center gap-2 hover:bg-gray-100 p-1 md:pr-3 rounded-full transition group border border-transparent hover:border-gray-200" title="View Profile">
                                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-md group-hover:shadow-sm transition">
                                        {user.name ? user.name.charAt(0).toUpperCase() : '?'}
                                    </div>
                                    <span className="hidden md:inline text-sm font-bold text-gray-700 group-hover:text-gray-900">
                                        {user.name && user.name !== 'Student' ? user.name : 'Profile'}
                                    </span>
                                </Link>
                                <button
                                    onClick={logout}
                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition"
                                    title="Log Out"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link to="/login" className="hidden sm:block text-sm font-bold text-gray-600 hover:text-indigo-600 px-4 py-2 hover:bg-gray-50 rounded-full transition">
                                Log In
                            </Link>
                            <Link to="/register" className="text-sm font-bold bg-indigo-900 text-white px-5 py-2.5 rounded-full hover:bg-indigo-800 transition shadow-lg shadow-indigo-200 active:scale-95 transform">
                                Sign Up
                            </Link>
                        </div>
                    )}

                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                    >
                        {isMobileMenuOpen ? (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        ) : (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" /></svg>
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial="closed"
                        animate="open"
                        exit="closed"
                        variants={menuVariants}
                        className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-100 shadow-xl overflow-hidden"
                    >
                        <div className="p-4 space-y-2">
                            {navLinks.map((link) => (
                                <motion.div key={link.path} variants={itemVariants}>
                                    <Link
                                        to={link.path}
                                        className={`block px-4 py-3 rounded-xl font-bold transition ${isActive(link.path) ? 'bg-indigo-50 text-indigo-900' : 'text-gray-600 hover:bg-gray-50'
                                            }`}
                                    >
                                        {link.label}
                                    </Link>
                                </motion.div>
                            ))}
                            {!user && (
                                <motion.div variants={itemVariants} className="pt-2 border-t border-gray-50 mt-2">
                                    <Link
                                        to="/login"
                                        className="block px-4 py-3 text-gray-600 font-bold hover:bg-gray-50 rounded-xl transition"
                                    >
                                        Log In
                                    </Link>
                                </motion.div>
                            )}
                            {user && user.role === 'organizer' && (
                                <motion.div variants={itemVariants} className="pt-2 border-t border-gray-50 mt-2">
                                    <Link
                                        to="/create-game"
                                        className="flex items-center gap-2 px-4 py-3 text-indigo-600 font-bold bg-indigo-50 rounded-xl transition"
                                    >
                                        <span>+</span> Create Game
                                    </Link>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
