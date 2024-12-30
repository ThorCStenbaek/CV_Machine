const express = require('express');
const router = express.Router();

const {user, userRoles} = require('./../../util/database/database');

const {generateToken, authenticateToken} = require('../../util/jwt/jwtUtils');

router.post('/set-token', (req, res) => {
  const { identifier, password } = req.body;
  user.loginUser(identifier, password, (err, result) => {
    if (err) {
      return res.status(500).send('An error occurred during login.');
    }
    if (result === false) {
      return res.status(401).send('Login unsuccessful. Identifier not found or password incorrect.');
    }

    const token = generateToken(identifier);  // Generate JWT for the logged-in user
    res.send({ token });  // Send the generated token back to the client
  });
});


router.get('/check-token', authenticateToken, (req, res) => {
  res.json({ success: true, message: `Hello ${req.user.identifier}` });  // Access `identifier` from token
});



module.exports= router;