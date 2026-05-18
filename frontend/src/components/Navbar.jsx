import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <Link to="/dashboard" style={styles.brand}>🧠 HR AI System</Link>
      {user && (
        <div style={styles.links}>
          <Link to="/dashboard" style={styles.link}>Dashboard</Link>
          <Link to="/employees" style={styles.link}>Employees</Link>
          <Link to="/add-employee" style={styles.link}>Add Employee</Link>
          <Link to="/ai" style={styles.link}>AI Recommendations</Link>
          <button onClick={handleLogout} style={styles.btn}>Logout</button>
        </div>
      )}
    </nav>
  );
};

const styles = {
  nav: { display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 24px', backgroundColor:'#1e1e2f', color:'white' },
  brand: { color:'white', textDecoration:'none', fontSize:'20px', fontWeight:'bold' },
  links: { display:'flex', gap:'16px', alignItems:'center' },
  link: { color:'#ccc', textDecoration:'none', fontSize:'14px' },
  btn: { backgroundColor:'#e53e3e', color:'white', border:'none', padding:'6px 14px', borderRadius:'6px', cursor:'pointer' }
};

export default Navbar;