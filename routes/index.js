var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('force', { title: 'Force graph' });
});

router.get('/force', function(req, res, next) {
  res.render('force', { title: 'Force graph' });
});

router.get('/tilford', function(req, res, next) {
  res.render('tilford', { title: 'Tilford graph' });
});

router.get('/tilford-flat', function(req, res, next) {
  res.render('tilford-flat', { title: 'Tilford flat graph' });
});

module.exports = router;
