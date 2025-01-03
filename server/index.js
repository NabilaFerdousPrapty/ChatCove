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
const chatCollections = CatalogDB.collection("Chats");

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

//search a user by name or email 
app.get('/users/search/:name', async (req, res) => {
    try {
        const name = req.params.name;
        const query = {
            $or: [
                { name: { $regex: name, $options: 'i' } },
                { email: { $regex: name, $options: 'i' } }
            ]
        }
        const results = await userCollections.find(query).toArray();
        if (results.length === 0) {
            return res.status(404).send({ message: 'No users found.' });
        }
        res.send(results);
    } catch (error) {
        res.status(500).send({ error: 'Internal Server Error', details: error.message });
    }
});
//chat routes
//access all chats of a user
app.get('/chats/:email', async (req, res) => {
    const email = req.params.email;
    const query = { $or: [{ sender: email }, { receiver: email }] };
    const chats = await chatCollections.find(query).toArray();
    res.send(chats);
});
//access all chats between two users
app.get('/chats/:sender/:receiver', async (req, res) => {
    const sender = req.params.sender;
    const receiver = req.params.receiver;
    const query = {
        $or: [
            { sender: sender, receiver: receiver },
            { sender: receiver, receiver: sender }
        ]
    };
    const chats = await chatCollections.find(query).toArray();
    res.send(chats);
});
//send a message to a user
app.post('/chats', async (req, res) => {
    const newChat = req.body;
    const result = await chatCollections.insertOne(newChat);
    res.send(result);
});

app.get("/chats/:userId/:receiverId", async (req, res) => {
    const { userId, receiverId } = req.params;
    try {
        const messages = await chatCollections
            .find({
                $or: [
                    { senderId: userId, receiverId },
                    { senderId: receiverId, receiverId: userId },
                ],
            })
            .sort({ timestamp: 1 })
            .toArray();

        res.json(messages);
    } catch (err) {
        console.error("Failed to fetch chat history:", err);
        res.status(500).send("Internal Server Error");
    }
});

let activeUsers = []; // Array to store active users

io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);

    // Handle user login or re-connection
    socket.on('login', (user) => {
        const existingUser = activeUsers.find(u => u.uid === user.uid);

        if (!existingUser) {
            // User is new, add to activeUsers
            activeUsers.push({ ...user, socketId: socket.id });
            console.log(`User logged in: ${user.uid}`);
        } else {
            // User is reconnecting, update socketId
            existingUser.socketId = socket.id;
            console.log(`User reconnected: ${user.uid}`);
        }

        // Emit active users list to all clients
        io.emit('activeUsers', activeUsers);
    });

    // Handle user logout
    socket.on('user_logged_out', (uid) => {
        activeUsers = activeUsers.filter(user => user.uid !== uid);
        io.emit('activeUsers', activeUsers);
        console.log(`User logged out: ${uid}`);
    });

  
  

    // Handle message sending
    socket.on("sendMessage", async (message) => {
        const { sender, receiver, content, fileURL } = message;

        // Create chat message
        const chatMessage = {
            sender,
            receiver,
            content,
            fileURL,
            timestamp: new Date(),
        };

        try {
            // Save the message to MongoDB (using emails instead of IDs)
            await chatCollections.insertOne(chatMessage);

            // Get the receiver's socket ID using their email
            const receiverSocket = activeUsers.find(user => user.email === receiver);

            // If the receiver is online, send the message to their socket
            if (receiverSocket) {
                io.to(receiverSocket.socketId).emit("receiveMessage", chatMessage);
            }

            // Acknowledge sender with the saved message
            socket.emit("receiveMessage", chatMessage);
            console.log("Message sent:", message);
        } catch (err) {
            console.error("Error saving message:", err);
        }
    });


    

    // Handle socket disconnection
    socket.on("disconnect", () => {
        activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
        io.emit("activeUsers", activeUsers);
        console.log("Socket disconnected:", socket.id);
    });

});

server.listen(IO_PORT, () => {
    console.log(`Socket server is running on port ${IO_PORT}`);
});

// Start HTTP server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

