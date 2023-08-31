const { sign_up, verifyToken, sendOtp, verifyOtp } = require("../controller/controller");

const router = require("express").Router();

router.post("/signUp", sign_up);

router.get("/signUp/:id/verify/:token/", verifyToken)

router.post('/generateOtp', sendOtp)
router.post('/verifyOtp', verifyOtp)


module.exports = router;