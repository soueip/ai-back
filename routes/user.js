const express = require('express');
const router = express.Router();
const User = require("../models/User");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { registerRules, loginRules, validation } = require("../middleware/validator");
const isAuth = require('../middleware/passport');

// Register User

router.post("/register", registerRules(), validation, async (req, res) => {
    const { name, lastName, email, password, companywebsite, phone } = req.body;
    try {
        // Check if the email is already in the database
        const emailExist = await User.findOne({ email });
        if (emailExist) {
            return res.status(400).send({ error: "Email already exists" });
        }
        // Check if the company website is already in the database
        const companywebsiteExist = await User.findOne({ companywebsite });
        if (companywebsiteExist) {
            return res.status(400).send({ error: "Company website already exists" });
        }
        // Check if the phone number is already in the database
        const phoneExist = await User.findOne({ phone });
        if (phoneExist) {
            return res.status(400).send({ error: "Phone number already exists" });
        }
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        // Create a new user
        const newUser = new User({
            name,
            lastName,
            email,
            password: hash,
            companywebsite,
            phone,
        });
        // Save the user
        await newUser.save();

        // Generate token
        const token = jwt.sign({ _id: newUser._id }, process.env.SECRET_KEY);

        // Send response with user data and token
        res.status(200).send({ user :newUser, token: `Bearer ${token}`, msg: "User is registered and logged in" });
    } catch (err) {
        console.error("Error saving user:", err);
        return res.status(500).send({ error: "An error occurred while saving the user", fullError: err });
    }
});

// Login User
router.post('/login', loginRules(), validation, async (req, res) => {
    const { email, password } = req.body;
    try {
        // Find if the user exists
        const searchedUser = await User.findOne({ email });

        // If the email does not exist
        if (!searchedUser) {
            return res.status(400).send({ msg: "Invalid email or password"  });
        }

        // Check if the passwords match
        const match = await bcrypt.compare(password, searchedUser.password);

        if (!match) {
            return res.status(400).send({ msg: "Invalid email or password"  });
        }

        // Create a token
        const payload = {
            _id: searchedUser._id,
            name: searchedUser.name,
        };
        const token = await jwt.sign(payload, process.env.SECRET_KEY, {
            expiresIn: 3600,
        });

        // Send the user
        res.status(200).send({ user: searchedUser, msg: "Success", token: `Bearer ${token}` });
    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).send({ msg: "Internal server error", error: error.message });
    }
});



// Get Current User
router.get('/current', isAuth(), (req, res) => {
    res.status(200).send({ user: req.user });
});

// Get All Users
router.get("/", async (req, res) => {
    try {
        const result = await User.find();
        res.send({ users: result, msg: "Users" });
    } catch (error) {
        console.error("Error getting users:", error);
        return res.status(500).send({ error: "An error occurred while getting users", fullError: error });
    }
});

// Delete User
router.delete("/:id", async (req, res) => {
    try {
        const result = await User.deleteOne({ _id: req.params.id });
        res.send({ result, msg: "User deleted" });
    } catch (error) {
        console.error("Error deleting user:", error);
        return res.status(500).send({ error: "An error occurred while deleting user", fullError: error });
    }
});

// Update User
router.put("/:id", async (req, res) => {
    try {
        const result = await User.updateOne({ _id: req.params.id }, { $set: { ...req.body } });
        res.send({ result, msg: "User updated" });
    } catch (error) {     
        console.error("Error updating user:", error);
        return res.status(500).send({ error: "An error occurred while updating user", fullError: error });
    }
});

module.exports = router;
