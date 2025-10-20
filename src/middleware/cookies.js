function validCookie(req, res, next) {
  console.log("Cookies")

  next()
}

export { validCookie }