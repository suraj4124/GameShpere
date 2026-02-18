import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
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
      </Router>
    </AuthProvider>
  );
}

export default App;
