import { config } from "dotenv";
import express from "express";
import { routes } from "./routes/router";
import { conn } from "./db/con";

config();

const app = express();

app.use(express.json());

conn();

app.use("/api", routes);

app.listen(3000, () => {
  console.log("online");
});
