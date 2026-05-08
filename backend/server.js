const express = require("express");
const cors = require("cors");
const authRoutes = require("./route/authRoutes");
require("dotenv").config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.send('Nexus Portal API is running...');
});

const port = process.env.PORT || 5001;
app.listen(port, () => {
    console.log(` Server ready at http://localhost:${port}\n     Auth endpoints: http://localhost:${port}/api/auth`);
});

// Prevent a single bad request from crashing the whole server
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});