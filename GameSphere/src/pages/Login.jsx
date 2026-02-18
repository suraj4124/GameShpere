import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const { email, password } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            console.error('Login Error', err);
        }
    };

    return (
        <div className="min-h-screen flex bg-white">
            {/* Left Side - Form */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 lg:p-24 overflow-y-auto">
                <div className="mb-12">
                    <Link to="/" className="flex items-center gap-2 text-indigo-900 font-extrabold text-2xl mb-12">
                        🏀 GameSphere
                    </Link>
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-3">Welcome back.</h1>
                    <p className="text-gray-500">Please enter your details to sign in.</p>
                </div>

                <form onSubmit={onSubmit} className="space-y-6">
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

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">Remember me</label>
                        </div>
                        <div className="text-sm">
                            <Link to="#" className="font-medium text-indigo-600 hover:text-indigo-500">Forgot your password?</Link>
                        </div>
                    </div>

                    <button type="submit" className="w-full bg-indigo-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-800 transition shadow-lg transform active:scale-[0.98]">
                        Sign In →
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
                    Don't have an account?{' '}
                    <Link to="/register" className="font-bold text-indigo-600 hover:text-indigo-500">
                        Create free account
                    </Link>
                </p>
            </div>

            {/* Right Side - Image/Testimonial */}
            <div className="hidden lg:block lg:w-1/2 relative">
                <img
                    src="https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=2070&auto=format&fit=crop"
                    alt="Gym athletes"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

                <div className="absolute bottom-16 left-16 right-16 text-white">
                    <h2 className="text-4xl font-extrabold leading-tight mb-6">
                        "I found my dream team within 24 hours. The community here is unmatched."
                    </h2>
                    <div className="flex items-center gap-4">
                        <img src="https://i.pravatar.cc/150?img=32" alt="User" className="w-12 h-12 rounded-full border-2 border-white/50" />
                        <div>
                            <p className="font-bold text-lg">Sarah Jenkins</p>
                            <p className="text-gray-300 text-sm">Pro Basketball Coach</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
