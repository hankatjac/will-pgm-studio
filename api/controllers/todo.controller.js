import { db } from "../config/db.js";
import jwt from "jsonwebtoken";

export const getTodos = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated! Please login or re-login!");

  jwt.verify(token, process.env.JWT_KEY, (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");
    const q = "SELECT * FROM todos where tuid=?";
    db.query(q, [userInfo.id], (err, data) => {
      if (err) return res.status(500).send(err);
      return res.status(200).json(data);
    });
  });
};

export const getTodo = (req, res) => {
  const q =
    "SELECT t.id, `text`, `day`,`reminder` FROM users u JOIN todos t ON u.id = t.tuid WHERE t.id = ? ";

  db.query(q, [req.params.id], (err, data) => {
    if (err) return res.status(500).json(err);

    return res.status(200).json(data[0]);
  });
};

export const addTodo = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated! Please login or re-login!");

  jwt.verify(token, process.env.JWT_KEY, (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = "INSERT INTO todos(`text`, `day`, `reminder`, `tuid`) VALUES (?)";

    const values = [
      req.body.text,
      req.body.day,
      req.body.reminder,
      userInfo.id,
    ];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.json("todo has been created.");
    });
  });
};

export const deleteTodo = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated! Please login or re-login!");

  jwt.verify(token, process.env.JWT_KEY, (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const todoId = req.params.id;
    const q = "DELETE FROM todos WHERE `id` = ? AND `tuid` = ?";

    db.query(q, [todoId, userInfo.id], (err, data) => {
      if (err) return res.status(403).json("You can delete only your todo!");

      return res.json("todo has been deleted!");
    });
  });
};

export const updateTodo = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated! Please login or re-login!");

  jwt.verify(token, process.env.JWT_KEY, (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const todoId = req.params.id;
    const q =
      "UPDATE todos SET `text`=?,`day`=?,`reminder`=? WHERE `id` = ? AND `tuid` = ?";

    const values = [req.body.text, req.body.day, req.body.reminder];

    db.query(q, [...values, todoId, userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.json("todo has been updated.");
    });
  });
};
