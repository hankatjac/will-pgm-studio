import express from "express";
import {
  addTodo,
  deleteTodo,
  getTodo,
  getTodos,
  updateTodo,
} from "../controllers/todo.controller.js";

const router = express.Router();

router.get("/", getTodos);
router.get("/:id", getTodo);
router.post("/", addTodo);
router.delete("/:id", deleteTodo);
router.put("/:id", updateTodo);

export default router;
