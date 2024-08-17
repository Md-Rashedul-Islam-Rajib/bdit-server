const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

app.use(
    cors({
      origin: [
        "http://localhost:5173"
      ]
    })
  );
  app.use(express.json());

  const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@artstore.tattjrs.mongodb.net/?retryWrites=true&w=majority&appName=ArtStore`;

  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  async function run() {
    try{
        const productCollection = client.db("productsDB").collection("products");

        app.get('/', async (req,res) => {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 8;
            const skip = (page - 1) * limit;

            try{
                const [products, totalProducts] = await Promise.all([
                    productCollection.find().skip(skip).limit(limit).toArray(),
                    productCollection.countDocuments()
                ])

                const totalPages = Math.ceil(totalProducts / limit);
            }
            // const result = await productCollection.find().toArray();
            // return res.send(result)
        })
    }
    finally{

    }
  }
  run().catch(console.dir);

  app.get("/", (req, res) => {
    res.send("server running ");
  });

  app.listen(port, () => {
    console.log(`server running from ${port}`);
  });
  