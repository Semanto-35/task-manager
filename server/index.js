const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId, Timestamp, } = require('mongodb');
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


// verifyToken
const verifyToken = async (req, res, next) => {
  const token = req.cookies?.token

  if (!token) {
    return res.status(401).send({ message: 'unauthorized access' })
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: 'unauthorized access' })
    }
    req.user = decoded
    next()
  })
}


async function run() {
  try {
    const db = client.db('task_manager')
    const usersCollection = db.collection('users')
    const tasksCollection = db.collection('tasks')



    // Generate jwt token
    app.post('/jwt', async (req, res) => {
      const email = req.body
      const token = jwt.sign(email, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '365d',
      })
      res
        .cookie('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        })
        .send({ success: true })
    });

    // Logout/clear cookie from browser
    app.get('/logout', async (req, res) => {
      try {
        res
          .clearCookie('token', {
            maxAge: 0,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
          })
          .send({ success: true })
      } catch (err) {
        res.status(500).send(err)
      }
    });


    // save a user in DB
    app.post('/users/:email', async (req, res) => {
      const email = req.params.email
      const query = { email }
      const user = req.body

      const isExist = await usersCollection.findOne(query)
      if (isExist) {
        return res.send(isExist)
      }
      const result = await usersCollection.insertOne({
        ...user,
        timestamp: Date.now(),
      })
      res.send(result);
    });


    // Add a new task
    app.post("/tasks", verifyToken, async (req, res) => {
      const { title, description, category } = req.body;
      const count = await tasksCollection.countDocuments();

      const newTask = { title, description, category, timestamp: Date.now(), order: count, userId: req.user.uid, }
      const result = await tasksCollection.insertOne(newTask)
      res.send(result);
    });


    // get all tasks by user
    app.get('/tasks', async (req, res) => {
      const result = await tasksCollection.find().toArray();
      res.send(result);
    });


    // delete a task by id
    app.delete('/tasks/:id',verifyToken, async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await tasksCollection.deleteOne(query);
      res.send(result);
    });


    // Update a task
    app.put("/tasks/:id", verifyToken, async (req, res) => {
      const id = req.params.id;
      const formData = req.body;
      const filter = { _id: new ObjectId(id) }
      const updatedDoc = {
        $set: formData,
      }
      const options = { upsert: true }
      const result = await tasksCollection.updateOne(filter, updatedDoc, options);
      res.send(result);
    });


    // Reorder tasks
    app.put("/tasks/reorder", verifyToken, async (req, res) => {
      const { tasks } = req.body;

      for (let task of tasks) {
        const filter = { _id: new ObjectId(task._id) }
        const updateDoc = {
          $set: { order: task.order },
        }
        await tasksCollection.updateOne(filter, updateDoc)
      }
      res.send({ message: "Tasks reordered" });
    });

    app.patch("tasks/:id", async (req, res) => {
      const { id } = req.params;
      const { category, order } = req.body;
      const filter = { _id: new ObjectId(id) }
      const updateDoc = {
        $set: { category, order },
      }
      const result = await tasksCollection.updateOne(filter, updateDoc)
      res.send(result);
    });
    




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