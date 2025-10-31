/**
 * @file Defines the task router.
 * @module routes/taskRouter
 * @author Mats Loock
 * @version 3.0.0
 */

import express from "express";
import { TaskController } from "../controllers/TaskController.js";
import { isSession } from "../middleware/Authorization.js";

export const router = express.Router();

const controller = new TaskController();

// Provide req.doc to the route if :id is present in the route path.
router.param("id", (req, res, next, id) =>
	controller.loadTaskDocument(req, res, next, id),
);

// Map HTTP verbs and route paths to controller action methods.
router.get("/", isSession, (req, res, next) => controller.index(req, res, next));

router.get("/create", isSession, (req, res, next) =>
	controller.create(req, res, next),
);

router.post("/create", isSession, (req, res, next) =>
	controller.createPost(req, res, next),
);

router.get("/:id/update", isSession, (req, res, next) =>
	controller.update(req, res, next),
);
router.post("/:id/update", isSession, (req, res, next) =>
	controller.updatePost(req, res, next),
);

router.get("/:id/delete", isSession, (req, res, next) =>
	controller.delete(req, res, next),
);
router.post("/:id/delete", isSession, (req, res, next) =>
	controller.deletePost(req, res, next),
);
