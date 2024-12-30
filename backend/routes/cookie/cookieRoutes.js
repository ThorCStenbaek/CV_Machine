// cookieRoutes.js
const express = require('express');
const router = express.Router();
const { user } = require('../../util/database/database'); // Import the routes

router.post('/set-cookie', (req, res) => {
  // Change email to identifier for clarity
  const { identifier, password } = req.body;
  console.log("Identifier:", req.body);
  console.log("Password:", password);
  user.loginUser(identifier, password, (err, result) => {
    if (err) {
      return res.status(500).send('An error occurred during login.');
    }

    if (result === false) {
      return res.status(401).send('Login unsuccessful. Identifier not found or password incorrect.');
    }

    // If login is successful, set the cookie with the user's identifier
    res.cookie('user', identifier, { signed: true });
    res.send('Signed cookie set');
  });
});

router.get('/check-cookie', (req, res) => {
  // Access the signed cookie
  if (req.signedCookies.user) {
    // Return a JSON response with success status
    res.json({ success: true, message: `Hello ${req.signedCookies.user}` });
  } else {
    // Return a JSON response indicating failure and no valid signed cookie was found
    res.json({ success: false, message: 'No valid signed cookie found' });
  }
});



router.post('/logout', (req, res) => {
  // Check if the cookie exists
  if (req.signedCookies.user) {
    // Clear the cookie named 'user'
    res.clearCookie('user');
    res.send('User logged out successfully');
  } else {
    res.send('No user currently logged in');
  }
});










module.exports = router;
