require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const connection = require("./config/config");
const userRoutes = require('./routes/users');
const authRoutes = require("./routes/auth");
const port = process.env.PORT

// database connection
connection();

// middleware
app.use(express.json());
app.use(cors());

// routes
app.use(userRoutes);
app.use(authRoutes);


app.get('/', (req, res) => res.send("hello world"));
app.listen(port, console.log(`Listening on port ${port}...`));