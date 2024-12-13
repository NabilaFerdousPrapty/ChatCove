import dotenv from 'dotenv';
dotenv.config();
import express, { json } from 'express';
const app = express();
const port = process.env.PORT || 5000;
import cors from 'cors';
app.use(cors({
    origin: ["http://localhost:5173",
        "http://localhost:5174",
        




    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
}));
///middleware
app.use(json());
app.use(cors());


import { MongoClient, ServerApiVersion } from 'mongodb';
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.pflyccd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
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
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();
        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });

        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Chatcove server is running');
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
app.post('/addUsers', async (req, res) => {
    const newUser = req.body;
    console.log(newUser);
    const query = { email: newUser.email };
    const existingUser = await userCollections.findOne(query);

    if (existingUser) {
        res.send({ message: "User already exists", insertedId: null });
        return;
    }

    const result = await userCollections.insertOne(newUser);
    res.send(result);
});
app.get('/users', async (req, res) => {
    const cursor = userCollections.find({});
    const results = await cursor.toArray();
    res.send(results);
}
);

app.patch('/users/block/:email', async (req, res) => {
    const email = req.params.email;

    // Find the user by email to determine their role
    const user = await userCollections.findOne({ email: email });

    if (!user) {
        return res.status(404).send({ message: 'User not found' });
    }


    if (user.role === 'member') {
        const update = { $set: { status: 'resticted' } };
        const result = await userCollections.updateOne({ email: email, role: 'member' }, update);
        return res.send(result); // Send result for member update
    } else if (user.role === 'mentor') {
        const update = { $set: { status: 'pending' } };
        const result = await userCollections.updateOne({ email: email, role: 'mentor' }, update);
        return res.send(result); // Send result for mentor update
    } else {
        return res.status(400).send({ message: 'Invalid role for this operation' });
    }
});

