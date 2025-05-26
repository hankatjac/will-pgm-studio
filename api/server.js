import express from "express";
import authRoute from "./routes/auth.route.js";
import userRoute from "./routes/user.controller.js";
import postRoute from "./routes/post.route.js";
import eventRoute from "./routes/event.route.js";
import todosRoute from "./routes/todo.route.js";
import imgRoute from "./routes/img.route.js";
import contactRoute from "./routes/contact.route.js";
import { db } from "./config/db.js";

import cookieParser from "cookie-parser";

import cors from "cors";

const app = express();

// Connecting to DB

db.connect((err) => {
  if (err) {
    console.log(err);
    throw err;
  }
  
  console.log("database is connected and hosted in " + process.env.DB_HOST);
});

// db.getConnection((err, connection) => {
//   if (err) {
//     console.log(err);
//     throw err;
//   } else {
//     console.log("databse connected successfully");
//     console.log("database host is " + process.env.DB_HOST);
//   }
//   if (connection) connection.release();
//   return;
// });

process.on("uncaughtException", (err) => {
  if (err.code == "PROTOCOL_CONNECTION_LOST") {
    console.log("db connction lost");
  }
});

var corsOptions = {
  origin: ["https://hankatjac.github.io", "http://localhost:3000"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/events", eventRoute);
app.use("/api/todos", todosRoute);
app.use("/api/img", imgRoute);
app.use("/api/contact", contactRoute);

app.get("/", (req, res) => {
  res.json({ message: "Welcome to will-pgm application." });
});
// set port, listen for requests
const PORT = process.env.PORT || 8800;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}.`));
