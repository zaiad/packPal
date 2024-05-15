const express = require("express");
const router = express.Router();
const statistic = require("../controllers/statistic");

router.get("/", statistic.calculateTotlal);



module.exports = router;