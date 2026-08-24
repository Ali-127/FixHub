import express, {type Request, type Response} from "express";
import { signup, login, getAllUsers } from "../controllers/auth.controller";

const router = express.Router();

router.post('/signup', signup)
router.post('/login', login)
router.get('/getAllUsers', getAllUsers)

export default router
