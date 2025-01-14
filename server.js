const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const authRoutes = require('./routes/authRoutes');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// CORS configuration
const corsOptions = {
  origin: 'http://localhost:5173', // Allow requests from this origin
  methods: ['GET', 'POST'], // Allow GET and POST requests
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow certain headers
};

// Middleware
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());

// Rate Limiting to prevent brute-force attacks
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15, // Limit each IP to 15 requests per window
  message: 'Too many requests from this IP, please try again later.',
});

app.get("/", (req, res)=>{
    res.send("Hello Express.js");
})

app.use('/api', limiter);


// Routes
app.use('/api/auth', authRoutes);

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server: http://localhost:${port}`);
});
