require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const targetRoutes = require("./routes/targets");
const path = require("path");
const fs = require("fs");

const app = express();
connectDB();

app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/targets", targetRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Target Service running on port ${PORT}`));