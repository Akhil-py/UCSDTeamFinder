const express = require('express');
const User = require('../models/users');
const League = require('../models/league');
const Valorant = require('../models/valorant');
const Dota = require('../models/dota');
const bcrypt = require('bcrypt');

const router = express.Router();

router.post('/users', async (req, res) => {
    const user = req.body.registerInfo;
    const { username, email, password, discord, college } = user;

    if (!username || !email || !password || !discord || !college) {
        res.status(400).json({ error: 'Invalid Input!' });
    } else {
        try {
            const existingUser = await User.findOne({
                $or: [{ username }, { email }, { discord }],
            });

            if (existingUser) {
                // Duplicate username, email, or discord found
                res.status(400).json({ status: 'error', error: 'Duplicate username, email, or discord' });
            } else {
                const newUser = await User.create(user);
                res.status(200).json({ status: 'ok', userId: newUser._id });
            }
        } catch (err) {
            res.status(500).json({ status: 'error', error: 'Server error' });
        }
    }
});

router.post('/users/league-of-legends', async (req, res) => {
    try {
        const { user_id, username, rank, role, region } = req.body;

        // This checks if this user has already made a league of legends data card
        const existingLeagueOfLegendsData = await League.findOne({ userid: user_id });
        if (existingLeagueOfLegendsData) {
        return res.status(400).json({ status: 'error', error: 'League of Legends data already exists for the user!' });
        }

        const leagueOfLegendsData = {
            userid: user_id,
            lol_username: username,
            rank: rank,
            role: role,
            region: region
        };
        console.log(leagueOfLegendsData)
        const newLeagueOfLegendsData = await League.create(leagueOfLegendsData);
        res.status(200).json({ status: 'Successfully created'});
    } catch (err) {
        console.log(err)
        res.status(400).json({ status: 'error', error: 'Failed to create League of Legends data!' });
    }
  });

router.post('/users/valorant', async (req, res) => {
    try {
        const { user_id, username, rank, role, region} = req.body;

        // Check if Valorant data already exists for the given user_id
        const existingValorantData = await Valorant.findOne({ userid: user_id });
        if (existingValorantData) {
            return res.status(400).json({ status: 'error', error: 'Valorant data already exists for the user!' });
        }

        const valorantData = {
            userid: user_id,
            val_username: username,
            rank: rank,
            role: role,
            region: region
        };
        console.log(valorantData)
        const newValorantData = await Valorant.create(valorantData);
        res.status(200).json({ status: 'Successfully created'});
    } catch (err) {
        console.log(err)
        res.status(400).json({ status: 'error', error: 'Failed to create Valorant data!' });
    }
});
router.post('/users/dota', async (req, res) => {
    try {
        const { user_id, username, rank, role, region } = req.body;

        // Check if Dota data already exists for the given user_id
        const existingDotaData = await Dota.findOne({ userid: user_id });
        if (existingDotaData) {
            return res.status(400).json({ status: 'error', error: 'Dota data already exists for the user!' });
        }

        const dotaData = {
            userid: user_id,
            dota_username: username,
            rank: rank,
            role: role,
            region: region
        };
        console.log(dotaData)
        const newDotaData = await Dota.create(dotaData);
        res.status(200).json({ status: 'Successfully created'});
    } catch (err) {
        console.log(err)
        res.status(400).json({ status: 'error', error: 'Failed to create Dota data!' });
    }
});

// Function to compare passwords for login
async function comparePasswords(password, hashedPassword) {
    try {
        const isMatch = await bcrypt.compare(password, hashedPassword);
        return isMatch;
    } catch (error) {
        throw error;
    }
}

// Login endpoint
router.post('/login', async (req, res) => {
    const { username, password } = req.body.loginInfo;

    try {
        const user = await User.findOne({ username });
        //console.log(user)
        if (!user) {
            return res.json({ success: false, message: 'Invalid credentials' });
        }

        const isMatch = await comparePasswords(password, user.password);

        if (isMatch) {
            // Passwords match, user is authenticated
            return res.json({ success: true, message: 'Login successful', userId: user._id});
        } else {
            // Passwords don't match
            return res.json({ success: false, message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
});

router.get('/users', async (req, res) => {
    try {
        const { user_id } = req.query;
  
        // Retrieve the User data
        const user = await User.findById(user_id);
        if (!user) {
            return res.status(404).json({ status: 'error', error: 'User not found!' });
        }
    
        // Retrieve the League of Legends data for the user
        const leagueOfLegendsData = await League.findOne({ userid: user_id });

        // Retrieve the Valorant data for the user
        const valorantData = await Valorant.findOne({ userid: user_id });

        // Retrieve the Valorant data for the user
        const dotaData = await Dota.findOne({ userid: user_id });
    
        // Prepare the response JSON
        const userData = {
            username: user.username,
            email: user.email,
            discord: user.discord,
            college: user.college,
            leagueOfLegends: leagueOfLegendsData,
            valorant: valorantData,
            dota: dotaData
        };
    
        res.status(200).json({ status: 'ok', userData });
        } catch (err) {
        console.log(err);
        res.status(500).json({ status: 'error', error: 'Failed to retrieve user data!' });
    }
  });

router.get('/players', async (req, res) => {
    try {
        const { game, role, rank, region } = req.query;
        let query = {};
    
        query = {
        role: role,
        rank: rank,
        region: region
        }
        if (game === 'league-of-legends') {
            const players = await League.find(query).select('user_id lol_username');
            res.status(200).json({ status: 'ok', players });
        }
        else if (game == 'valorant'){
            const players = await Valorant.find(query).select('user_id val_username');
            res.status(200).json({ status: 'ok', players });
        } else if (game == 'dota'){
            const players = await Dota.find(query).select('user_id dota_username');
            res.status(200).json({ status: 'ok', players });
        } else {
            return res.status(400).json({ status: 'error', error: 'Invalid game specified!' });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: 'error', error: 'Failed to retrieve players!' });
    }
  });
  

module.exports = router;