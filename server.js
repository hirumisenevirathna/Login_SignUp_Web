const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./models/userSchema');

const SECRET_KEY = 'secretkey'

const app = express();

const dbURI = 'mongodb+srv://Anuda:Anuda14@cluster30.uuhl8k3.mongodb.net/UsersDB?retryWrites=true&w=majority&appName=Cluster30';

mongoose
.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
    app.listen(3001, () => {
        console.log('Server is connected to port 3001 and connected to MongoDB');
    });
})
.catch((err) => {
    console.error('Error connecting to MongoDB:', err);
});

app.use(bodyParser.json());
app.use(cors());

app.post('/register', async (req, res) => {
    try {
        const { email, username, password } = req.body;
        if (!email || !username || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ email, username, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Error during user registration:', error);
        res.status(500).json({ error: 'Error signing up' });
    }
});

app.get('/register', async(req, res) => {
    try{
        const users = await User.find()
        res.status(201).json(users)
    }catch(error){
        res.status(500).json({error: 'Unable to get users'})
    }
})

app.post('/login', async(req, res) => {
    try{
        const {username, password} = req.body
        const user = await User.findOne({ username })
        if(!user){
            return res.status(401).json({error: 'Invalid credentials'})
        }
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if(!isPasswordValid){
            return res.status(401).json({error: 'Invalid credentials'}) 
        }
        const token = jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: '1hr'})
        res.json({ message: 'Login successfu'})
    }catch(error){
        res.status(500).json({ error: 'Error logging in' })
    }
})

module.exports = app;
