require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
// app.use(cors({
//   origin: 'http://localhost:5173/'
// }));
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jv8sqpa.mongodb.net/?retryWrites=true&w=majority`;

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
   // await client.connect();

    const productCollection = client.db('brandShop').collection('products');
    const myCart = client.db('brandShop').collection('mycart');

    app.get('/products', async (req, res) => {
      const cursor = productCollection.find();
      const result = await cursor.toArray();
      res.send(result);
  })

    app.post('/products', async (req, res) => {
      const newProduct = req.body;
      console.log(newProduct);
      const result = await productCollection.insertOne(newProduct);
      res.send(result);
  })

  app.get("/products/:id", async (req, res) => {
    const id = req.params.id;
    console.log("id", id);
    const query = {
      _id: new ObjectId(id),
    };
    const result = await productCollection.findOne(query);
    console.log(result);
    res.send(result);
  });

  app.put("/products/:id", async (req, res) => {
    const id = req.params.id;
    const data = req.body;

    const filter = {
      _id: new ObjectId(id),
    };
    const options = { upsert: true };
    const updatedData = {
      $set: {
        name: data.name,
        image: data.image,
        brand: data.brand,
        price: data.price,
        type: data.type,
        rating: data.rating,
      },
    };
    const result = await productCollection.updateOne(
      filter,
      updatedData,
      options
    );
    res.send(result);
  });

  app.get('/mycart', async (req, res) => {
    const cursor = myCart.find();
    const users = await cursor.toArray();
    res.send(users);
})

  app.post('/mycart', async (req, res) => {
    const newProduct = req.body;
      console.log(newProduct);
      const result = await myCart.insertOne(newProduct);
      res.send(result);
});

app.delete('/mycart/:id', async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await myCart.deleteOne(query);
  res.send(result);
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
    res.send('Brand Shop server is running')
})

app.listen(port, () => {
    console.log(`Brand Shop Server is running on port: ${port}`)
})