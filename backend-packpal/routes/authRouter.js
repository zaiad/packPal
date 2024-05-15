const router = require("express").Router();
const authController = require("../controllers/authController");
const tryCatch = require("../middleware/authMiddleware");
const errorHandller = require("../middleware/errorHandller");

router.post("/register", tryCatch,authController.register);
router.post("/login", tryCatch(authController.login));
router.post("/logout", tryCatch(authController.logout));
router.post("/verify_email/:token", tryCatch(authController.verifyEmail));

router.use(errorHandller);

module.exports = router;
