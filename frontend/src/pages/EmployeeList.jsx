import { useState, useEffect } from 'react';
import API from '../api/axios';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('');
  const [message, setMessage] = useState('');

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.name = search;
      if (department) params.department = department;
      const endpoint = (search || department) ? '/employees/search' : '/employees';
      const { data } = await API.get(endpoint, { params });
      setEmployees(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEmployees(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this employee?')) return;
    try {
      await API.delete(`/employees/${id}`);
      setMessage('✅ Employee deleted successfully');
      fetchEmployees();
    } catch (err) {
      setMessage('❌ Failed to delete employee');
    }
  };

  const handleUpdate = async (id, currentScore) => {
    const newScore = prompt('Enter new performance score (0-100):', currentScore);
    if (!newScore) return;
    try {
      await API.put(`/employees/${id}`, { performanceScore: Number(newScore) });
      setMessage('✅ Performance score updated');
      fetchEmployees();
    } catch (err) {
      setMessage('❌ Failed to update score');
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#38a169';
    if (score >= 60) return '#d69e2e';
    return '#e53e3e';
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>👥 Employee List</h2>
      {message && <p style={styles.message}>{message}</p>}

      <div style={styles.searchBar}>
        <input style={styles.input} placeholder="Search by name..."
          value={search} onChange={e => setSearch(e.target.value)} />
        <input style={styles.input} placeholder="Filter by department..."
          value={department} onChange={e => setDepartment(e.target.value)} />
        <button style={styles.btn} onClick={fetchEmployees}>🔍 Search</button>
        <button style={styles.clearBtn} onClick={() => { setSearch(''); setDepartment(''); setTimeout(fetchEmployees, 100); }}>✕ Clear</button>
      </div>

      {loading ? <p>Loading employees...</p> : employees.length === 0 ? <p>No employees found.</p> : (
        <div style={styles.grid}>
          {employees.map(emp => (
            <div key={emp._id} style={styles.card}>
              <h3 style={styles.name}>{emp.name}</h3>
              <p style={styles.dept}>🏢 {emp.department}</p>
              <p>📧 {emp.email}</p>
              <p>⏱ {emp.experience} years experience</p>
              <p>🛠 {emp.skills.join(', ')}</p>
              <div style={styles.scoreRow}>
                <span>Performance:</span>
                <span style={{ ...styles.score, color: getScoreColor(emp.performanceScore) }}>
                  {emp.performanceScore}/100
                </span>
              </div>
              <div style={styles.actions}>
                <button style={styles.updateBtn} onClick={() => handleUpdate(emp._id, emp.performanceScore)}>✏️ Update</button>
                <button style={styles.deleteBtn} onClick={() => handleDelete(emp._id)}>🗑 Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { padding:'40px', maxWidth:'1100px', margin:'0 auto' },
  title: { fontSize:'28px', color:'#1e1e2f', marginBottom:'24px' },
  message: { padding:'10px', backgroundColor:'#f0fff4', borderRadius:'6px', marginBottom:'16px' },
  searchBar: { display:'flex', gap:'10px', marginBottom:'24px', flexWrap:'wrap' },
  input: { padding:'10px', borderRadius:'6px', border:'1px solid #ddd', fontSize:'14px', flex:1, minWidth:'160px' },
  btn: { padding:'10px 20px', backgroundColor:'#1e1e2f', color:'white', border:'none', borderRadius:'6px', cursor:'pointer' },
  clearBtn: { padding:'10px 20px', backgroundColor:'#718096', color:'white', border:'none', borderRadius:'6px', cursor:'pointer' },
  grid: { display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:'20px' },
  card: { backgroundColor:'white', padding:'24px', borderRadius:'12px', boxShadow:'0 2px 12px rgba(0,0,0,0.08)' },
  name: { fontSize:'18px', color:'#1e1e2f', marginBottom:'8px' },
  dept: { color:'#667eea', fontWeight:'bold', marginBottom:'8px' },
  scoreRow: { display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:'12px' },
  score: { fontSize:'20px', fontWeight:'bold' },
  actions: { display:'flex', gap:'8px', marginTop:'16px' },
  updateBtn: { flex:1, padding:'8px', backgroundColor:'#667eea', color:'white', border:'none', borderRadius:'6px', cursor:'pointer' },
  deleteBtn: { flex:1, padding:'8px', backgroundColor:'#e53e3e', color:'white', border:'none', borderRadius:'6px', cursor:'pointer' }
};

export default EmployeeList;