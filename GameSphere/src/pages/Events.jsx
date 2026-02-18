import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useSearchParams } from 'react-router-dom';

const Events = () => {
    const [searchParams] = useSearchParams();
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState({
        sport: searchParams.get('sport') || 'All',
        location: '',
        date: '',
        skillLevel: 'Any Level'
    });

    useEffect(() => {
        const sportFromQuery = searchParams.get('sport');
        if (sportFromQuery) {
            setFilter(prev => ({ ...prev, sport: sportFromQuery }));
        }
    }, [searchParams]);

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

    const filteredGames = games.filter(game => {
        const matchSport = filter.sport === 'All' || game.sport.toLowerCase() === filter.sport.toLowerCase();
        const matchLocation = game.location.toLowerCase().includes(filter.location.toLowerCase());
        const matchSkill = filter.skillLevel === 'Any Level' || game.skillLevel === 'All Levels' || game.skillLevel === filter.skillLevel;
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
                <div className="mb-8">
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
                        {filter.sport === 'All' ? 'All Events' : `${filter.sport} Events`}
                    </h1>
                    <p className="text-gray-500">
                        {filter.sport === 'All'
                            ? 'Browse all upcoming sports events in your community.'
                            : `Showing all upcoming ${filter.sport} events.`}
                    </p>
                    {filter.sport !== 'All' && (
                        <button
                            onClick={() => setFilter(prev => ({ ...prev, sport: 'All' }))}
                            className="mt-4 text-indigo-600 font-bold hover:underline flex items-center gap-1"
                        >
                            <span>←</span> Back to All Events
                        </button>
                    )}
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredGames.length > 0 ? filteredGames.map(game => (
                            <div key={game._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition duration-300 flex flex-col overflow-hidden group">
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
                                    <div className="absolute top-4 right-4">
                                        <span className={`text-xs font-bold px-3 py-1 rounded-full shadow-sm ${game.entryFee === 0 ? 'bg-green-500 text-white' : 'bg-gray-900 text-white'}`}>
                                            {game.entryFee === 0 ? 'Free' : `$${game.entryFee}`}
                                        </span>
                                    </div>
                                </div>

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
                                        <Link
                                            to={`/games/${game._id}`}
                                            className={`w-full block text-center py-2.5 rounded-lg font-bold text-sm transition ${game.players.length >= game.maxPlayers ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-green-500 text-white hover:bg-green-600 shadow-md shadow-green-200'}`}
                                        >
                                            {game.players.length >= game.maxPlayers ? 'Match Full' : 'View Details'}
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="col-span-full flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-dashed border-gray-300">
                                <div className="text-4xl mb-4">🔍</div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">No events found</h3>
                                <p className="text-gray-500 mb-6 text-center max-w-sm">There are no upcoming events at the moment.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Events;
