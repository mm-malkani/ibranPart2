import "dotenv/config";
import express from "express";
import { mongoConnect } from "./db/mongo.js";
import leadRouter from "./routes/leads.js";

const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// * Routes * //
app.use("/v1/lead", leadRouter);

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
