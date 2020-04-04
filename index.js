const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()


const uri = process.env.DB_PATH;
let client = new MongoClient(uri, { useNewUrlParser: true });

app.use(cors())
app.use(bodyParser.json())
app.get('/products', (req, res) => {
    client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection = client.db("ema-john").collection("products");
        collection.find().sort({ $natural: -1 }).toArray((err, documents) => {
            if (err) {
                console.log(err);
                res.status(500).send({ message: err })
            }
            else {
                res.send(documents);
            }
        })
        client.close();
    });
});
app.get('/product/:key', (req, res) => {
    const key = req.params.key;
    client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection = client.db("ema-john").collection("products");
        collection.find({ key }).sort({ $natural: -1 }).toArray((err, documents) => {
            if (err) {
                console.log(err);
                res.status(500).send({ message: err })
            }
            else {
                res.send(documents[0]);
            }
        })
        client.close();
    });
});

app.post('/getProductByKey', (req, res) => {
    const productKeys = req.body;
    client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection = client.db("ema-john").collection("products");
        collection.find({ key: { $in: productKeys } }).toArray((err, documents) => {
            if (err) {
                console.log(err);
                res.status(500).send({ message: err })
            }
            else {
                res.send(documents);
            }
        })
        client.close();
    });
});

app.post('/addProducts', (req, res) => {
    client = new MongoClient(uri, { useNewUrlParser: true });
    const products = req.body
    client.connect(err => {
        const collection = client.db("ema-john").collection("products");
        collection.insert(products, (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send({ message: err })
            }
            else {
                res.send(result.ops);
            }
        })
        client.close();
    })
})

app.post('/placeOrder', (req, res) => {
    client = new MongoClient(uri, { useNewUrlParser: true });
    const orderDetails = req.body
    orderDetails.orderTime = new Date()
    client.connect(err => {
        const collection = client.db("ema-john").collection("orders");
        collection.insertOne(orderDetails, (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send({ message: err })
            }
            else {
                res.send(result.ops[0]);
            }
        })
        client.close();
    });
})



app.listen(process.env.PORT, () => console.log("Listening from port", process.env.PORT))

