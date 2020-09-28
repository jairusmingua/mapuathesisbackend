const express = require("express");
const app = express();
const { MongoClient } = require("mongodb");
const mongo = require("mongodb");
const dotenv = require("dotenv").config();
const client = new MongoClient(process.env.URI);
const cors = require("cors");
const util = require("./util");
const http = require('http').createServer(app);
const io = require("socket.io")(http);
const io_port = 5500;
app.use(cors());
app.use(express.json());

const _database = "thesis";
const _collection = "tweets";

app.get("/", async (req, res) => {
  try {
    let database = client.db(_database);
    let collection = database.collection(_collection);
    const tweet = await collection.aggregate(
      [
        {
          '$match': {
            'responded': null
          }
        }, {
          '$sample': {
            'size': 1
          }
        }
      ]
        ).toArray();
    res.send(tweet);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});
app.post("/done",async(req,res)=>{
  let respondent = req.body; 
  try {
    let database = client.db(_database);
    let collection=database.collection("respondents");
    collection.insertOne(respondent)
    .then((result)=>{
      res.send(result);
    }).catch((err)=>{
      res.send(err);
    })
  } catch (error) {
    res.send(error);
  }
})
app.post("/", async(req,res)=>{
  let id = req.body._id;
  let answer = req.body.answer;
  let respondent = req.body.respondent;
  
    let database = client.db(_database);
    let collection = database.collection(_collection);
    collection.updateOne({_id:new mongo.ObjectID(id)},{
      $set:{label:answer,respondent:respondent,responded:true}
    }).then(async(data)=>{
      let remaining = await util.getRemaining(client.db(_database),_collection);
      io.emit("update",remaining);
      res.send(data);
    }).catch((error)=>{
      res.send(error);
    })
    
});


app.get("/remaining",async(req,res)=>{
  
    util.getRemaining(client.db(_database),_collection).then((data)=>{
      res.send(data);  
    }).catch((err)=>{
      res.send(err);
    });
  
  })
  app.get("/total",async(req,res)=>{
  
    try {
      let result = await util.getTotal(client.db(_database),_collection);
    res.send(result);  
  } catch (error) {
    res.send(error);
  }
})

http.listen(process.env.PORT||5000, async () => {
    try {
      await client.connect();
      console.log("App listening");
    } catch (err) {
      console.log(err);
    }
});