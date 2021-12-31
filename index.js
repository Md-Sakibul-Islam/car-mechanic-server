const express = require("express");
const cors = require("cors");
const ObjectId = require('mongodb').ObjectId;
const { MongoClient } = require("mongodb");

require("dotenv").config();
const app = express();


const port = process.env.PORT || 5000;
// middle ware
app.use(cors());
app.use(express.json());
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.a2vjp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();

    const database = client.db("carMechanic");
    const servicesCollection = database.collection("servicesCollection");

    // post api
    app.post("/services", async (req, res) => {
      const service = req.body;
      const result = await servicesCollection.insertOne(service);
      res.json(result)
    });
// get api 
    app.get('/services', async (req,res)=>{
        const cursor = servicesCollection.find({});
        const  result =  await cursor.toArray()
        res.send(result);
    })

    

    // get api single item 
     
    app.get('/services/:id',async(req,res)=>{
        const id = req.params.id;
        const query = {_id: ObjectId(id)}
        const result = await servicesCollection.findOne(query);
        res.json(result)
    })
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("car machanic node js server");
});

app.listen(port, () => {
  console.log("listing to port ", port);
});
