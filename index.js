import express from "express";
import { MongoClient } from "mongodb";
import * as dotenv from "dotenv";
import cors from "cors";
dotenv.config();

const app = express();
app.use(cors());
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
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome</title>
      <style>
        body {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          margin: 0;
        }
        img {
          max-width: 100%;
          height: auto;
        }
      </style>
    </head>
    <body>
      <img src="https://t4.ftcdn.net/jpg/08/36/42/81/360_F_836428157_5dm5SdeL8Q12z6VjIz3Y054CCP05LGW2.jpg" alt="Welcome Greeting" />
    </body>
    </html>
  `);
});

// Get all products
app.get("/products", async (req, res) => {
  try {
    const product = await client
      .db("fsd-demo")
      .collection("products")
      .find()
      .toArray();
    res.send(product);
  } catch (error) {
    res.status(500).send({ error: "Failed to retrieve products" });
  }
});

// Get product by ID
app.get("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await client
      .db("fsd-demo")
      .collection("products")
      .findOne({ id: id });
    if (!product) {
      return res.status(404).send({ error: "Product not found" });
    }
    res.send(product);
  } catch (error) {
    res.status(500).send({ error: "Failed to retrieve product" });
  }
});

// Delete product by ID
app.delete("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await client
      .db("fsd-demo")
      .collection("products")
      .deleteOne({ id: id });
    if (result.deletedCount === 0) {
      return res.status(404).send({ error: "Product not found" });
    }
    res.send({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).send({ error: "Failed to delete product" });
  }
});

// Add product
app.post("/products", async (req, res) => {
  try {
    const newProduct = req.body;
    const result = await client
      .db("fsd-demo")
      .collection("products")
      .insertMany(newProduct);
    res.send(result);
  } catch (error) {
    res.status(500).send({ error: "Failed to add product" });
  }
});

// Update product by ID
app.put("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedProduct = req.body;
    const result = await client
      .db("fsd-demo")
      .collection("products")
      .updateOne({ id: id }, { $set: updatedProduct });
    if (result.matchedCount === 0) {
      return res.status(404).send({ error: "Product not found" });
    }
    res.send({ message: "Product updated successfully" });
  } catch (error) {
    res.status(500).send({ error: "Failed to update product" });
  }
});

app.listen(PORT, () => console.log("Server started on the port", PORT));
