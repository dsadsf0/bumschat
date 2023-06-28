import { Router } from "express";
import AuthController from "../controllers/authController";
import AuthMiddleware from "../middlewares/authMiddleware";

const authRouter = Router()

authRouter.post('/signup', AuthController.signup);
authRouter.get('/login/:username', AuthController.loginCheck);
authRouter.post('/login', AuthController.login);
authRouter.get('/logout/:username', AuthMiddleware.authTokenCheck, AuthController.logout);
authRouter.delete('/delete/:username', AuthMiddleware.authTokenCheck, AuthController.deleteUser);

export default authRouter