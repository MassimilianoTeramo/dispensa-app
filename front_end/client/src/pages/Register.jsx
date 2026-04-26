import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errore, setErrore] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/register', { email, password });
      navigate('/login');
    } catch {
      setErrore('Email already registered or error during sign up');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--cream)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🌱</div>
          <h1 style={{ fontSize: 32, fontWeight: 600, color: 'var(--green-dark)', marginBottom: 8 }}>
            Create account
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>
            Start managing your pantry
          </p>
        </div>

        <div style={{
          backgroundColor: 'var(--white)',
          borderRadius: 'var(--radius-lg)',
          padding: '32px 28px',
          boxShadow: 'var(--shadow-md)',
        }}>
          {errore && (
            <div style={{
              backgroundColor: 'var(--red-light)',
              border: '1px solid var(--red)',
              borderRadius: 'var(--radius-sm)',
              padding: '10px 14px',
              marginBottom: 20,
              color: 'var(--red)',
              fontSize: 14,
            }}>
              {errore}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="mario@example.com"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'var(--green-light)'}
                onBlur={e => e.target.style.borderColor = 'var(--cream-dark)'}
              />
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={labelStyle}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'var(--green-light)'}
                onBlur={e => e.target.style.borderColor = 'var(--cream-dark)'}
              />
            </div>
            <button type="submit" disabled={loading} style={{
              width: '100%',
              padding: '14px',
              backgroundColor: loading ? 'var(--text-muted)' : 'var(--green-dark)',
              color: 'var(--cream)',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              fontSize: 16,
              fontWeight: 600,
              transition: 'all 0.2s',
            }}>
              {loading ? 'Creating account...' : 'Sign up'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: 24, color: 'var(--text-secondary)', fontSize: 14 }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--green-light)', fontWeight: 600, textDecoration: 'none' }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

const labelStyle = {
  display: 'block',
  fontSize: 13,
  fontWeight: 500,
  color: 'var(--text-secondary)',
  marginBottom: 6,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
};

const inputStyle = {
  width: '100%',
  padding: '12px 16px',
  borderRadius: 'var(--radius-sm)',
  border: '1.5px solid var(--cream-dark)',
  fontSize: 15,
  backgroundColor: 'var(--cream)',
  color: 'var(--text-primary)',
  outline: 'none',
  transition: 'border-color 0.2s',
};

export default Register;