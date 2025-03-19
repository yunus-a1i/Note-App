import { connectToDB } from "../utils/connect.js";
import Todo from "../models/todoModel.js";
import { createError } from "../utils/error.js";
import mongoose from "mongoose";

export async function getAllTodos(req, res, next) {
  await connectToDB();
  const todos = await Todo.find({ userID: req.user.id });
  res.status(200).send(todos);
}

export async function getTodo(req, res, next) {
  try {
    await connectToDB();

    // Validate if the ID is a valid MongoDB ObjectId
    if (!mongoose.isValidObjectId(req.params.id)) {
      return next(createError(400, "Invalid Todo ID"));
    }

    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      return next(createError(404, "Todo not found"));
    }

    // Check if the logged-in user is authorized to access this todo
    if (todo.userID.toString() !== req.user.id) {
      return next(createError(403, "Not Authorized!"));
    }

    res.status(200).json(todo);
  } catch (error) {
    next(createError(500, "Internal Server Error"));
  }
}

export async function addTodo(req, res, next) {
  console.log(req.body);
  if (!req.body || !req.body.title) {
    return next(createError(404, "Title is Required"));
  }
  await connectToDB();
  const newTodo = new Todo({
    title: req.body.title,
    userID: req.user.id,
  });
  await newTodo.save();
  res.status(201).json(newTodo);
}

export async function updateTodo(req, res, next) {
  try {
    await connectToDB();

    const id = req.params.id;

    // Validate ID format
    if (!mongoose.isValidObjectId(id)) {
      return next(createError(400, "Invalid Todo ID"));
    }

    // Ensure at least one field is provided for update
    if (!req.body.title && req.body.isCompleted === undefined) {
      return next(createError(400, "Missing fields"));
    }

    const todo = await Todo.findById(id);

    if (!todo) {
      return next(createError(404, "Todo Not Found"));
    }

    // Check if user is authorized to update the todo
    if (todo.userID.toString() !== req.user.id) {
      return next(createError(403, "Not Authorized!"));
    }

    // Update fields if they exist in the request body
    if (req.body.title) {
      todo.title = req.body.title;
    }

    if (req.body.isCompleted !== undefined) {
      todo.isCompleted = Boolean(req.body.isCompleted);
    }

    await todo.save();
    res.status(200).json({ message: "Todo Updated!" });
  } catch (error) {
    return next(createError(500, "Internal Server Error"));
  }
}
export async function deleteTodo(req, res, next) {
  try {
    await connectToDB();
    const todo = await Todo.deleteOne({
      _id: req.params.id,
      userID: req.user.id,
    });
    if (!todo.deletedCount) return next(createError(400, "Todo Not Found!"));
    res.status(200).json({ message: "Todo deleted!" });
  } catch (error) {
    return next(createError(500, "Internal Server Error"));
  }
}
