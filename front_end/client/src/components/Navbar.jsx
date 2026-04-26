import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!token) return null;

  return (
    <>
      {/* Top bar */}
      <header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        backgroundColor: 'var(--green-dark)',
        padding: '16px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: 'var(--shadow-md)',
      }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <h1 style={{
            fontFamily: 'Fraunces, serif',
            fontSize: 22,
            fontWeight: 600,
            color: 'var(--cream)',
            letterSpacing: '-0.5px',
          }}>
            🌿 La mia Dispensa
          </h1>
        </Link>
        <button
          onClick={handleLogout}
          style={{
            backgroundColor: 'transparent',
            border: '1.5px solid rgba(250,247,242,0.3)',
            borderRadius: 'var(--radius-full)',
            color: 'var(--cream)',
            padding: '6px 16px',
            fontSize: 13,
            fontWeight: 500,
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => {
            e.target.style.backgroundColor = 'rgba(250,247,242,0.1)';
          }}
          onMouseLeave={e => {
            e.target.style.backgroundColor = 'transparent';
          }}
        >
          Esci
        </button>
      </header>

      {/* Spacer per compensare la navbar fissa */}
      <div style={{ height: 60 }} />
    </>
  );
}

export default Navbar;