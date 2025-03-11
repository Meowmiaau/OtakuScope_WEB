const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { getDBConnection} = require('../config/db'); // Import the DB connection function
const express = require('express');

// Generate JWT
const generateToken = (userId) => {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined in the environment variables');
    }
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '111h' });
};

// Signup Controller
const signup = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const connection = await getDBConnection();
        if (!username || !email || !password || password.length < 8) {
            return res.status(400).json({ error: 'Invalid input or password too short' });
        }

        // Check if the email already exists
        const [emailRows] = await connection.query(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );

        if (emailRows.length > 0) {
            return res.status(400).json({ error: 'Email is already registered' });
        }

        // Check if the username already exists
        const [usernameRows] = await connection.query(
            'SELECT * FROM users WHERE username = ?',
            [username]
        );

        if (usernameRows.length > 0) {
            return res.status(400).json({ error: 'Username is already taken' });
        }

        // Hash the password and insert the user into the database
        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await connection.query(
            'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
            [username, email, hashedPassword]
        );

        // Generate a token for the new user
        const userId = result.insertId; // Get the ID of the newly created user
        const token = generateToken(userId);

        res.status(201).json({ message: 'User registered successfully', token });
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


// Login Controller
const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const connection = await getDBConnection();
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }
         // Get the connection instance
        const [rows] = await connection.execute(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );
        if(rows.length === 0) {
            return res.status(404).json({message : "Email not found"})
        }
        const user = rows[0]; // Assuming rows is an array of users

        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const token = generateToken(user.id);
        res.json({ message: 'Login successful', token, username: user.username  });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = { signup, login };
