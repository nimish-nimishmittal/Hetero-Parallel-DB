const express = require('express');
const path = require('path');
const session = require('express-session');
const authRoutes = require('./routes/auth');
const { Product, pool, connectMongoDB, mysqlPool } = require('./config/db'); // Import MySQL pool

const app = express();
const port = 3000;

// Connect to MongoDB
connectMongoDB(); // Call the function to connect to MongoDB

// Session middleware
app.use(session({
    secret: 'merasecret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

// Routes
app.use('/auth', authRoutes);

// Middleware to check if the user is authenticated
function checkAuthentication(req, res, next) {
    if (req.session.username) {
        next(); // User is authenticated
    } else {
        res.redirect('/signin.html'); // Redirect to sign-in if not authenticated
    }
}

// Route to serve products.html
app.get('/products', checkAuthentication, (req, res) => {
    console.log('User session:', req.session); // Log the session info
    res.sendFile(path.join(__dirname, '../public/products.html'));
});

// Route to fetch products from MongoDB
app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find(); // Fetch all products from MongoDB
        console.log('Fetched Products:', products); // Log fetched products
        res.json(products); // Send the products as JSON
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching products');
    }
});

// Route to handle review submission (using MySQL promises)
app.post('/api/review', async (req, res) => {
    const { review, Pid } = req.body;
    const Uid = req.session.uid; // Get Uid from session

    if (!Uid) {
        return res.status(401).json({ message: 'User not authenticated' });
    }

    try {
        // Use .promise().query() to execute the MySQL query as a promise
        const [result] = await mysqlPool.query(
            'INSERT INTO reviews (Uid, Pid, review) VALUES (?, ?, ?)',
            [Uid, Pid, review]
        );

        res.status(201).json({ message: 'Review submitted successfully' });
    } catch (err) {
        console.error('MySQL Error:', err.message);
        res.status(500).send('Server error');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
