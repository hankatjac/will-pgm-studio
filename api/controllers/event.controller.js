import { db } from "../config/db.js";
import jwt from "jsonwebtoken";

export const getEvents = (req, res) => {
  const q = "SELECT * FROM events";
  db.query(q, (err, data) => {
    if (err) return res.status(500).send(err);
    return res.status(200).json(data);
  });
};

export const addEvent = (req, res) => {
  const token = req.cookies.access_token;
  if (!token)
    return res.status(401).json("Not authenticated! Please login or re-login!");

  jwt.verify(token, process.env.JWT_KEY, (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q =
      "INSERT INTO events(`title`, `desc`, `start`,`end`, `euid`) VALUES (?)";

    const values = [
      req.body.title,
      req.body.desc,
      req.body.start,
      req.body.end,
      userInfo.id,
    ];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.json("Event has been created.");
    });
  });
};

export const deleteEvent = (req, res) => {
  const token = req.cookies.access_token;
  if (!token)
    return res.status(401).json("Not authenticated! Please login or re-login!");

  jwt.verify(token, process.env.JWT_KEY, (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const eventId = req.params.id;
    const q = "DELETE FROM events WHERE `id` = ? AND `euid` = ?";

    db.query(q, [eventId, userInfo.id], (err, results, data) => {
      if (err) return res.status(500).json(err);
      if (results.affectedRows === 0) {
        return res.status(403).json("You can delete only your event!");
      }
      return res.json("Event has been deleted!");
    });
  });
};

export const updateEvent = (req, res) => {
  const token = req.cookies.access_token;
  if (!token)
    return res.status(401).json("Not authenticated! Please login or re-login!");

  jwt.verify(token, process.env.JWT_KEY, (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const eventId = req.params.id;
    const q =
      "UPDATE events SET `title`=?,`desc`=?,`start`=?,`end`=? WHERE `id` = ? AND `euid` = ?";

    const values = [
      req.body.title,
      req.body.desc,
      req.body.start,
      req.body.end,
    ];

    db.query(q, [...values, eventId, userInfo.id], (err, results, data) => {
      if (err) return res.status(500).json(err);
      if (results.changedRows === 0) {
        return res.status(403).json("You can update only your event!");
      }
      return res.json("Post has been updated.");
    });
  });
};
