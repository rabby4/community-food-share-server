const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const cors = require('cors')
require('dotenv').config()
const port = 5000


app.use(express.json())
app.use(cors({
  origin:'http://localhost:5173',
  credentials: true
}))

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.v07t2jx.mongodb.net/?retryWrites=true&w=majority`;

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

    const foodCollections = client.db('foodShare').collection('foods')
    const requestFoodCollections = client.db('foodShare').collection('request')

    // post a food on database
    app.post('/foods', async(req, res)=>{
      const newFood = req.body;
      const result = await foodCollections.insertOne(newFood)
      res.send(result)
    })

    app.get('/foods', async(req, res)=>{
      let query = {}
      if(req.query?.email){
        query = {email: req.query.email}
      }
      const result = await foodCollections.find(query).toArray()
      res.send(result)
    })

    // get all foods
    app.get('/foods', async(req, res)=>{
      const query = foodCollections.find()
      const result = await query.toArray()
      res.send(result)
    })

    // get single food
    app.get('/foods/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await foodCollections.findOne(query)
      res.send(result)
    })

    // get foods for manage
   

    // post for request
    app.post('/request', async(req, res)=>{
      const newRequest = req.body;
      const result = await requestFoodCollections.insertOne(newRequest)
      res.send(result)
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('Community food sharing server is running!')
})

app.listen(port, () => {
  console.log(`Food sharing app listening on port ${port}`)
})