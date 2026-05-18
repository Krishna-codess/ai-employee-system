import { useState } from 'react';
import API from '../api/axios';

const AddEmployee = () => {
  const [form, setForm] = useState({
    name: '', email: '', department: '', skills: '', performanceScore: '', experience: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');
    try {
      const payload = {
        ...form,
        skills: form.skills.split(',').map(s => s.trim()),
        performanceScore: Number(form.performanceScore),
        experience: Number(form.experience)
      };
      await API.post('/employees', payload);
      setMessage('✅ Employee added successfully!');
      setForm({ name: '', email: '', department: '', skills: '', performanceScore: '', experience: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add employee');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>➕ Add New Employee</h2>
        {message && <p style={styles.success}>{message}</p>}
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <input style={styles.input} placeholder="Full Name"
            value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
          <input style={styles.input} type="email" placeholder="Email"
            value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
          <input style={styles.input} placeholder="Department"
            value={form.department} onChange={e => setForm({...form, department: e.target.value})} required />
          <input style={styles.input} placeholder="Skills (comma separated: React, Node.js)"
            value={form.skills} onChange={e => setForm({...form, skills: e.target.value})} required />
          <input style={styles.input} type="number" placeholder="Performance Score (0-100)"
            value={form.performanceScore} onChange={e => setForm({...form, performanceScore: e.target.value})} required />
          <input style={styles.input} type="number" placeholder="Years of Experience"
            value={form.experience} onChange={e => setForm({...form, experience: e.target.value})} required />
          <button style={styles.btn} type="submit" disabled={loading}>
            {loading ? 'Adding...' : 'Add Employee'}
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: { minHeight:'100vh', display:'flex', justifyContent:'center', alignItems:'center', backgroundColor:'#f0f2f5' },
  card: { backgroundColor:'white', padding:'40px', borderRadius:'12px', width:'420px', boxShadow:'0 4px 20px rgba(0,0,0,0.1)' },
  title: { textAlign:'center', marginBottom:'24px', color:'#1e1e2f' },
  input: { width:'100%', padding:'10px', marginBottom:'14px', borderRadius:'6px', border:'1px solid #ddd', boxSizing:'border-box', fontSize:'14px' },
  btn: { width:'100%', padding:'10px', backgroundColor:'#1e1e2f', color:'white', border:'none', borderRadius:'6px', cursor:'pointer', fontSize:'16px' },
  success: { color:'green', marginBottom:'12px', textAlign:'center' },
  error: { color:'red', marginBottom:'12px', textAlign:'center' }
};

export default AddEmployee;