import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CreateGame from './pages/CreateGame';
import FindGames from './pages/FindGames';
import GameDetails from './pages/GameDetails';
import Profile from './pages/Profile';
import Events from './pages/Events';
import About from './pages/About';
import ProtectedRoute from './components/ProtectedRoute';
import { Toaster, toast } from 'react-hot-toast';
import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const CommunityActivity = () => {
  useEffect(() => {
    const events = [
      "New game created in Central Park!",
      "Alex just joined a Basketball match.",
      "Sarah Chen became an MVP Organizer!",
      "5 players just signed up for Tennis.",
      "Tournament registrations are now open!",
    ];

    const interval = setInterval(() => {
      const event = events[Math.floor(Math.random() * events.length)];
      toast(event, {
        icon: '🚀',
        style: {
          borderRadius: '10px',
          background: '#312e81',
          color: '#fff',
          fontSize: '12px',
          fontWeight: 'bold',
        },
      });
    }, 15000); // Every 15 seconds

    return () => clearInterval(interval);
  }, []);

  return null;
};

const PageTransition = ({ children }) => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
        <CommunityActivity />
        <div className="pt-16">
          <PageTransition>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/create-game" element={<ProtectedRoute allowedRoles={['organizer', 'admin']}><CreateGame /></ProtectedRoute>} />
              <Route path="/find-games" element={<FindGames />} />
              <Route path="/games/:id" element={<GameDetails />} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/events" element={<Events />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </PageTransition>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
