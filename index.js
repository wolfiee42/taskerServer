const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;


app.use(cors())
app.use(express.json())

const dbConnet = async () => {
    try {
        console.log('DB Connected Successfully');
    } catch (error) {
        console.log(error.name, error.message);
    }
}
dbConnet();


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5nrqg6c.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

const taskCollection = client.db("tasker").collection("taskDB");

app.get('/', (req, res) => {
    res.send('server is walking');
})

app.post('/tasks', async (req, res) => {
    const task = req.body;
    const result = await taskCollection.insertOne(task);
    res.send(result);
})

app.get('/tasks', async (req, res) => {
    const email = req.query.email;
    // const state = req.query.state;
    const filter = { email: email };
    // const filter2 = { state: state }
    const result = await taskCollection.find(filter).toArray();
    res.send(result);
})

app.get('/tasks/:id', async (req, res) => {
    const id = req.params.id;
    const filter = { _id: new ObjectId(id) };
    const result = await taskCollection.findOne(filter);
    res.send(result);
})

app.patch('/tasks/:id', async (req, res) => {
    const id = req.params.id;
    const filter = { _id: new ObjectId(id) };
    const updatedDoc = {
        $set: {
            state: "ongoing"
        }
    }
    const result = await taskCollection.updateOne(filter, updatedDoc);
    res.send(result);
})
app.put('/tasks/:id', async (req, res) => {
    const id = req.params.id;
    const filter = { _id: new ObjectId(id) };
    const updatedDoc = {
        $set: {
            state: "completed"
        }
    }
    const result = await taskCollection.updateOne(filter, updatedDoc);
    res.send(result);
})

app.delete('/tasks/:id', async (req, res) => {
    const id = req.params.id;
    const filter = { _id: new ObjectId(id) };
    const result = await taskCollection.deleteOne(filter);
    res.send(result);
})


app.listen(port, () => {
    console.log(`Server is walking on port ${port} `);
})