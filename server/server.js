const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/auth");
const noteRoutes = require("./routes/notes");

const app = express();
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/notes", noteRoutes);
app.use(cors());

mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`),
);
