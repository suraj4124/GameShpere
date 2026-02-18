const About = () => {
    return (
        <div className="min-h-screen bg-white font-sans text-gray-900">
            {/* Hero Section */}
            <div className="bg-indigo-900 text-white py-20 px-4">
                <div className="container mx-auto text-center">
                    <h1 className="text-4xl lg:text-5xl font-extrabold mb-6">About GameSphere</h1>
                    <p className="text-xl text-indigo-200 max-w-2xl mx-auto">
                        Connecting communities through the universal language of sports.
                    </p>
                </div>
            </div>

            {/* Mission Section */}
            <div className="py-16 px-4">
                <div className="container mx-auto max-w-4xl">
                    <h2 className="text-3xl font-bold mb-8 text-center">Our Mission</h2>
                    <p className="text-lg text-gray-600 leading-relaxed mb-6">
                        At GameSphere, we believe that sports have the power to bring people together, foster healthy lifestyles, and build stronger communities. Our mission is to make it effortless for anyone, anywhere, to find a game, join a team, and play the sports they love.
                    </p>
                    <p className="text-lg text-gray-600 leading-relaxed">
                        Whether you're a seasoned pro looking for competitive tournaments or a beginner wanting to try something new, GameSphere provides the platform to connect with like-minded athletes in your area.
                    </p>
                </div>
            </div>

            {/* Values Section */}
            <div className="bg-gray-50 py-16 px-4">
                <div className="container mx-auto max-w-6xl">
                    <h2 className="text-3xl font-bold mb-12 text-center">Our Core Values</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-white p-8 rounded-xl shadow-sm text-center">
                            <div className="text-4xl mb-4">🤝</div>
                            <h3 className="text-xl font-bold mb-3">Community First</h3>
                            <p className="text-gray-500">We prioritize building safe, inclusive, and welcoming spaces for everyone.</p>
                        </div>
                        <div className="bg-white p-8 rounded-xl shadow-sm text-center">
                            <div className="text-4xl mb-4">⚡</div>
                            <h3 className="text-xl font-bold mb-3">Accessibility</h3>
                            <p className="text-gray-500">Sports should be accessible to all, regardless of skill level or background.</p>
                        </div>
                        <div className="bg-white p-8 rounded-xl shadow-sm text-center">
                            <div className="text-4xl mb-4">🔥</div>
                            <h3 className="text-xl font-bold mb-3">Passion</h3>
                            <p className="text-gray-500">We are fueled by a love for the game and the joy of competition.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Team Section */}
            <div className="py-16 px-4">
                <div className="container mx-auto max-w-4xl text-center">
                    <h2 className="text-3xl font-bold mb-8">Built for Athletes, by Athletes</h2>
                    <p className="text-gray-600 mb-8">
                        GameSphere was born out of frustration with cancelled games and empty fields. We're a team of passionate developers and sports enthusiasts dedicated to solving the "where to play" problem once and for all.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default About;
