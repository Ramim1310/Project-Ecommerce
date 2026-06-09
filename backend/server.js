require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRoutes = require("./route/authRoutes");
const productRoutes = require('./src/modules/products/product.route');
const adminRoutes = require('./src/modules/admin/admin.route');
const orderRoutes = require('./src/modules/order/order.route');
const app = express();

// Middlewares
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174']
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/orders', orderRoutes);

app.get('/', (req, res) => {
    res.send('Nexus Portal API is running...');
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('Global Error Handler caught:', err);
    
    // Handle Prisma specific errors
    if (err.code === 'P2002') {
        return res.status(409).json({ success: false, message: 'Resource already exists.' });
    }

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).json({ success: false, message });
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