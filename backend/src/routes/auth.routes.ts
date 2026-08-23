import express, {type Request, type Response} from "express";
import { signup, getAllUsers } from "../controllers/auth.controller";

const router = express.Router();

router.post('/signup', signup)
// router.get('/login', login)
router.get('/getAllUsers', getAllUsers)

export default router
