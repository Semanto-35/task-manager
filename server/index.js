const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, } = require('mongodb');
const jwt = require('jsonwebtoken');


// Express App and Middleware Setup
const port = process.env.PORT || 5000;
const app = express();
const cookieParser = require('cookie-parser');

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://paw-haven-39454.web.app",
    "https://paw-haven-39454.firebaseapp.com",
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Origin",
    "X-Requested-With",
    "Accept",
    "x-client-key",
    "x-client-token",
    "x-client-secret",
    "Authorization",
  ],
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());


// MongoDB Database Connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gvke0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {







    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




// Server Start Routes
app.get('/', (req, res) => {
  res.send("Task Management API is running...");
});

app.listen(port, () => {
  console.log(`Task Management App Server running on port ${port}`);
});