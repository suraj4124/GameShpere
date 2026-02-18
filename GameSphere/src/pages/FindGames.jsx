import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const FindGames = () => {
    const { user } = useContext(AuthContext); // Add context
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showRecommended, setShowRecommended] = useState(false); // Toggle state

    const [filter, setFilter] = useState({
        sport: 'All',
        location: '',
        date: '',
        skillLevel: 'Any Level'
    });

    // Set defaults based on user profile when logged in
    useEffect(() => {
        if (user) {
            // Default to recommended settings
            setShowRecommended(true);
            setFilter(prev => ({
                ...prev,
                sport: 'My Sports',
                skillLevel: 'Any Level', // Default to Any Level to ensure games show up
                location: ''
            }));
        }
    }, [user]);

    const toggleRecommended = () => {
        if (!showRecommended) {
            // Switch to Recommended
            setShowRecommended(true);
            if (user) {
                setFilter(prev => ({
                    ...prev,
                    sport: 'My Sports',
                    skillLevel: 'Any Level', // Default to Any Level to ensure games show up
                    location: ''
                }));
            }
        } else {
            // Switch to All
            setShowRecommended(false);
            setFilter({
                sport: 'All',
                location: '',
                date: '',
                skillLevel: 'Any Level'
            });
        }
    };

    useEffect(() => {
        const fetchGames = async () => {
            // ... existing fetch logic
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

    const filteredGames = games.filter(game => {
        let matchSport = false;
        if (filter.sport === 'All') {
            matchSport = true;
        } else if (filter.sport === 'My Sports') {
            // Match games if they are in user's preferred sports OR if the user has joined them
            const isPreferred = user && user.sports && user.sports.includes(game.sport);
            const isJoined = user && game.players && game.players.some(p => (p._id || p) === user._id);
            matchSport = isPreferred || isJoined;
        } else {
            matchSport = game.sport.toLowerCase() === filter.sport.toLowerCase();
        }

        const matchLocation = game.location.toLowerCase().includes(filter.location.toLowerCase());

        // Skill logic: 
        // If filter is "Any Level", show everything.
        // If game is "All Levels", show it regardless of filter.
        // If filter matches game level, show it.
        const matchSkill = filter.skillLevel === 'Any Level' ||
            game.skillLevel === 'All Levels' ||
            game.skillLevel === filter.skillLevel;

        return matchSport && matchLocation && matchSkill;
    });

    const getSportImage = (sport) => {
        const s = sport.toLowerCase();
        if (s.includes('basketball')) return 'https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=2090&auto=format&fit=crop';
        if (s.includes('football') || s.includes('soccer')) return 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=2070&auto=format&fit=crop';
        if (s.includes('tennis')) return 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?q=80&w=2070&auto=format&fit=crop';
        if (s.includes('cricket')) return 'https://images.unsplash.com/photo-1531415074968-bc0886d19065?q=80&w=2070&auto=format&fit=crop';
        return 'https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=2070&auto=format&fit=crop';
    };

    const getSkillColor = (level) => {
        if (level === 'Beginner') return 'bg-green-100 text-green-700';
        if (level === 'Intermediate') return 'bg-blue-100 text-blue-700';
        if (level === 'Pro' || level === 'Advanced') return 'bg-purple-100 text-purple-700';
        return 'bg-gray-100 text-gray-700';
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Sidebar Filters */}
                    <aside className="w-full lg:w-1/4 space-y-8">
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-lg text-gray-900">Filters</h3>
                                <button className="text-sm text-indigo-600 font-semibold hover:underline" onClick={() => setFilter({ sport: 'All', location: '', date: '', skillLevel: 'Any Level' })}>Reset All</button>
                            </div>

                            {/* Location */}
                            <div className="mb-6">
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Location</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2.5 text-gray-400">📍</span>
                                    <input
                                        type="text"
                                        placeholder="City or Zip Code"
                                        className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm bg-white"
                                        value={filter.location}
                                        onChange={(e) => setFilter({ ...filter, location: e.target.value })}
                                    />
                                </div>
                                <div className="mt-4">
                                    <label className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                                        <span>Distance</span>
                                        <span className="text-indigo-600">15 km</span>
                                    </label>
                                    <input type="range" className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
                                </div>
                            </div>

                            {/* Sport */}
                            <div className="mb-6">
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Sport</label>
                                <div className="space-y-2">
                                    {/* My Sports Option */}
                                    {user && (
                                        <label className={`flex items-center p-3 rounded-lg border cursor-pointer transition ${filter.sport === 'My Sports' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-100 bg-white hover:bg-gray-50'}`}>
                                            <input
                                                type="radio"
                                                name="sport"
                                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                                                checked={filter.sport === 'My Sports'}
                                                onChange={() => setFilter({ ...filter, sport: 'My Sports' })}
                                            />
                                            <span className={`ml-3 text-sm font-medium ${filter.sport === 'My Sports' ? 'text-indigo-900' : 'text-gray-700'}`}>My Sports ({user.sports?.length || 0})</span>
                                        </label>
                                    )}

                                    {['Football', 'Basketball', 'Tennis', 'Swimming', 'Cricket'].map(s => (
                                        <label key={s} className={`flex items-center p-3 rounded-lg border cursor-pointer transition ${filter.sport === s ? 'border-indigo-600 bg-indigo-50' : 'border-gray-100 bg-white hover:bg-gray-50'}`}>
                                            <input
                                                type="radio"
                                                name="sport"
                                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                                                checked={filter.sport === s}
                                                onChange={() => setFilter({ ...filter, sport: s })}
                                            />
                                            <span className={`ml-3 text-sm font-medium ${filter.sport === s ? 'text-indigo-900' : 'text-gray-700'}`}>{s}</span>
                                            {filter.sport === s && <span className="ml-auto text-indigo-600">✓</span>}
                                        </label>
                                    ))}
                                    <label className={`flex items-center p-3 rounded-lg border cursor-pointer transition ${filter.sport === 'All' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-100 bg-white hover:bg-gray-50'}`}>
                                        <input
                                            type="radio"
                                            name="sport"
                                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                                            checked={filter.sport === 'All'}
                                            onChange={() => setFilter({ ...filter, sport: 'All' })}
                                        />
                                        <span className={`ml-3 text-sm font-medium ${filter.sport === 'All' ? 'text-indigo-900' : 'text-gray-700'}`}>All Sports</span>
                                    </label>
                                </div>
                            </div>

                            {/* Skill Level */}
                            <div className="mb-6">
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Skill Level</label>
                                <select
                                    className="w-full p-2 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-indigo-500"
                                    value={filter.skillLevel}
                                    onChange={(e) => setFilter({ ...filter, skillLevel: e.target.value })}
                                >
                                    <option>Any Level</option>
                                    <option>Beginner</option>
                                    <option>Intermediate</option>
                                    <option>Pro</option>
                                </select>
                            </div>

                            {/* Date */}
                            <div className="mb-6">
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Date</label>
                                <input type="date" className="w-full p-2 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-indigo-500 text-gray-500" />
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1">
                        <div className="flex justify-between items-end mb-8">
                            <div>
                                <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Find a Match</h1>
                                <p className="text-gray-500">Discover local games and join the community.</p>

                                {user && (
                                    <div className="mt-4 flex items-center bg-gray-100 p-1 rounded-lg w-fit">
                                        <button
                                            onClick={toggleRecommended}
                                            className={`px-4 py-2 text-sm font-bold rounded-md transition ${showRecommended ? 'bg-white text-indigo-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                        >
                                            For You
                                        </button>
                                        <button
                                            onClick={toggleRecommended}
                                            className={`px-4 py-2 text-sm font-bold rounded-md transition ${!showRecommended ? 'bg-white text-indigo-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                        >
                                            All Games
                                        </button>
                                    </div>
                                )}
                            </div>
                            <div className="flex gap-2 bg-white p-1 rounded-lg border border-gray-200 shadow-sm">
                                <button className="p-2 bg-gray-100 rounded text-gray-600 hover:text-indigo-600">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                                </button>
                                <button className="p-2 hover:bg-gray-50 rounded text-gray-400 hover:text-indigo-600">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path></svg>
                                </button>
                            </div>
                        </div>

                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {filteredGames.length > 0 ? filteredGames.map(game => {
                                    const isJoined = user && game.players.some(p => (p._id || p) === user._id);
                                    return (
                                        <div key={game._id} className={`bg-white rounded-2xl border ${isJoined ? 'border-indigo-500 ring-2 ring-indigo-50' : 'border-gray-100'} shadow-sm hover:shadow-xl transition duration-300 flex flex-col overflow-hidden group`}>
                                            {/* Card Image Header */}
                                            <div className="h-40 relative overflow-hidden">
                                                <img
                                                    src={getSportImage(game.sport)}
                                                    alt={game.sport}
                                                    className="w-full h-full object-cover transform group-hover:scale-110 transition duration-500"
                                                />
                                                <div className="absolute top-4 left-4 flex gap-2">
                                                    <span className="bg-white/90 backdrop-blur text-gray-800 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                                                        {game.sport === 'Soccer' ? '⚽' : game.sport === 'Basketball' ? '🏀' : '🎮'} {game.sport}
                                                    </span>
                                                </div>
                                                <div className="absolute top-4 right-4 flex flex-col gap-2 items-end">
                                                    <span className={`text-xs font-bold px-3 py-1 rounded-full shadow-sm ${game.entryFee === 0 ? 'bg-green-500 text-white' : 'bg-gray-900 text-white'}`}>
                                                        {game.entryFee === 0 ? 'Free' : `$${game.entryFee}`}
                                                    </span>
                                                    {isJoined && (
                                                        <span className="bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm uppercase tracking-wide">
                                                            Joined
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Card Body */}
                                            <div className="p-5 flex-1 flex flex-col">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h3 className="font-bold text-lg text-gray-900 leading-tight">
                                                        {game.description && game.description.length > 20 ? game.description.substring(0, 30) + '...' : `${game.sport} Match`}
                                                    </h3>
                                                    <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide ${getSkillColor(game.skillLevel)}`}>
                                                        {game.skillLevel}
                                                    </span>
                                                </div>

                                                <div className="space-y-2 mt-2 mb-6">
                                                    <div className="flex items-center text-sm text-gray-500">
                                                        <span className="w-5 text-center mr-2">📅</span>
                                                        {new Date(game.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })} • {new Date(game.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                    <div className="flex items-center text-sm text-gray-500">
                                                        <span className="w-5 text-center mr-2">📍</span>
                                                        {game.location.split(',')[0]}
                                                    </div>
                                                </div>

                                                <div className="mt-auto">
                                                    <div className="flex justify-between text-xs font-semibold text-gray-500 mb-1">
                                                        <span>Players</span>
                                                        <span className={game.players.length >= game.maxPlayers ? 'text-red-500' : 'text-green-600'}>
                                                            {game.players.length}/{game.maxPlayers} spots filled
                                                        </span>
                                                    </div>
                                                    <div className="w-full bg-gray-100 rounded-full h-2 mb-4 overflow-hidden">
                                                        <div
                                                            className={`h-full rounded-full ${game.players.length >= game.maxPlayers ? 'bg-red-500' : 'bg-green-500'}`}
                                                            style={{ width: `${(game.players.length / game.maxPlayers) * 100}%` }}
                                                        ></div>
                                                    </div>

                                                    <Link
                                                        to={`/games/${game._id}`}
                                                        className={`w-full block text-center py-2.5 rounded-lg font-bold text-sm transition ${isJoined
                                                                ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200 border border-indigo-200'
                                                                : game.players.length >= game.maxPlayers
                                                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                                    : 'bg-green-500 text-white hover:bg-green-600 shadow-md shadow-green-200'
                                                            }`}
                                                    >
                                                        {isJoined ? 'View Details' : (game.players.length >= game.maxPlayers ? 'Match Full' : 'Join Match')}
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }) : (
                                    <div className="col-span-full flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-dashed border-gray-300">
                                        <div className="text-4xl mb-4">🔍</div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">No matches found</h3>
                                        <p className="text-gray-500 mb-6 text-center max-w-sm">We couldn't find any games matching your current filters. Try adjusting them or create your own!</p>
                                        <button onClick={() => setFilter({ sport: 'All', location: '', date: '', skillLevel: 'Any Level' })} className="text-indigo-600 font-bold hover:underline mb-2">Clear Filters</button>
                                        <Link to="/create-game" className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition">Create Game</Link>
                                    </div>
                                )}
                            </div>
                        )}

                        {filteredGames.length > 0 && (
                            <div className="mt-12 text-center">
                                <button className="px-6 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-full hover:bg-gray-50 transition shadow-sm">
                                    Load More Matches ↓
                                </button>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default FindGames;
