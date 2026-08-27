import express from "express";
import { dashboard } from "../controllers/user.controller";

const router = express.Router();

router.get("/dashboard", dashboard);

export default router;
