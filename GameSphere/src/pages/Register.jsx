import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'player',
        sports: '', // Hidden in this simplified design or added as step 2? simplified for now as per image
        skillLevel: 'Beginner',
        location: ''
    });
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const { name, email, password, role } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
    const setRole = (r) => setFormData({ ...formData, role: r });

    const onSubmit = async e => {
        e.preventDefault();
        try {
            await register(formData);
            navigate('/');
        } catch (err) {
            console.error('Register Error', err);
        }
    };

    return (
        <div className="min-h-screen flex bg-white">
            {/* Left Side - Form */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 lg:p-24 overflow-y-auto">
                <div className="mb-10">
                    <Link to="/" className="flex items-center gap-2 text-indigo-900 font-extrabold text-2xl mb-12">
                        🏀 TeamUp
                    </Link>
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-3">Get in the game.</h1>
                    <p className="text-gray-500">Join thousands of local athletes and organizers today.</p>
                </div>

                <div className="flex bg-gray-100 p-1 rounded-xl mb-8">
                    <button
                        type="button"
                        onClick={() => setRole('player')}
                        className={`flex-1 py-2 rounded-lg text-sm font-semibold transition flex items-center justify-center gap-2 ${role === 'player' ? 'bg-white text-indigo-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        👤 Player
                    </button>
                    <button
                        type="button"
                        onClick={() => setRole('organizer')}
                        className={`flex-1 py-2 rounded-lg text-sm font-semibold transition flex items-center justify-center gap-2 ${role === 'organizer' ? 'bg-white text-indigo-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        👑 Organizer
                    </button>
                </div>

                <form onSubmit={onSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">📝</span>
                            <input type="text" name="name" value={name} onChange={onChange} className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50" placeholder="e.g. Alex Smith" required />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">✉️</span>
                            <input type="email" name="email" value={email} onChange={onChange} className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50" placeholder="name@example.com" required />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">🔒</span>
                            <input type="password" name="password" value={password} onChange={onChange} className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50" placeholder="••••••••" required />
                        </div>
                    </div>

                    <button type="submit" className="w-full bg-indigo-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-800 transition shadow-lg transform active:scale-[0.98]">
                        Create Account →
                    </button>
                </form>

                <div className="mt-8">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">Or continue with</span>
                        </div>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-3">
                        <button className="flex items-center justify-center px-4 py-3 border border-gray-200 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                            <span className="mr-2">G</span> Google
                        </button>
                        <button className="flex items-center justify-center px-4 py-3 border border-gray-200 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                            <span className="mr-2"></span> Apple
                        </button>
                    </div>
                </div>

                <p className="mt-8 text-center text-sm text-gray-600">
                    Already a member?{' '}
                    <Link to="/login" className="font-bold text-indigo-600 hover:text-indigo-500">
                        Log In
                    </Link>
                </p>
            </div>

            {/* Right Side - Image/Testimonial */}
            <div className="hidden lg:block lg:w-1/2 relative">
                <img
                    src="https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=2069&auto=format&fit=crop"
                    alt="Running athletes"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

                <div className="absolute bottom-16 left-16 right-16 text-white">
                    <h2 className="text-4xl font-extrabold leading-tight mb-6">
                        "TeamUp made it incredibly easy to find a local league. Now I play every Tuesday!"
                    </h2>
                    <div className="flex items-center gap-4">
                        <img src="https://i.pravatar.cc/150?img=11" alt="User" className="w-12 h-12 rounded-full border-2 border-white/50" />
                        <div>
                            <p className="font-bold text-lg">Marcus Johnson</p>
                            <p className="text-gray-300 text-sm">Amateur Soccer Player</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
