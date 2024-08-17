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

  const uri = "mongodb+srv://<username>:<password>@artstore.tattjrs.mongodb.net/?retryWrites=true&w=majority&appName=ArtStore";