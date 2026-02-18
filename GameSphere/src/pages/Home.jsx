import { Link } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const Home = () => {
    const { user } = useContext(AuthContext);
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGames = async () => {
            try {
                const res = await axios.get('/api/games');
                setGames(res.data.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchGames();
    }, []);

    const recommendedGames = user && user.sports ? games.filter(game =>
        user.sports.some(sport => game.sport.toLowerCase() === sport.toLowerCase())
    ).slice(0, 3) : [];

    const getSportIcon = (sport) => {
        const s = sport.toLowerCase();
        if (s.includes('basket')) return '🏀';
        if (s.includes('foot') || s.includes('socc')) return '⚽';
        if (s.includes('tenn')) return '🎾';
        if (s.includes('crick')) return '🏏';
        return '🎮';
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                duration: 0.5
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <motion.div
            className="bg-white min-h-screen font-sans text-gray-900"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Hero Section */}
            <section className="relative pt-20 pb-20 lg:pt-32 lg:pb-28 overflow-hidden">
                <div className="container mx-auto px-4 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                        {/* Text Content */}
                        <motion.div className="lg:w-1/2 text-left" variants={itemVariants}>
                            <span className="inline-block py-1 px-3 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold tracking-wider uppercase mb-6">
                                Community Sports
                            </span>
                            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-extrabold leading-tight text-gray-900 mb-6 tracking-tight">
                                Find Your Game. <br className="hidden sm:block" />
                                <span className="text-indigo-600 border-b-4 border-indigo-100 sm:border-none">Build Your Team.</span>
                            </h1>
                            <p className="text-lg text-gray-500 mb-8 leading-relaxed max-w-lg">
                                The easiest way to connect with local athletes, join pickup games, and organize tournaments in your community.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 mb-10">
                                <Link to="/find-games" className="px-8 py-4 bg-indigo-900 text-white rounded-full font-bold text-lg hover:bg-indigo-800 transition shadow-xl shadow-indigo-200 text-center transform hover:scale-105 active:scale-95 duration-200">
                                    Explore Games
                                </Link>
                                {user && user.role === 'organizer' && (
                                    <Link to="/create-game" className="px-8 py-4 bg-white text-gray-700 border border-gray-200 rounded-full font-bold text-lg hover:bg-gray-50 transition shadow-sm hover:shadow-md text-center transform hover:scale-105 active:scale-95 duration-200">
                                        Create Game
                                    </Link>
                                )}
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="flex -space-x-3">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                                            <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                </div>
                                <span className="text-sm font-medium text-gray-500">
                                    <span className="font-bold text-gray-900">+2k</span> Active players near you
                                </span>
                            </div>
                        </motion.div>

                        {/* Hero Image / Illustration */}
                        <motion.div className="lg:w-1/2 relative" variants={itemVariants}>
                            <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-indigo-50 p-8 lg:p-12 aspect-[4/3] flex items-center justify-center transform hover:scale-[1.02] transition duration-500">
                                {/* Abstract Shapes/Illustration Replacement */}
                                <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-200/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 animate-pulse"></div>
                                <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-200/50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 animate-pulse" style={{ animationDelay: '1s' }}></div>

                                <div className="relative z-10 w-full h-full bg-white/40 backdrop-blur-sm rounded-2xl border border-white/50 p-6 flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="text-6xl mb-4 animate-bounce">🏀 ⚽ 🎾</div>
                                        <p className="text-indigo-900 font-bold text-xl">Game On!</p>
                                        <div className="mt-4 bg-white p-3 rounded-xl shadow-lg inline-flex items-center gap-3">
                                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600">📍</div>
                                            <div className="text-left">
                                                <p className="text-xs font-bold text-gray-900">Central Park Court</p>
                                                <p className="text-[10px] text-gray-500">2 Games happening now</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4">
                    <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
                        <p className="text-gray-500 max-w-xl mx-auto">Get into the game in three simple steps. No hassle, just pure sport.</p>
                    </motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
                        {[
                            { icon: "🔍", title: "Discover", desc: "Search for games nearby based on your skill level, location, and preferred sport." },
                            { icon: "👥", title: "Join", desc: "Sign up for a slot instantly. Join a team or sign up as a free agent for pickup games." },
                            { icon: "🏆", title: "Play", desc: "Show up at the venue, meet new people, and enjoy the game. Track your stats afterwards." }
                        ].map((step, idx) => (
                            <motion.div
                                key={idx}
                                className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition duration-300 transform hover:-translate-y-1"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1, duration: 0.5 }}
                            >
                                <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-2xl mb-6">
                                    {step.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                                <p className="text-gray-500 leading-relaxed text-sm">
                                    {step.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Popular Sports */}
            <section className="py-12 lg:py-28">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">Popular Sports</h2>
                            <p className="text-gray-500">Browse games by category</p>
                        </div>
                        <Link to="/find-games" className="text-indigo-600 font-bold hover:underline hidden sm:block">View all sports →</Link>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
                        {[
                            { name: "Football", count: "128 active games", image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=2070&auto=format&fit=crop", icon: "🏈" },
                            { name: "Basketball", count: "89 active games", image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=2090&auto=format&fit=crop", icon: "🏀" },
                            { name: "Cricket", count: "56 active games", image: "https://images.unsplash.com/photo-1531415074968-bc0886d19065?q=80&w=2070&auto=format&fit=crop", icon: "🏏" },
                            { name: "Tennis", count: "42 active games", image: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?q=80&w=2070&auto=format&fit=crop", icon: "🎾" }
                        ].map((sport, idx) => (
                            <Link key={idx} to={`/events?sport=${sport.name}`}>
                                <motion.div
                                    className="relative h-64 lg:h-80 rounded-3xl overflow-hidden shadow-lg group cursor-pointer"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                >
                                    <img src={sport.image} alt={sport.name} className="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-110" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                                    <div className="absolute bottom-0 left-0 p-6 text-white relative z-10">
                                        <div className="text-4xl mb-2 transform group-hover:scale-110 transition duration-300 inline-block">{sport.icon}</div>
                                        <h3 className="text-xl font-bold">{sport.name}</h3>
                                        <p className="text-xs opacity-80">{sport.count}</p>
                                    </div>
                                </motion.div>
                            </Link>
                        ))}
                    </div>

                    <div className="mt-8 text-center sm:hidden">
                        <Link to="/find-games" className="text-indigo-600 font-bold hover:underline">View all sports →</Link>
                    </div>
                </div>
            </section>

            {/* Recommended for You - Personalized Feature */}
            {user && recommendedGames.length > 0 && (
                <section className="py-20 bg-indigo-50/50">
                    <div className="container mx-auto px-4">
                        <div className="flex justify-between items-end mb-12">
                            <div>
                                <span className="text-indigo-600 font-bold text-xs uppercase tracking-widest mb-2 block">For You</span>
                                <h2 className="text-3xl font-bold text-gray-900">Recommended Games</h2>
                            </div>
                            <Link to="/find-games" className="text-indigo-600 font-bold hover:underline">See suggestions →</Link>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
                            {recommendedGames.map((game, idx) => (
                                <motion.div
                                    key={game._id}
                                    className="bg-white rounded-3xl p-6 shadow-sm border border-indigo-100 hover:shadow-xl transition duration-300 relative overflow-hidden group"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                >
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-bl-full -mr-12 -mt-12 group-hover:bg-indigo-100 transition duration-300"></div>
                                    <div className="relative z-10">
                                        <div className="text-3xl mb-4">{getSportIcon(game.sport)}</div>
                                        <h3 className="font-bold text-xl mb-2 text-gray-900 capitalize">{game.sport} Match</h3>
                                        <div className="space-y-2 mb-6">
                                            <div className="flex items-center text-sm text-gray-500">
                                                <span className="mr-2">📍</span> {game.location}
                                            </div>
                                            <div className="flex items-center text-sm text-gray-500">
                                                <span className="mr-2">👤</span> {game.players?.length || 0}/{game.maxPlayers} Players
                                            </div>
                                        </div>
                                        <Link to={`/games/${game._id}`} className="block w-full text-center py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition">
                                            Join Now
                                        </Link>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* MVP Leaderboard - Hackathon Feature */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-5xl mx-auto rounded-3xl lg:rounded-[2.5rem] bg-white border border-gray-100 shadow-2xl shadow-indigo-100 overflow-hidden flex flex-col lg:flex-row">
                        <div className="lg:w-1/3 bg-indigo-900 p-8 lg:p-12 text-white">
                            <h2 className="text-3xl font-bold mb-4">MVP Organizers</h2>
                            <p className="text-indigo-200 text-sm mb-8">The most active community builders this month.</p>
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-xs font-bold backdrop-blur-sm">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
                                Community Alive
                            </div>
                        </div>
                        <div className="lg:w-2/3 p-8 lg:p-12">
                            <div className="space-y-6">
                                {[
                                    { name: "Alex Rivera", games: 24, sport: "Basketball", points: 1250 },
                                    { name: "Sarah Chen", games: 18, sport: "Tennis", points: 980 },
                                    { name: "Marcus Johnson", games: 15, sport: "Football", points: 840 }
                                ].map((leader, idx) => (
                                    <motion.div
                                        key={idx}
                                        className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition duration-300 border border-transparent hover:border-gray-100"
                                        initial={{ opacity: 0, x: 20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: idx * 0.1 }}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${idx === 0 ? 'bg-yellow-100 text-yellow-700' : idx === 1 ? 'bg-gray-100 text-gray-700' : 'bg-orange-100 text-orange-700'}`}>
                                                #{idx + 1}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900">{leader.name}</h4>
                                                <p className="text-xs text-gray-500">{leader.sport} Organizer • {leader.games} Games</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="block font-bold text-indigo-600">{leader.points}</span>
                                            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Points</span>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* CTA Section */}
            <section className="py-20 px-4">
                <div className="container mx-auto">
                    <motion.div
                        className="bg-indigo-900 rounded-[2.5rem] p-12 lg:p-20 text-center relative overflow-hidden"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        {/* Background decoration */}
                        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                            <div className="absolute top-[-20%] right-[-10%] w-96 h-96 bg-indigo-600/30 rounded-full blur-3xl animate-pulse"></div>
                            <div className="absolute bottom-[-20%] left-[-10%] w-96 h-96 bg-purple-600/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
                        </div>

                        <div className="relative z-10">
                            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-8 backdrop-blur-sm shadow-lg">
                                👥
                            </div>
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">Ready to hit the field?</h2>
                            <p className="text-indigo-200 text-lg max-w-2xl mx-auto mb-10">
                                Join thousands of players already organizing games in your city. It's free to get started.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link to="/register" className="px-8 py-4 bg-white text-indigo-900 rounded-xl font-bold text-lg hover:bg-gray-100 transition shadow-lg transform hover:scale-105 active:scale-95 duration-200">
                                    Download App
                                </Link>
                                <Link to="/find-games" className="px-8 py-4 bg-transparent border border-indigo-400 text-white rounded-xl font-bold text-lg hover:bg-indigo-800 transition transform hover:scale-105 active:scale-95 duration-200">
                                    Browse Events
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t border-gray-100 bg-white">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-10">
                        <div className="max-w-xs">
                            <Link to="/" className="text-2xl font-extrabold text-indigo-900 flex items-center gap-2 mb-4">
                                🏀 GameSphere
                            </Link>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                Connecting athletes and building communities through the power of sports.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 text-sm">
                            <div>
                                <h4 className="font-bold text-gray-900 mb-4">Platform</h4>
                                <ul className="space-y-3 text-gray-500">
                                    <li><Link to="/find-games" className="hover:text-indigo-600">Browse Games</Link></li>
                                    <li><Link to="/create-game" className="hover:text-indigo-600">Organize</Link></li>
                                    <li><Link to="#" className="hover:text-indigo-600">Pricing</Link></li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 mb-4">Company</h4>
                                <ul className="space-y-3 text-gray-500">
                                    <li><Link to="#" className="hover:text-indigo-600">About Us</Link></li>
                                    <li><Link to="#" className="hover:text-indigo-600">Careers</Link></li>
                                    <li><Link to="#" className="hover:text-indigo-600">Blog</Link></li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 mb-4">Support</h4>
                                <ul className="space-y-3 text-gray-500">
                                    <li><Link to="#" className="hover:text-indigo-600">Help Center</Link></li>
                                    <li><Link to="#" className="hover:text-indigo-600">Safety</Link></li>
                                    <li><Link to="#" className="hover:text-indigo-600">Contact</Link></li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-100 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-400">
                        <p>© 2024 GameSphere Inc. All rights reserved.</p>
                        <div className="flex gap-6 mt-4 md:mt-0">
                            <Link to="#" className="hover:text-gray-600">Privacy</Link>
                            <Link to="#" className="hover:text-gray-600">Terms</Link>
                            <Link to="#" className="hover:text-gray-600">Cookies</Link>
                        </div>
                    </div>
                </div>
            </footer>
        </motion.div>
    );
};

export default Home;
