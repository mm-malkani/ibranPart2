import "dotenv/config";
import { MongoClient } from "mongodb";

let _db, forms_coll;

const mongoConnect = async () => {
  new Promise(async (resolve, reject) => {
    MongoClient.connect(process.env.COMMUNITY_URI, {
      useUnifiedTopology: true,
    })
      .then(async (client) => {
        _db = await client.db();
        forms_coll = _db.collection("forms");
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

const formscoll = async () => {
  if (url_coll) return forms_coll;
  throw "url collection not found";
};

export { formscoll, mongoConnect };
