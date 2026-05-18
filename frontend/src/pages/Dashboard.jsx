import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ total: 0, avgScore: 0, topDept: '', topEmployee: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await API.get('/employees');
        const total = data.length;
        const avgScore = total ? (data.reduce((sum, e) => sum + e.performanceScore, 0) / total).toFixed(1) : 0;
        const topEmployee = total ? data.reduce((a, b) => a.performanceScore > b.performanceScore ? a : b).name : 'N/A';
        const deptCount = data.reduce((acc, e) => { acc[e.department] = (acc[e.department] || 0) + 1; return acc; }, {});
        const topDept = Object.keys(deptCount).reduce((a, b) => deptCount[a] > deptCount[b] ? a : b, 'N/A');
        setStats({ total, avgScore, topDept, topEmployee });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>👋 Welcome, {user?.name}!</h2>
      <p style={styles.subtitle}>HR Analytics Dashboard</p>
      {loading ? <p>Loading stats...</p> : (
        <div style={styles.grid}>
          <div style={styles.card}>
            <h3>👥 Total Employees</h3>
            <p style={styles.number}>{stats.total}</p>
          </div>
          <div style={styles.card}>
            <h3>📊 Avg Performance</h3>
            <p style={styles.number}>{stats.avgScore}</p>
          </div>
          <div style={styles.card}>
            <h3>🏆 Top Employee</h3>
            <p style={styles.number}>{stats.topEmployee}</p>
          </div>
          <div style={styles.card}>
            <h3>🏢 Biggest Department</h3>
            <p style={styles.number}>{stats.topDept}</p>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { padding:'40px', maxWidth:'900px', margin:'0 auto' },
  title: { fontSize:'28px', color:'#1e1e2f' },
  subtitle: { color:'#666', marginBottom:'32px' },
  grid: { display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:'20px' },
  card: { backgroundColor:'white', padding:'24px', borderRadius:'12px', boxShadow:'0 2px 12px rgba(0,0,0,0.08)', textAlign:'center' },
  number: { fontSize:'32px', fontWeight:'bold', color:'#1e1e2f', margin:'8px 0 0' }
};

export default Dashboard;