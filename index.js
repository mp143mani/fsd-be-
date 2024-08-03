import express from "express";
import { MongoClient } from "mongodb";
import * as dotenv from "dotenv";
import cors from "cors"
dotenv.config();

const app = express();
app.use(cors())
const PORT = 5000;
// console.log(process.env.MONGO_URL);
//MongoDb connection
const MONGO_URL = process.env.MONGO_URL;
async function createConnection() {
  const client = new MongoClient(MONGO_URL);
  await client.connect();
  console.log("Mongodb is connected");
  return client;
}

const client = await createConnection();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello Everyone🥳🥳🥳");
});

app.get("/products", async (req, res) => {
  const product = await client
    .db("B46-product-ap")
    .collection("products")
    .find()
    .toArray();
  res.send(product);
});

//get product by ID
app.get("/products/:id", async (req, res) => {
  const { id } = req.params;
  const product = await client
    .db("fsd-demo")
    .collection("products")
    .findOne({ id: id });
  res.send(product);
});

//delete product by ID
app.delete("/products/:id", async (req, res) => {
  const { id } = req.params;
  const product = await client
    .db("B46-product-app")
    .collection("products")
    .deleteOne({ id: id });
  res.send(product);
});

//add product
app.post("/products", async (req, res) => {
  //where we will pass data - body
  const newProduct = req.body;
  const result = await client
    .db("B46-product-app")
    .collection("products")
    .insertMany(newProduct);
  res.send(result);
});

//update products

app.put("/products/:id", async (req, res) => {
  const { id } = req.params;
  //where we will pass data - body
  const updatedProduct = req.body;
  const result = await client
    .db("B46-product-app")
    .collection("products")
    .updateOne({ id: id }, { $set: updatedProduct });
  res.send(result);
});

app.listen(PORT, () => console.log("Server started on the port", PORT));
