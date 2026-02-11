import express from "express";
import { config } from "./config/config.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health-check", (req, res) => {
    res.send("API-KEY Backend is working!");
});

app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`)
});