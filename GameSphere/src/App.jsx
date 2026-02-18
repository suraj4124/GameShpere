import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CreateGame from './pages/CreateGame';
import FindGames from './pages/FindGames';
import GameDetails from './pages/GameDetails';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/create-game" element={<ProtectedRoute><CreateGame /></ProtectedRoute>} />
          <Route path="/find-games" element={<FindGames />} />
          <Route path="/games/:id" element={<GameDetails />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
