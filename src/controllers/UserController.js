/**
 * AuthenticateController module.
 *
 * @author Ludwig Wittenberg <lw223cq@student.lnu.se>
 * @version 1.0.0
 */

import { UserModel } from "../models/UserModel.js";

/**
 * Encapsulates a controller.
 */
export class UserController {
	/**
	 * Encapsulates a controller.
	 *
	 * @param { req } req - Express request object.
	 * @param { res } res - Express response object.
	 * @param { next } next - Express next middleware function.
	 */
	login(req, res, next) {
		try {
			res.render("user/login");
		} catch (error) {
			next(error);
		}
	}

	/**
	 * Encapsulates a controller.
	 *
	 * @param { req } req - Express request object.
	 * @param { res } res - Express response object.
	 * @param { next } next - Express next middleware function.
	 */
	async loginPost(req, res, next) {
		try {
			const user = await UserModel.authenticate(
				req.body.username,
				req.body.password,
			);

			req.session.regenerate((error) => {
				if (error) {
					throw new Error("Could not re-generate session");
				}

				req.session.user = user;

				res.locals.user = user;

				req.session.flash = {
					type: "success",
					text: "You are now logged in",
				};

				res.redirect("../");
			});
		} catch (error) {
			console.log(error);
			req.session.flash = {
				type: "danger",
				text: "Wrong username or password",
			};
			res.redirect("../user/login");
		}
	}

	/**
	 * Encapsulates a controller.
	 *
	 * @param { req } req - Express request object.
	 * @param { res } res - Express response object.
	 * @param { next } next - Express next middleware function.
	 */
	logout(req, res, next) {
		try {
			req.session.destroy((error) => {
				if (error) {
					throw new Error("Could not destroy session");
				}

				res.locals.user = null;

				res.clearCookie(process.env.SESSION_NAME);

				res.redirect("../");
			});
		} catch (error) {
			next(error);
		}
	}

	/**
	 * Encapsulates a controller.
	 *
	 * @param { req } req - Express request object.
	 * @param { res } res - Express response object.
	 * @param { next } next - Express next middleware function.
	 */
	register(req, res, next) {
		try {
			res.render("user/register");
		} catch (error) {
			next(error);
		}
	}

	/**
	 * Encapsulates a controller.
	 *
	 * @param { req } req - Express request object.
	 * @param { res } res - Express response object.
	 * @param { next } next - Express next middleware function.
	 * @returns { Promise } - A promise.
	 */
	async registerPost(req, res, next) {
		try {
			const { fullName, username, password, passwordRepeat } = req.body;

			const existingUser = await UserModel.findOne({ username });

			if (existingUser) {
				req.session.flash = {
					type: "danger",
					text: "Username already exists",
				};

				return res.redirect("./user/register");
			}

			if (password.length < 8) {
				req.session.flash = {
					type: "danger",
					text: "Password must be at least 8 characters long",
				};

				return res.redirect("./register");
			}

			if (password !== passwordRepeat) {
				req.session.flash = {
					type: "danger",
					text: "Passwords do not match",
				};

				return res.redirect("./user/register");
			}

			await UserModel.create({
				fullName,
				username,
				password,
			});

			req.session.flash = {
				type: "success",
				text: "Your account was successfully created",
			};

			res.redirect("./login");
		} catch (_error) {
			req.session.flash = {
				type: "danger",
				text: "There was an error while creating your account",
			};
			res.redirect("./user/register");
		}
	}
}
