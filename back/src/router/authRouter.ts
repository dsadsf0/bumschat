import { Router } from "express";
import AuthController from "../controllers/authController";

const authRouter = Router()

authRouter.post('/signup', AuthController.signup);
authRouter.post('/login/:username', AuthController.loginCheck);
authRouter.post('/login', AuthController.login);
authRouter.delete('/delete', AuthController.deleteUser);


export default authRouter