const express = require('express')
const cors = require("cors")
require("dotenv").config()
const bodyParser = require('body-parser')
const { MongoClient } = require('mongodb')
const uri = "mongodb+srv://volentiar:volentiarpassword@cluster0.ka9ky.mongodb.net/volentiar?retryWrites=true&w=majority";

const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("volentiar").collection("resister");
  const roleCollection = client.db("volentiar").collection("info");
  const addCollection = client.db("volentiar").collection("addnew");

  app.post("/postVolentiar",(req,res)=>{
      const postVolentiar = req.body;
      collection.insertOne(postVolentiar)
      .then(function(result) {
        res.send(result.insertedCount)
      })
  })

  app.post("/addnew",(req,res)=>{
    const add = req.body;
    addCollection.insertOne(add)
    .then(function(result){
      res.send(result.insertedCount > 0)
    })
  })

  app.get("/getVolentiar",(req,res)=>{
    collection.find({})
    .toArray((err,documents)=>{
      res.send(documents)
    })
  })

  app.get("/getNewAddedInfo",(req,res)=>{
    addCollection.find({})
    .toArray((err,documents)=>{
      res.send(documents)
    })
  })

  app.get("/getVolentiarsingle/:key",(req,res)=>{
    collection.find({key:req.params.key})
    .toArray((err,documents)=>{
      res.send(documents[0])
    })
  })

  app.post("/postSlecectedVolunteer",(req,res)=>{
    const selectedInfo = req.body;
    roleCollection.insertOne(selectedInfo)
    .then(function(result){
      res.send(result.insertedCount > 0 )
    })
  })

  app.get("/getDataFromInfo",(req,res)=>{
    console.log(req.query.email)
    roleCollection.find({email:req.query.email})
    .toArray((err,documents)=>{
      res.send(documents)
    })
  })

  app.get("/showlist",(req,res)=>{
    roleCollection.find({})
    .toArray((err,documents)=>{
      res.send(documents)
    })
  })

  app.delete("/deleteInfo/:key",(req,res)=>{
    roleCollection.deleteOne({key:req.params.key})
    .then(function(result) {
      res.send(result.deletedCount > 0)
    })
  })

  app.delete("/newDeleteInfo/:key",(req,res)=>{
    addCollection.deleteOne({key:req.params.key})
    .then(function(result) {
      res.send(result.deletedCount > 0)
    })
  })




    console.log("db connected")
});


app.get('/', (req, res) => {
  res.send("volentiar")
})

const port = 4000;

app.listen(process.env.PORT || port, console.log("successfully running port 4000"))