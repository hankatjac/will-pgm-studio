import express from "express";
import {
  addEvent,
  deleteEvent,
  getEvents,
  updateEvent,
} from "../controllers/event.controller.js";

const router = express.Router();

router.get("/", getEvents);
router.post("/", addEvent);
router.delete("/:id", deleteEvent);
router.put("/:id", updateEvent);

export default router;
