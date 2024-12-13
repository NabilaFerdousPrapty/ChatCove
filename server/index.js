import dotenv from 'dotenv';
dotenv.config();
import express, { json } from 'express';
import cors from 'cors';
import { Server } from 'socket.io';
import http from 'http';
import { MongoClient, ServerApiVersion } from 'mongodb';
import e from 'express';

const app = express();
const port = process.env.PORT || 5000;
const IO_PORT = process.env.IO_PORT || 3000;

// CORS configuration to allow multiple origins
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
}));

// Create HTTP server and set up socket.io
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:3000", "http://localhost:3001"],
        credentials: true,
    },
});

// Middleware
app.use(json());

// MongoDB connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.pflyccd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
const CatalogDB = client.db("ChatCove");
const userCollections = CatalogDB.collection("Users");

async function run() {
    try {
        // Connect the MongoDB client
        await client.connect();
        console.log("Connected to MongoDB!");
    } catch (error) {
        console.error("Failed to connect to MongoDB:", error);
    }
}

// Routes
app.get('/', (req, res) => {
    res.send('Chatcove server is running');
});

// Add user to the database
app.post('/addUsers', async (req, res) => {
    const newUser = req.body;
    const query = { email: newUser.email };
    const existingUser = await userCollections.findOne(query);

    if (existingUser) {
        return res.send({ message: "User already exists", insertedId: null });
    }

    const result = await userCollections.insertOne(newUser);
    res.send(result);
});
app.patch('/users/update/:email', async (req, res) => {
    const email = req.params.email;

    try {
        // Find the user by email
        const user = await userCollections.findOne({ email: email });
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        // Exclude _id from the update payload
        const { _id, ...updateFields } = req.body;

        // Perform the update
        const update = { $set: updateFields };
        const result = await userCollections.updateOne({ email: email }, update);

        res.send(result);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).send({ message: 'Internal server error' });
    }
});

app.delete('/users/delete/:email', async (req, res) => {
    const email = req.params.email;
    const user = await userCollections.findOne({
        email: email
    });
    if (!user) {
        return res.status(404).send({
            message: 'User not found'
        });
    }
    const result = await userCollections.deleteOne({
        email: email
    });
    res.send(result);
}
);
// Get all users
app.get('/users', async (req, res) => {
    const cursor = userCollections.find({});
    const results = await cursor.toArray();
    res.send(results);
});

// Block or restrict users based on role
app.patch('/users/toggleStatus/:email', async (req, res) => {
    const email = req.params.email;

    try {
        const user = await userCollections.findOne({ email: email });

        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        if (user.role === 'admin') {
            return res.status(403).send({ message: 'Cannot block admin user' });
        }


        // Toggle status between 'active' and 'restricted'
        const newStatus = user.status === 'active' ? 'restricted' : 'active';

        // Update only the status field
        const result = await userCollections.updateOne(
            { email: email },
            { $set: { status: newStatus } }
        );

        return res.send(result);
    } catch (error) {
        console.error('Error toggling user status:', error);
        return res.status(500).send({ message: 'Internal server error' });
    }
});

//check if user is admin
app.get('/users/admin/:email', async (req, res) => {
    const email = req.params.email;
    const user = await userCollections.findOne({ email: email });
    if (!user) {
        return res.status(404).send({ message: 'User not found' });
    }
    return res.send({ admin: user.role === 'admin' });
});
// Track active users in a map where userId is the key and socket.id is the value
let activeUsers = new Map();

// io.on("connection", (socket) => {
//     console.log("a user connected:", socket.id);

//     // Emit the current active users list to the newly connected socket once
//     socket.emit("active_users", Array.from(activeUsers.keys()));

//     // Handle user_connected event from frontend
//     socket.on("user_connected", (data) => {
//         // Check if the user is already in the active users list to avoid duplicates
//         if (!activeUsers.has(data.userId)) {
//             activeUsers.set(data.userId, socket.id);

//             // Emit the updated list of active users to all clients
//             io.emit("active_users", Array.from(activeUsers.keys()));

//             console.log(`User ${data.userId} connected with socket ID: ${socket.id}`);
//         } else {
//             console.log(`User ${data.userId} already in active users`);
//         }
//     });

//     // Handle user disconnect event
//     socket.on("disconnect", () => {
//         // Remove the user from active users when they disconnect
//         activeUsers.forEach((value, key) => {
//             if (value === socket.id) {
//                 activeUsers.delete(key);
//                 console.log(`User ${key} disconnected`);
//             }
//         });

//         // Emit the updated list of active users to all clients
//         io.emit("active_users", Array.from(activeUsers.keys()));
//     });
// });

// Start HTTP server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// Start Socket.IO server
// server.listen(IO_PORT, () => {
//     console.log(`Socket.IO server is running on port ${IO_PORT}`);
// }).on('error', (err) => {
//     console.error('Socket.IO server error:', err);
// });
