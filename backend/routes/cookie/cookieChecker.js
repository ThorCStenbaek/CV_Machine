function checkCookie(req, res, next) {
  if (req.signedCookies.user) {
    next();  // Proceed to the next middleware or route handler
  } else {
    res.status(401).send('No valid signed cookie found');
  }
}

module.exports = checkCookie;