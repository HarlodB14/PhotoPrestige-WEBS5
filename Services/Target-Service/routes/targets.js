const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const targetController = require("../controllers/TargetController");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

const upload = multer({ storage });

router.get("/", targetController.getAllTargets);
router.post("/", upload.single("image"), targetController.createTarget);
router.delete("/:id", targetController.deleteTarget);

module.exports = router;