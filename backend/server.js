const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/employees', require('./routes/employeeRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));

app.get('/', (req, res) => res.json({ message: 'API is running...' }));

app.use(errorHandler);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log('Server running on port 5001'));
