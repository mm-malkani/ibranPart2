import "dotenv/config";
import { MongoClient } from "mongodb";

let _db, leads_coll;

const mongoConnect = async () => {
  new Promise(async (resolve, reject) => {
    MongoClient.connect(process.env.COMMUNITY_URI, {
      useUnifiedTopology: true,
    })
      .then(async (client) => {
        _db = await client.db();
        leads_coll = _db.collection("leads");
        resolve();
      })
      .catch((err) => {
        reject(err);
      });
  })
    .then(async () => {
      console.log("Databse plugged in and healthy to serve.!");
    })
    .catch((err) => {
      console.log("Error connecting to database");
      console.log(err);
    });
};

const leadscoll = async () => {
  if (leads_coll) return leads_coll;
  throw "leads collection not found";
};

export { leadscoll, mongoConnect };
