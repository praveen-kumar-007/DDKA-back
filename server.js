const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db.js');
const instRoutes = require('./routes/instRoutes');
const { errorHandler } = require('./middleware/errorMiddleware');

dotenv.config();
connectDB();

const app = express();

// --- FIXED CORS CONFIGURATION ---
const allowedOrigins = [
    'http://localhost:5173',          // Local Development (Vite)
    'https://ddka.vercel.app',        // Your live frontend on Vercel
    process.env.FRONTEND_URL          // Optional URL from your .env
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('CORS Policy: This origin is not allowed by DDKA Server'), false);
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
// ----------------------------------

app.use(express.json());

// Health check to verify server is alive
app.get('/', (req, res) => res.send('DDKA Backend is Online'));

// Routes
app.use('/api/institutions', instRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});