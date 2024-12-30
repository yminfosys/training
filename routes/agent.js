var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('agent/home', { title: 'Express' });
});

router.get('/user', function(req, res, next) {
  res.render('agent/agent', { title: 'Express' });
});

module.exports = router;
