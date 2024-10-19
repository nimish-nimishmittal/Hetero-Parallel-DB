const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');

// Sign-up Route
router.post('/signup', async (req, res) => {
    const { Uname, Umobile, Uemail, Upassword } = req.body;

    try {
        const userExists = await pool.query(
            'SELECT * FROM users WHERE Uemail = $1',
            [Uemail]
        );

        if (userExists.rows.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const newUser = await pool.query(
            'INSERT INTO users (Uname, Umobile, Uemail, Upassword) VALUES ($1, $2, $3, $4) RETURNING *',
            [Uname, Umobile, Uemail, Upassword]
        );

        res.status(201).json({ message: 'User created successfully', user: newUser.rows[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Sign-in Route
router.post('/signin', async (req, res) => {
    const { Uemail, Upassword } = req.body;

    try {
        const user = await pool.query(
            'SELECT * FROM users WHERE uemail = $1 AND upassword = $2',
            [Uemail, Upassword]
        );

        if (user.rows.length === 0) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Store the username in session
        req.session.username = user.rows[0].uname; // Store username in the session
        req.session.uid = user.rows[0].uid;
        console.log('User signed in:', req.session.username); // Log the signed-in user
        console.log('User id who signed in:', req.session.uid);

        return res.json({ message: 'Sign in successful', redirectUrl: '/products.html' }); // Provide redirect URL in JSON
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Logout Route
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).json({ message: 'Error logging out' });
        }

        // Clear the cookie and redirect to sign-in page
        res.clearCookie('connect.sid'); // This clears the session cookie
        res.json({ message: 'Logged out successfully', redirectUrl: '/signin.html' });
    });
});


module.exports = router;
