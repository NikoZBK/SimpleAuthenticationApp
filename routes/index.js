const express = require('express');

const router = express.Router();

/* GET home page. */
router.get('/', (_req, res) => {
  res.send('Hello Express!! 👋');
});

module.exports = router;
