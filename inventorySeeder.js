const { MongoClient } = require("mongodb");
require("dotenv/config");

// Database configuration
const uri =  `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@sage.864ng.mongodb.net/${process.env.MONGODB_DBNAME}?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function populate() {
  try {
    await client.connect();

    const db = client.db(process.env.MONGODB_DBNAME);
    await db.collection('inventory').insertMany([
        {
            item: 'tshirt',
            color: 'moss',
            size: 'S',
            qty: 7
        },
        {
            item: 'tshirt',
            color: 'moss',
            size: 'M',
            qty: 8
        },
        {
            item: 'tshirt',
            color: 'moss',
            size: 'L',
            qty: 7
        },
        {
            item: 'tshirt',
            color: 'moss',
            size: 'XL',
            qty: 2
        },
        {
            item: 'tshirt',
            color: 'forest',
            size: 'S',
            qty: 8
        },
        {
            item: 'tshirt',
            color: 'forest',
            size: 'M',
            qty: 8
        },
        {
            item: 'tshirt',
            color: 'forest',
            size: 'L',
            qty: 6
        },
        {
            item: 'tshirt',
            color: 'forest',
            size: 'XL',
            qty: 2
        },
        {
            item: 'tshirt',
            color: 'white',
            size: 'S',
            qty: 6
        },
        {
            item: 'tshirt',
            color: 'white',
            size: 'M',
            qty: 4
        },
        {
            item: 'tshirt',
            color: 'white',
            size: 'L',
            qty: 1
        },
        {
            item: 'tshirt',
            color: 'white',
            size: 'XL',
            qty: 2
        },
        {
            item: 'tshirt',
            color: 'black',
            size: 'S',
            qty: 7
        },
        {
            item: 'tshirt',
            color: 'black',
            size: 'M',
            qty: 8
        },
        {
            item: 'tshirt',
            color: 'black',
            size: 'L',
            qty: 4
        },
        {
            item: 'tshirt',
            color: 'black',
            size: 'XL',
            qty: 2
        },
        {
            item: 'tote',
            color: 'canvas',
            size: 'OS',
            qty: 18
        },
        {
            item: 'bucket',
            color: 'dualtone',
            size: 'OS',
            qty: 18
        },
        {
            item: 'stickers',
            color: 'transparent',
            size: 'OS',
            qty: 30
        }
      ]);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
populate().catch(console.dir);



