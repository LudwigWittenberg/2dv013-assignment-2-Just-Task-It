/**
 * The user model.
 *
 * @author Ludwig Wittenberg <lw223cq@student.lnu.se>
 * @version 1.0.0
 */

import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { BASE_SCHEMA } from "./baseSchema.js";

// ------------Create a schema------------ //
const schema = new mongoose.Schema(
	{
		fullName: {
			type: String,
			required: true,
			minlength: 1,
			maxlength: 100,
			trin: true,
		},
		username: {
			type: String,
			required: true,
			minlength: 1,
			maxlength: 50,
			trin: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
			minlength: [8, "Password must be at least 8 characters long"],
			maxlength: 2000,
		},
	},
	{
		timestamps: true,
	},
);

schema.add(BASE_SCHEMA);

schema.pre("save", async function () {
	this.password = await bcrypt.hash(this.password, 10);
});

/**
 * Authenticates a user.
 *
 * @param { username } username - The username.
 * @param { password } password - The password.
 * @returns { Promise<UserModel> } The authenticated user.
 */
schema.statics.authenticate = async function (username, password) {
	const user = await this.findOne({ username });

	if (!user || !(await bcrypt.compare(password, user.password))) {
		throw new Error("Invalid login attempt");
	}

	return user;
};

const UserModel = mongoose.model("User", schema);

export { UserModel };
