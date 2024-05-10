const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/user'); //user model 

router.post('/register', async (req, res) => {
    try {
        const { name, username, password } = req.body;

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.send({
                statusCode: 400,
                message: 'Username already exists',
            });
            // return res.status(400).json({ message: 'Username already exists' });
        }

        const newUser = new User({ name, username, password });
        await newUser.save();

        return res.send({
            statusCode: 201,
            message: 'User registered successfully'
        })

        // res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log("Login details", username, password);
        const user = await User.findOne({ username });
        console.log("user Details", user);
        if (!user) {
            return res.send({
                statusCode: 400,
                message: 'Invalid Credentials',
                data: []
            })
            // return res.status(401).json({ message: 'Invalid credentials' }); old
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.send({
                statusCode: 400,
                message: 'Invalid Credentials',
                data: []
            })

            // return res.status(401).json({ message: 'Invalid credentials' }); old
        }
        return res.send({
            statusCode: 200,
            message: 'Login Successful',
            data: user
        })
        // res.status(200).json({ message: 'Login successful' }); old
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
