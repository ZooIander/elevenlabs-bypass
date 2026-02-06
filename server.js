import express from "express";
import handler from "speak.js";

const app = express();

app.use(express.json({ limit: "1mb" }));

app.post("", (req, res) => handler(req, res));

// healthcheck
app.get("", (req, res) => res.send("OK"));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("Listening on", port));
