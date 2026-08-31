import express from "express";
import { dashboard } from "../controllers/user.controller";
import { verifyToken } from "../middlewares/auth.middleware";

const router = express.Router();

router.get("/dashboard", verifyToken, dashboard);

export default router;
