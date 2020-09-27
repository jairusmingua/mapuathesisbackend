const express = require("express");
const app = express();
const { MongoClient } = require("mongodb");
const mongo = require("mongodb");
const dotenv = require("dotenv").config();
const client = new MongoClient(process.env.URI);
const cors = require("cors");
app.use(cors());
app.use(express.json());


const _database = "thesis";
const _collection = "tweets";

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
    let database = client.db(_database);
    let collection = database.collection(_collection);
    const tweet = await collection.aggregate(
        [ { $sample: { size: 1 } } ]
    ).toArray();
    res.send(tweet);
} catch (error) {
    console.log(error);
    res.send(error);
  }
});
app.post("/", async(req,res)=>{
  let id = req.body._id;
  let answer = req.body.answer;
  let respondent = req.body.respondent;
  try {
    let database = client.db(_database);
    let collection = database.collection(_collection);
    collection.updateOne({_id:new mongo.ObjectID(id)},{
      $set:{label:answer,respondent:respondent,responded:true}
    }).then((data)=>{
      res.send(data);
    }).catch((error)=>{
      res.send(error);
    })
  } catch (error) {
    console.log(error);
    res.send(error).status(401);
  }
});

app.get("/remaining",async(req,res)=>{
  
  try {
    let database = client.db(_database);
    let collection= database.collection(_collection);
    let results = await collection.aggregate([
      {$match:{responded:null}},{$count:"responded"}
    ]).toArray();
    res.send(results[0]);  
  } catch (error) {
    res.send(error);
  }
})
app.get("/total",async(req,res)=>{
  
  try {
    let database = client.db(_database);
    let collection= database.collection(_collection);
    let results = await collection.aggregate([
      {$count:"total"}
    ]).toArray();
    res.send(results[0]);  
  } catch (error) {
    res.send(error);
  }
})