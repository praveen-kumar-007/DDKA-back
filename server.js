const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db.js');
const instRoutes = require('./routes/instRoutes');
const { errorHandler } = require('./middleware/errorMiddleware');

dotenv.config();
connectDB();

const app = express();

// --- UPDATED CORS CONFIGURATION ---
app.use(cors({
    origin: process.env.FRONTEND_URL, // Only allows your React app to connect
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
// ----------------------------------

app.use(express.json());

// Routes
app.use('/api/institutions', instRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});