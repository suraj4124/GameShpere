import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const CreateGame = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        sport: 'Football',
        date: '',
        location: '',
        skillLevel: 'All Levels',
        maxPlayers: 10,
        entryFee: 0,
        description: ''
    });
    const [showSuccess, setShowSuccess] = useState(false);
    const [createdGameId, setCreatedGameId] = useState(null);

    const { sport, date, location, skillLevel, maxPlayers, entryFee, description } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        try {
            const res = await axios.post('/api/games', formData);
            setCreatedGameId(res.data._id);
            setShowSuccess(true);
        } catch (err) {
            console.error('Error creating game', err);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/50 py-12 px-4 flex justify-center items-start">
            <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl border border-gray-100 p-8 relative">
                <div className="mb-8">
                    <Link to="/find-games" className="text-sm font-semibold text-gray-400 hover:text-gray-600 mb-4 inline-block">
                        ← Back to Dashboard
                    </Link>
                    <h1 className="text-3xl font-extrabold text-gray-900">Organize a Match</h1>
                    <p className="text-gray-500 mt-1">Fill in the details below to set up your game and invite players.</p>
                </div>

                <form onSubmit={onSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-900 mb-2">Select Sport</label>
                        <select name="sport" value={sport} onChange={onChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-medium text-gray-700">
                            <option value="Football">Football</option>
                            <option value="Basketball">Basketball</option>
                            <option value="Tennis">Tennis</option>
                            <option value="Cricket">Cricket</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-2">Date & Time</label>
                            <input type="datetime-local" name="date" value={date} onChange={onChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-medium text-gray-700" required />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-2">Location</label>
                            <div className="relative">
                                <span className="absolute left-3 top-3.5 text-gray-400">📍</span>
                                <input type="text" name="location" value={location} onChange={onChange} className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-medium text-gray-700" placeholder="Where are we playing?" required />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-900 mb-2">Skill Level</label>
                        <div className="flex bg-gray-100 p-1 rounded-xl">
                            {['Beginner', 'Intermediate', 'Pro', 'All Levels'].map(level => (
                                <button
                                    key={level}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, skillLevel: level })}
                                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${skillLevel === level ? 'bg-white text-indigo-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    {level}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-2">Max Players</label>
                            <div className="relative">
                                <span className="absolute left-3 top-3.5 text-gray-400">👥</span>
                                <input type="number" name="maxPlayers" value={maxPlayers} onChange={onChange} className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-medium text-gray-700" required />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-2">Entry Fee <span className="text-gray-400 font-normal">(Optional)</span></label>
                            <div className="relative">
                                <span className="absolute left-3 top-3.5 text-gray-400">$</span>
                                <input type="number" name="entryFee" value={entryFee} onChange={onChange} className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-medium text-gray-700" placeholder="0.00" />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-900 mb-2">Description</label>
                        <textarea name="description" value={description} onChange={onChange} rows="3" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-medium text-gray-700" placeholder="Any specific rules or equipment needed?"></textarea>
                    </div>

                    <div className="pt-4">
                        <button type="submit" className="w-full bg-indigo-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-800 transition shadow-lg shadow-indigo-200">
                            Create Game
                        </button>
                    </div>
                </form>
            </div>

            {/* Success Modal */}
            {showSuccess && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 text-center transform transition-all scale-100">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="text-4xl text-green-600">✓</span>
                        </div>
                        <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Game Successfully Created!</h2>
                        <p className="text-gray-500 mb-8">Your game is now live. Invite friends or wait for locals to join.</p>

                        <div className="space-y-3">
                            <button
                                onClick={() => navigate(`/games/${createdGameId}`)}
                                className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-bold hover:bg-indigo-700 transition"
                            >
                                View Game Lobby
                            </button>
                            <button
                                onClick={() => navigate('/find-games')}
                                className="w-full bg-white border border-gray-200 text-gray-700 py-3.5 rounded-xl font-bold hover:bg-gray-50 transition"
                            >
                                Back to Dashboard
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreateGame;
