import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await API.post('/auth/login', form);
      login(data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>🔐 Login</h2>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <input style={styles.input} type="email" placeholder="Email"
            value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
          <input style={styles.input} type="password" placeholder="Password"
            value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
          <button style={styles.btn} type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p style={styles.switch}>Don't have an account? <Link to="/signup">Signup</Link></p>
      </div>
    </div>
  );
};

const styles = {
  container: { minHeight:'100vh', display:'flex', justifyContent:'center', alignItems:'center', backgroundColor:'#f0f2f5' },
  card: { backgroundColor:'white', padding:'40px', borderRadius:'12px', width:'360px', boxShadow:'0 4px 20px rgba(0,0,0,0.1)' },
  title: { textAlign:'center', marginBottom:'24px', color:'#1e1e2f' },
  input: { width:'100%', padding:'10px', marginBottom:'14px', borderRadius:'6px', border:'1px solid #ddd', boxSizing:'border-box', fontSize:'14px' },
  btn: { width:'100%', padding:'10px', backgroundColor:'#1e1e2f', color:'white', border:'none', borderRadius:'6px', cursor:'pointer', fontSize:'16px' },
  error: { color:'red', marginBottom:'12px', textAlign:'center' },
  switch: { textAlign:'center', marginTop:'16px', fontSize:'14px' }
};

export default Login;