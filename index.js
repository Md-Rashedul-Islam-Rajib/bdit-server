const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: ["http://localhost:5173"],
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
  try {
    const productCollection = client.db("productsDB").collection("products");

    app.get("/", async (req, res) => {
      const { page = 1, limit = 8, search = "", sort, brand,price,category,maxPrice,minPrice } = req.query;
      const skip = (page - 1) * limit;

      let filter = {};

      if (search && search.length) {
        filter.name = { $regex: search, $options: "i" };
      }

      // Filter by brand
      if (brand && brand.length) {
        filter.brand = brand;
    }

    // Filter by category
    if (category && category.length) {
        filter.category = category;
    }

    // Filter by price range
    if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice) {
            filter.price.$gte = parseInt(minPrice);
        }
        if (maxPrice) {
            filter.price.$lte = parseInt(maxPrice);
        }
    }

      let sortBy = {};
      switch (sort) {
        case "price_asc":
          sortBy.price = 1;
          break;
        case "price_desc":
          sortBy.price = -1;
          break;
        case "date_desc":
          sortBy.creation_time = -1;
          break;
        case "date_asc":
          sortBy.creation_time = 1;
          break;
        default:
          sortBy = {};
      }

      try {
        const [products, totalProducts] = await Promise.all([
          productCollection
            .find(filter)
            .sort(sortBy)
            .skip(skip)
            .limit(parseInt(limit))
            .toArray(),
          productCollection.countDocuments(filter),
        ]);

        const totalPages = Math.ceil(totalProducts / limit);

        res.json({
          products,
          totalPages,
          currentPage: page,
        });
      } catch (error) {
        res.status(500).json({ error: "Internal server error" });
      }

      // const result = await productCollection.find().toArray();
      // return res.send(result)
    });
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("server running ");
});

app.listen(port, () => {
  console.log(`server running from ${port}`);
});
