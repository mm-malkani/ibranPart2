import "dotenv/config";
import { MongoClient } from "mongodb";

let _db, questionpapers_coll;

const mongoConnect = async () => {
  new Promise(async (resolve, reject) => {
    MongoClient.connect(process.env.COMMUNITY_URI, {
      useUnifiedTopology: true,
    })
      .then(async (client) => {
        _db = await client.db();
        questionpapers_coll = _db.collection("questionPapers");
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

const questionpapers = async () => {
  if (questionpapers_coll) return questionpapers_coll;
  throw "leads collection not found";
};

export { mongoConnect, questionpapers };
