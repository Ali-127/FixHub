import express from "express";
import {
  signup,
  login,
  getAllUsers,
  refresh,
  logout,
  me,
} from "../controllers/auth.controller";
import { verifyToken } from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh", refresh);
router.get("/getAllUsers", verifyToken, getAllUsers);
router.get("/me", verifyToken, me);

export default router;
