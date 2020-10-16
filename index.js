const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const ObjectId = require('mongodb').ObjectID;
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
const port = 5000;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.p9rwg.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const serviceCollection = client.db("creative-agency").collection("services");
  const feedbackCollection = client.db("creative-agency").collection("feedback");
  const selectionCollection = client.db("creative-agency").collection("selection");
  const adminCollection = client.db("creative-agency").collection("admin");
 
  app.post("/yourfeedback", (req,res) => {
      const feedback = req.body;
      feedbackCollection.insertOne(feedback)
  })

  app.get("/feedback", (req,res) => {
    feedbackCollection.find({})
        .toArray((err,doc) => {
            res.send(doc);
        })
})

    app.get("/services", (req,res) => {
        serviceCollection.find({})
        .toArray((err,doc) => {
            res.send(doc);
        })
    })

    app.get("/yourService/:id", (req,res) => {
      serviceCollection.find({_id: ObjectId(req.params.id)})
      .toArray((err,doc) => {
          res.send(doc[0]);
      })
  })

  app.post("/selectedservice", (req,res) => {
    const services = req.body;
    selectionCollection.insertOne(services)
})

  app.get("/yourServices", (req,res) => {
    selectionCollection.find({email: req.query.email})
    .toArray((err,doc) => {
        res.send(doc);
    })
})

app.post("/admin", (req,res) => {
  const admin = req.body;
  adminCollection.insertOne(admin)
})

app.get("/admin", (req,res) => {
  const admin = req.query.email;
  adminCollection.find({email: admin})
  .toArray((err,doc) => {
    if(doc.length > 0){
      res.send(true);
    }
    else{
      res.send(false);
    }
  })
})

app.get("/allOrders", (req,res) => {
  selectionCollection.find({})
  .toArray((err,doc) => {
      res.send(doc);
  })
})

app.post("/addService", (req,res) => {
  const service = req.body;
  serviceCollection.insertOne(service)
})

});


app.get('/', (req, res) => {
  res.send('Hello World!')
  
})

app.listen(process.env.PORT || port);