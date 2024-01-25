require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");
const { BadRequest } = require("../util/AppError");
const uri = process.env.MONGODB_URI;
let dbInstance;

async function connectDb() {
  try {
    const client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });

    await client.connect();
    console.log("mongo con sus!");
    dbInstance = client.db(process.env.DB_NAME);
    return dbInstance;
  } catch (err) {
    console.log("DB connection error!", err);
    throw err;
  }
}

function getDb() {
  if (!dbInstance) {
    // return res.status(400).json({ messsage: "Database not initialized!" });
    throw new BadRequest("Database not initialized!");
  }
  return dbInstance;
}

module.exports = { getDb, connectDb };
