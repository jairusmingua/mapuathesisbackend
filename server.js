const express = require("express");
const app = express();
const { MongoClient } = require("mongodb");
const dotenv = require("dotenv").config();
const client = new MongoClient(process.env.URI);
const cors = require("cors");
app.use(cors());
var collection = null;
app.listen(process.env.PORT||5000, async () => {
  try {
    await client.connect();
    console.log("App listening");
  } catch (err) {
    console.log(err);
  }
});
app.get("/", async (req, res) => {
  try {
    var database = client.db("thesis");
    collection = database.collection("tweets");
    const tweet = await collection.aggregate(
        [ { $sample: { size: 1 } } ]
    ).toArray();
    res.send(tweet);
} catch (error) {
    console.log(error);
    res.send(error);
  }
});
