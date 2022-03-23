require("dotenv").config()
const connection = require("./config/database")
const express = require("express")
const app = express()
const User = require("./model/user")
const bcrypt = require("bcryptjs/dist/bcrypt")
const jsonwebtoken = require("jsonwebtoken")

app.use(express.json())
// Add headers before the routes are defined
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, POST, OPTIONS, PUT');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    res.setHeader('Content-Type', 'application/json');

    // Pass to next layer of middleware
    next();
});

app.get("/", (req, res) => {
    console.log("homepage")
})

// Register a new user
app.post("/register", async (req, res) => {
    try {

        // Get user input
        const {first_name, last_name, email, password} = req.body
        
        // Validate user input
        if(!(email && password && first_name && last_name)) {
            res.status(400).send("All input are required")
        }

        let oldUser = await User.getUserByEmail(email)

        if(oldUser != null) {
            return res.status(400).send("User already exist. Please login")
        } 

        // Encrypt user password
        let encryptedPasssword = await bcrypt.hash(password, 10)

        let id = await User.createUser(
            new User(
                null,
                first_name,
                last_name,
                email.toLowerCase(),
                encryptedPasssword,
                null
            )
        )

        let user = await User.getUserById(id)

        const token = jsonwebtoken.sign(
            { user_id: id, email},
            process.env.TOKEN_KEY, 
            {
                expiresIn: "2h"
            }
        )

        user.token = token
        User.updateUser(user)

        res.status(201).json(user)

    } catch (err) {
        console.log(err)
    }
})

// Login an existing user
app.post("/login", async (req, res) => {
    try {
        const {email, password} = req.body

        if (!(email && password)) {
            return res.status(400).send("All input are required")
        }

        const user = await User.getUserByEmail(email)
        if (user && (await bcrypt.compare(password, user.password))) {
            const token = jsonwebtoken.sign(
                {user_id: user.id, email},
                process.env.TOKEN_KEY,
                {
                    expiresIn: "30m"
                }
            )
            user.token = token
            User.updateUser(user)
            return res.status(200).json({token: token});
        }
        res.status(400).send("Invalid Credentials")       
    } catch(err) {
        console.log(err)
    }
})


const auth = require("./middleware/auth")

app.get("/welcome", auth, (req, res) => {
    res.status(200).send("Welcome")
})

module.exports = app