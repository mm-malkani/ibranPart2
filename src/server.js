import "dotenv/config";
import express from "express";
import { mongoConnect } from "./db/mongo.js";
import boardRouter from "./routes/12thClass.js";

const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// * Routes * //
app.use("/v1/12thclass", boardRouter);

// Basic route
app.get("/", (req, res) => {
  res.send("Welcome to my Node.js backend!");
});

mongoConnect();

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
