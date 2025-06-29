import {Router} from "express";
import {register} from "../controllers/registercontroller.js";
import authenticate from "../../Authentication/middleware/authMiddleware.js";

const router = Router();
router.post("/", authenticate, register);
export default router;
