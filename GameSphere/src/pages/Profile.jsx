import { useState, useContext, useEffect } from 'react';
import AuthContext from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';

const Profile = () => {
    const { user } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: '',
        sports: '',
        skillLevel: 'Beginner',
        location: ''
    });

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get('/api/users/me');
                setFormData({
                    name: res.data.data.name,
                    email: res.data.data.email,
                    role: res.data.data.role,
                    sports: res.data.data.sports ? res.data.data.sports.join(', ') : '',
                    skillLevel: res.data.data.skillLevel || 'Beginner',
                    location: res.data.data.location || ''
                });
                setLoading(false);
            } catch (err) {
                console.error(err);
                toast.error('Failed to load profile');
                setLoading(false);
            }
        };

        if (user) {
            fetchUser();
        }
    }, [user]);

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            // Format sports string to array if needed by backend, or send as is if backend handles it
            // Backend User model expects array of strings for sports
            const updatedData = {
                ...formData,
                sports: formData.sports.split(',').map(s => s.trim()).filter(s => s !== '')
            };

            await axios.put('/api/users/me', updatedData, config);
            toast.success('Profile Updated Successfully');
        } catch (err) {
            console.error(err);
            toast.error('Error updating profile');
        }
    };

    if (loading) return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>;

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-indigo-900 px-6 sm:px-8 py-8 sm:py-10 text-white relative overflow-hidden">
                        <div className="relative z-10 flex items-center gap-6">
                            <div className="w-24 h-24 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-4xl font-bold border-4 border-white/30">
                                {formData.name.charAt(0)}
                            </div>
                            <div>
                                <h1 className="text-3xl font-extrabold">{formData.name}</h1>
                                <p className="text-indigo-200 font-medium flex items-center gap-2 mt-1">
                                    <span className="capitalize bg-indigo-700 px-3 py-1 rounded-full text-xs tracking-wide">{formData.role}</span>
                                    <span>{formData.email}</span>
                                </p>
                            </div>
                        </div>

                        {/* Decorative circles */}
                        <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-indigo-600 rounded-full blur-3xl opacity-50"></div>
                        <div className="absolute bottom-[-20%] left-[-10%] w-64 h-64 bg-purple-600 rounded-full blur-3xl opacity-50"></div>
                    </div>

                    {/* Form */}
                    <div className="p-6 sm:p-8">
                        <form onSubmit={onSubmit} className="space-y-6">
                            <h2 className="text-xl font-bold text-gray-900 border-b pb-2 mb-6">Edit Profile</h2>

                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={onChange}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                                        placeholder="Enter your full name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email (Read Only)</label>
                                    <input type="email" value={formData.email} disabled className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed" />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                    <input type="text" name="location" value={formData.location} onChange={onChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" placeholder="City, State" />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Sports of Interest</label>
                                    <input type="text" name="sports" value={formData.sports} onChange={onChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" placeholder="e.g. Football, Basketball, Tennis (comma separated)" />
                                    <p className="text-xs text-gray-500 mt-1">Separate multiple sports with commas.</p>
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Skill Level</label>
                                    <select name="skillLevel" value={formData.skillLevel} onChange={onChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white">
                                        <option value="Beginner">Beginner</option>
                                        <option value="Intermediate">Intermediate</option>
                                        <option value="Pro">Pro</option>
                                    </select>
                                </div>
                            </div>

                            {/* Athlete Passport - Hackathon Feature */}
                            <motion.div
                                className="mt-12 bg-indigo-50 rounded-2xl p-6 border border-indigo-100"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5 }}
                            >
                                <h3 className="text-lg font-bold text-indigo-900 mb-4 flex items-center gap-2">
                                    <span>🎖️</span> Athlete Passport
                                </h3>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    {[
                                        { icon: "🏅", label: "Early Bird", earned: true },
                                        { icon: "🔥", label: "Game Streak", earned: true },
                                        { icon: "🤝", label: "Teammate", earned: false },
                                        { icon: "⚽", label: "Goal Getter", earned: false }
                                    ].map((badge, idx) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            whileInView={{ opacity: 1, scale: 1 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: idx * 0.1 }}
                                            className={`p-4 rounded-xl flex flex-col items-center justify-center text-center ${badge.earned ? 'bg-white shadow-sm' : 'opacity-40 grayscale bg-gray-100'}`}
                                        >
                                            <span className="text-2xl mb-2">{badge.icon}</span>
                                            <span className="text-[10px] font-bold uppercase tracking-tight text-gray-600">{badge.label}</span>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Active Stats */}
                            <div className="mt-8 grid grid-cols-3 gap-4">
                                {[
                                    { label: "Games Joined", value: "12", color: "text-indigo-600" },
                                    { label: "Wins", value: "5", color: "text-green-600" },
                                    { label: "Rating", value: "4.9", color: "text-indigo-600" }
                                ].map((stat, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.3 + (idx * 0.1) }}
                                        className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center"
                                    >
                                        <span className={`block text-2xl font-bold ${stat.color}`}>{stat.value}</span>
                                        <span className="text-[10px] font-bold text-gray-400 uppercase">{stat.label}</span>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="flex justify-end pt-4">
                                <button type="submit" className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition shadow-md">
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
