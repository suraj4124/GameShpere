import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import toast from 'react-hot-toast';

const GameDetails = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const [game, setGame] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchGame = async () => {
            try {
                const res = await axios.get(`/api/games/${id}`);
                setGame(res.data.data); // Updated response path
                setLoading(false);
            } catch (err) {
                setError('Game not found');
                setLoading(false);
                toast.error('Could not load game details');
            }
        };
        fetchGame();
    }, [id]);

    const handleJoin = async () => {
        try {
            const res = await axios.post(`/api/games/${id}/join`); // Updated route
            setGame(res.data.data); // Updated response path
            toast.success('Joined game successfully!');
        } catch (err) {
            toast.error(err.response?.data?.error || 'Error joining game');
        }
    };

    if (loading) return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>;
    if (error) return <div className="text-center mt-10 text-red-500 font-bold text-xl">{error}</div>;

    const isJoined = user && game.players.some(p => (p._id || p) === user._id);
    const isFull = game.players.length >= game.maxPlayers;
    const spotsLeft = game.maxPlayers - game.players.length;

    // Helper for sport image
    const getSportImage = (sport) => {
        const s = sport.toLowerCase();
        if (s.includes('basketball')) return 'https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=2090&auto=format&fit=crop';
        if (s.includes('football')) return 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=2070&auto=format&fit=crop';
        return 'https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=2070&auto=format&fit=crop';
    };

    return (
        <div className="bg-gray-50 min-h-screen font-sans pb-12">

            {/* Hero Section */}
            <div className="relative h-[400px] w-full">
                <img
                    src={getSportImage(game.sport)}
                    alt={game.sport}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/30"></div>

                <div className="absolute top-6 left-0 right-0 container mx-auto px-4 flex justify-between items-center text-white/90">
                    <Link to="/find-games" className="font-bold flex items-center hover:text-white transition">
                        <span className="mr-2">←</span> Back to Games
                    </Link>
                </div>

                <div className="absolute bottom-0 left-0 right-0 container mx-auto px-4 pb-12">
                    <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                        <div>
                            <span className="bg-green-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4 inline-block shadow-sm">
                                Verified Match
                            </span>
                            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight shadow-md">
                                {game.sport} Match
                            </h1>
                            <div className="flex items-center gap-3">
                                <span className="bg-white/10 backdrop-blur-md rounded-full px-4 py-2 text-white font-medium flex items-center gap-2 border border-white/20">
                                    <span className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-xs">👤</span>
                                    Organized by {game.organizer.name}
                                </span>
                                <span className="text-white/70">•</span>
                                <span className="bg-white/10 backdrop-blur-md rounded-full px-4 py-2 text-white text-sm font-medium border border-white/20">
                                    {game.skillLevel}
                                </span>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white px-6 py-3 rounded-xl font-bold border border-white/20 transition flex items-center gap-2">
                                📤 Share
                            </button>
                            {user ? (
                                !isJoined ? (
                                    <button
                                        onClick={handleJoin}
                                        disabled={isFull}
                                        className={`px-8 py-3 rounded-xl font-bold shadow-lg shadow-green-900/20 transition flex items-center gap-2 ${isFull ? 'bg-gray-500 cursor-not-allowed text-white' : 'bg-green-500 hover:bg-green-400 text-white'}`}
                                    >
                                        <span className="text-lg">+</span> {isFull ? 'Match Full' : `Join Match - $${game.entryFee}`}
                                    </button>
                                ) : (
                                    <div className="bg-green-500/20 backdrop-blur-md border border-green-500 text-green-100 px-8 py-3 rounded-xl font-bold">
                                        ✓ You're playing
                                    </div>
                                )
                            ) : (
                                <Link to="/login" className="bg-white text-gray-900 px-8 py-3 rounded-xl font-bold hover:bg-gray-100 transition">
                                    Login to Join
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-8 relative z-10">
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Main Content */}
                    <div className="flex-1 space-y-8">
                        {/* Match Details Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Format</p>
                                <p className="font-bold text-gray-900 text-lg">5v5 / {game.maxPlayers} Players</p>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Description</p>
                                <p className="font-bold text-gray-900 truncate">{game.description || 'Casual Game'}</p>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Duration</p>
                                <p className="font-bold text-gray-900 text-lg">90 Mins</p>
                            </div>
                        </div>

                        {/* Who's Playing */}
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
                                    👥 Who's Playing
                                </h3>
                                <div className="text-sm font-medium text-gray-500">{game.players.length}/{game.maxPlayers} Players</div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {game.players.map((player, idx) => (
                                    <div key={idx} className="flex items-center p-3 rounded-xl hover:bg-gray-50 transition border border-transparent hover:border-gray-100 group">
                                        <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-lg mr-4 group-hover:bg-white group-hover:shadow-md transition">
                                            {(player.name || '?').charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">{player.name}</p>
                                            <p className="text-xs text-gray-500 font-bold uppercase">
                                                {player._id === game.organizer._id ? 'Host' : 'Player'}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                {/* Open Slots */}
                                {[...Array(Math.max(0, game.maxPlayers - game.players.length))].map((_, i) => (
                                    <div key={i} className="flex items-center p-3 rounded-xl border border-dashed border-gray-200">
                                        <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mr-4">
                                            +
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-300 italic">Open Slot</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Match Chat (Mock) */}
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
                                    💬 Match Chat
                                </h3>
                                <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded">Only visible to players</span>
                            </div>

                            <div className="space-y-4 mb-6">
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 bg-indigo-50 rounded-full flex-shrink-0"></div>
                                    <div className="bg-gray-100 px-4 py-2 rounded-2xl rounded-tl-none">
                                        <p className="text-sm text-gray-700">Hey, is there free parking near the field?</p>
                                    </div>
                                </div>
                                <div className="flex gap-4 flex-row-reverse">
                                    <div className="w-10 h-10 bg-indigo-500 rounded-full flex-shrink-0"></div>
                                    <div className="bg-indigo-500 text-white px-4 py-2 rounded-2xl rounded-tr-none">
                                        <p className="text-sm">Yes! The north lot is free after 6 PM.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="relative">
                                <input type="text" placeholder="Type a message..." className="w-full pl-5 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
                                <button className="absolute right-2 top-2 p-1.5 bg-green-500 text-white rounded-lg">
                                    ➤
                                </button>
                            </div>
                        </div>

                    </div>

                    {/* Sidebar */}
                    <div className="w-full lg:w-[350px] space-y-6">
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h3 className="font-bold text-lg text-gray-900">Availability</h3>
                                    <p className={`font-bold text-3xl ${spotsLeft > 0 ? 'text-green-500' : 'text-red-500'}`}>{spotsLeft} Spots</p>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Remaining</p>
                                </div>
                                <div className="w-16 h-16 rounded-full border-4 border-gray-100 flex items-center justify-center relative">
                                    <svg className="w-full h-full transform -rotate-90 absolute">
                                        <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" className={`${spotsLeft > 0 ? 'text-green-500' : 'text-red-500'}`} strokeDasharray={`${(game.players.length / game.maxPlayers) * 176} 176`} />
                                    </svg>
                                    <span className="text-xs font-bold">{Math.round((game.players.length / game.maxPlayers) * 100)}%</span>
                                </div>
                            </div>

                            <hr className="border-gray-100 mb-6" />

                            <div className="space-y-4">
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center text-gray-500">📅</div>
                                    <div>
                                        <p className="font-bold text-gray-900 text-sm">{new Date(game.date).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}</p>
                                        <p className="text-xs text-gray-400">2023</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center text-gray-500">⏰</div>
                                    <div>
                                        <p className="font-bold text-gray-900 text-sm">{new Date(game.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                        <p className="text-xs text-indigo-600 font-bold cursor-pointer hover:underline">Add to Calendar</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center text-gray-500">💳</div>
                                    <div>
                                        <p className="font-bold text-gray-900 text-sm">${game.entryFee}.00 / Person</p>
                                        <p className="text-xs text-gray-400">Refundable up to 24h prior</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8">
                                <div className="h-32 bg-gray-200 rounded-xl mb-4 overflow-hidden relative">
                                    <img src="https://static.mapbikelane.com/melbourne.png" className="w-full h-full object-cover opacity-60" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-8 h-8 bg-green-500 rounded-full border-4 border-white shadow-lg"></div>
                                    </div>
                                </div>
                                <p className="font-bold text-gray-900">{game.location.split(',')[0]}</p>
                                <p className="text-xs text-gray-500">{game.location}</p>
                            </div>
                        </div>

                        <button className="w-full py-3 bg-white border border-gray-200 rounded-xl font-bold text-gray-700 hover:bg-gray-50 transition">
                            🏳 Report Issue
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GameDetails;
