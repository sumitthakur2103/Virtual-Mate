import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io"; // Keep it only if you need socket.io functionality
import mongoose from "mongoose";
import cors from "cors";
import { connectToSocket } from "./controllers/socketManager.js";

//from learning
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';


const __dirname = dirname(fileURLToPath(import.meta.url));

/////////////////////////

import userRoutes from "./routes/users.routes.js";
const app = express();

const server = createServer(app);

const io = connectToSocket(server);


app.set("port", (process.env.PORT || 8080));
app.use(cors());
app.use(express.json({ limit: "40kb" }));
app.use(express.urlencoded({ limit: "40kb", extended: true }))

app.use("/api/v1/users", userRoutes);

///Learning
app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'index.html'));
});

// Serve static files from the frontend build directory
app.use(express.static(join(__dirname, '../../frontend/dist')));

// Fallback route to serve index.html for unknown routes
app.get('*', (req, res) => {
    res.sendFile(join(__dirname, '../../frontend/dist/index.html'));
});

app.get("/home", (req, res) => {
    return res.json({ "hello": "World" });
});


io.on('connection', (socket) => {
    socket.on('chat message', (msg) => {
        console.log('message: ' + msg);
    });
});


const start = async () => {
    app.set("mongo_user")
    const connectionDb = await mongoose.connect("mongodb+srv://sumitthakur8511:N8Aztv4wfpv2xuSP@cluster0.rnqhw.mongodb.net/");

    console.log(`MONGO Connected DB Host : ${connectionDb.connection.host}`)
    server.listen(app.get("port"), () => {
        console.log("LISTENING ON PORT 8080");
    });
};

start();

