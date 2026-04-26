import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dispensa from './pages/Dispensa';
import DettaglioProdotto from './pages/DettaglioProdotto';
import Navbar from './components/Navbar';

const PrivateRoute = ({ children }) => {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={
          <PrivateRoute>
            <Dispensa />
          </PrivateRoute>
        } />
         <Route path="/prodotto/:id" element={
          <PrivateRoute>
            <DettaglioProdotto />
          </PrivateRoute>
        } />
      </Routes>
    </>
  );
}

export default App;
