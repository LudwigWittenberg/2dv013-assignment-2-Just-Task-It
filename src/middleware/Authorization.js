/**
 * Authorizes a user to access a page.
 *
 * @param { req } req - Express request object.
 * @param { res } res - Express response object.
 * @param { next } next - Express next middleware function.
 */
function isNotSession(req, res, next) {
	if (!req.session.user) {
		const error = new Error("Not Found");
		error.status = 404;
		next(error);
	} else {
		next();
	}
}

/**
 * Authorizes a user to access a page.
 *
 * @param { req } req - Express request object.
 * @param { res } res - Express response object.
 * @param { next } next - Express next middleware function.
 */
function isSession(req, res, next) {
	if (!req.session.user) {
		const error = new Error("Not Found");
		error.status = 404;
		next(error);
	} else {
		next();
	}
}

/**
 * Authorizes a user to access a page.
 *
 * @param { req } req - Express request object.
 * @param { res } res - Express response object.
 * @param { next } next - Express next middleware function.
 */
function isUserAuthenticated(req, res, next) {
	if (req.session.user) {
		const error = new Error("Not Found");
		error.status = 404;
		next(error);
	} else {
		next();
	}
}

export { isSession, isNotSession, isUserAuthenticated };