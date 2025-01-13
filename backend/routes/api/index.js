const router = require('express').Router(); // create express router


// test api route
router.post('/test', function (req, res) {
	res.json({ requestBody: req.body });
});

module.exports = router;
