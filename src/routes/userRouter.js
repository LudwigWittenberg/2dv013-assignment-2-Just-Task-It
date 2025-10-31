/**
 * loginRouter module.
 *
 * @author Ludwig Wittenberg <lw223cq@student.lnu.se>
 * @version 1.0.0
 */

import express from "express";
import { UserController } from "../controllers/UserController.js";
import { isNotSession, isSession } from "../middleware/Authorization.js";

const router = express.Router();

const controller = new UserController();

router.get("/login", isSession, (req, res, next) =>
	controller.login(req, res, next),
);
router.post("/login", isSession, (req, res, next) =>
	controller.loginPost(req, res, next),
);

router.get("/logout", isNotSession, (req, res, next) =>
	controller.logout(req, res, next),
);

router.get("/register", isSession, (req, res, next) =>
	controller.register(req, res, next),
);
router.post("/register", isSession, (req, res, next) =>
	controller.registerPost(req, res, next),
);

export { router };
