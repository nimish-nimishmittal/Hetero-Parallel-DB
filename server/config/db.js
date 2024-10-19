const { Pool } = require('pg');
const mongoose = require('mongoose');
const mysql = require('mysql2/promise');

// PostgreSQL connection pool
const pool = new Pool({
    user: 'admin',
    host: '127.0.0.1',
    database: 'user_database',
    password: 'password',
    port: 5434,  // default port for PostgreSQL
});

// MongoDB connection
const connectMongoDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/productsDB');
        console.log('MongoDB connected');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1); // Exit process with failure
    }
};

// Define product schema and model
const productSchema = new mongoose.Schema({
    Pid: Number,
    Pname: String,
    Pphoto: String,
    Pprice: Number,
    Pdesc: String,
});

const Product = mongoose.model('Product', productSchema);

// MySQL connection pool
const mysqlPool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'reviewsdb',
    password: 'B#@w@+123',
    port: 3306, // MySQL default port
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Export all connections and models
module.exports = { Product, pool, connectMongoDB, mysqlPool };
