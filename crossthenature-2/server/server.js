// Get dependencies
const express = require("express");
const path = require("path");
const http = require("http");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const helmet = require("helmet");
const config = require("./config/index");

// Get our API routes
const usersApi = require("./routes/api/users");
const eventsApi = require("./routes/api/events");
const newsApi = require("./routes/api/news");

const app = express();

app.use(
  helmet({
    contentSecurityPolicy: false,
  }),
);

/* Mongoose setup */
console.log("MongoDB", process.env.CONNECTIONSTRING);
console.log("Secret", process.env.SECRET);
console.log("Mail", process.env.MAILCONNECTIONSTRING);

mongoose.set("strictQuery", false);
mongoose.connect(process.env.CONNECTIONSTRING || config.database.local);

var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => console.log("Successfully connected to MongoDB"));

// Parsers for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Point static path to dist
app.use(express.static(path.join(__dirname, "dist")));

// Set our api routes
app.use("/api/users", usersApi);
app.use("/api/events", eventsApi);
app.use("/api/news", newsApi);

// Catch all other routes and return the index file
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/dist/index.html"));
});

/**
 * Get port from environment and store in Express.
 */
const port = process.env.PORT || "3000";
app.set("port", port);

/**
 * Create HTTP server.
 */
const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port, () => console.log(`API running on localhost:${port}`));