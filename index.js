const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middlewares
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://bookaroo-586ec.web.app",
      "https://bookaroo-586ec.firebaseapp.com",
    ],
    credentials: true,
  })
);
app.use(express.json());

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0xqywot.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const bookCollection = client.db("bookaroDB").collection("books");

    app.get("/books", async (req, res) => {
      const result = await bookCollection.find().toArray();
      res.send(result);
    });

    // search books
    app.get("/searchedBooks", async (req, res) => {
      const result = await bookCollection.find().toArray();
      res.send(result);
    });

    // get all books data for pagination
    app.get("/all-books", async (req, res) => {
      const page = parseInt(req.query.page) - 1;
      const size = parseInt(req.query.size);
      console.log("page=>", page, "size=>", size);

      const filter = req.query.filter;
      console.log("filter=>", filter);

      const sort = req.query.sort;
      console.log("sort=>", sort);

      const search = req.query.search;
      console.log("search=>", search);

      let query = {
        bookName: { $regex: search, $options: "i" },
      };
      // if (filter) query = { category: filter } একই if (filter) query.category = filter;
      if (filter) query.category = filter;

      let options = {};
      if (sort) options = { sort: { price: sort === "asc" ? 1 : -1 } };

      const result = await bookCollection
        .find(query, options)
        .skip(page * size)
        .limit(size)
        .toArray();
      res.send(result);
    });

    // get all books data count
    app.get("/books-count", async (req, res) => {
      const filter = req.query.filter;
      console.log("filter=>", filter);

      const search = req.query.search;

      let query = {
        bookName: { $regex: search, $options: "i" },
      };
      if (filter) query.category = filter;

      const count = await bookCollection.countDocuments(query);
      res.send({ count });
    });

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Welcome to Bookaroo server");
});

// connect app to the port
app.listen(port, () => {
  console.log(`Bookaroo server running on PORT : ${port}`);
});
