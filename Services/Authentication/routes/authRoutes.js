const express = require("express");
const { register, login } = require("../controllers/authcontroller");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.get("/profile", authMiddleware, (req, res) => {
    console.log(req.user.id);
    console.log(req.user.role);
    res.json({ message: "Geautoriseerd!" });
});

module.exports = router;
