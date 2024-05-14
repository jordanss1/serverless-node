const serverless = require("serverless-http");
const express = require("express");
const { neon, neonConfig } = require("@neondatabase/serverless");
const app = express();

const dbClient = async () => {
  neonConfig.fetchConnectionCache = true;
  return neon(process.env.DATABASE_URL);
};

app.get("/", async (req, res, next) => {
  const sql = await dbClient();
  const results = await sql`select now()`;

  return res.status(200).json({
    message: "Hello from path!",
    results,
  });
});

app.get("/path", (req, res, next) => {
  return res.status(200).json({
    message: "Hello from path!",
  });
});

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

// server-full app
// app.listen(3000, (req, res, next) => console.log("Running at localhost:3000"));

module.exports.handler = serverless(app);
