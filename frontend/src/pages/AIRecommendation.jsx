import { useState, useEffect } from 'react';
import API from '../api/axios';

const AIRecommendation = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [recommendation, setRecommendation] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('single');

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const { data } = await API.get('/employees');
        setEmployees(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchEmployees();
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    setRecommendation('');
    try {
      const body = mode === 'all' ? { allEmployees: true } : { employeeId: selectedId };
      const { data } = await API.post('/ai/recommend', body);
      setRecommendation(data.recommendation);
    } catch (err) {
      setRecommendation('❌ Error: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🤖 AI Recommendations</h2>

      <div style={styles.card}>
        <div style={styles.modeRow}>
          <button
            style={{ ...styles.modeBtn, ...(mode === 'single' ? styles.active : {}) }}
            onClick={() => setMode('single')}>
            Single Employee
          </button>
          <button
            style={{ ...styles.modeBtn, ...(mode === 'all' ? styles.active : {}) }}
            onClick={() => setMode('all')}>
            All Employees Ranking
          </button>
        </div>

        {mode === 'single' && (
          <select style={styles.select} value={selectedId} onChange={e => setSelectedId(e.target.value)}>
            <option value="">-- Select Employee --</option>
            {employees.map(emp => (
              <option key={emp._id} value={emp._id}>
                {emp.name} — {emp.department} (Score: {emp.performanceScore})
              </option>
            ))}
          </select>
        )}

        <button
          style={styles.btn}
          onClick={handleSubmit}
          disabled={loading || (mode === 'single' && !selectedId)}>
          {loading ? '⏳ Generating...' : '✨ Generate Recommendation'}
        </button>
      </div>

      {recommendation && (
        <div style={styles.result}>
          <h3 style={styles.resultTitle}>📋 AI Analysis</h3>
          <pre style={styles.pre}>{recommendation}</pre>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { padding:'40px', maxWidth:'800px', margin:'0 auto' },
  title: { fontSize:'28px', color:'#1e1e2f', marginBottom:'24px' },
  card: { backgroundColor:'white', padding:'24px', borderRadius:'12px', boxShadow:'0 2px 12px rgba(0,0,0,0.08)', marginBottom:'24px' },
  modeRow: { display:'flex', gap:'12px', marginBottom:'20px' },
  modeBtn: { flex:1, padding:'10px', border:'2px solid #ddd', borderRadius:'8px', cursor:'pointer', backgroundColor:'white', fontSize:'14px' },
  active: { borderColor:'#667eea', backgroundColor:'#ebf4ff', color:'#667eea', fontWeight:'bold' },
  select: { width:'100%', padding:'10px', borderRadius:'6px', border:'1px solid #ddd', marginBottom:'16px', fontSize:'14px' },
  btn: { width:'100%', padding:'12px', backgroundColor:'#667eea', color:'white', border:'none', borderRadius:'8px', cursor:'pointer', fontSize:'16px' },
  result: { backgroundColor:'white', padding:'24px', borderRadius:'12px', boxShadow:'0 2px 12px rgba(0,0,0,0.08)' },
  resultTitle: { color:'#1e1e2f', marginBottom:'16px' },
  pre: { whiteSpace:'pre-wrap', wordBreak:'break-word', fontSize:'14px', lineHeight:'1.7', color:'#333' }
};

export default AIRecommendation;