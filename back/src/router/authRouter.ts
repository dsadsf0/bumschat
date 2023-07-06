import { Router } from "express";
import AuthController from "../controllers/authController";
import AuthMiddleware from "../middlewares/authMiddleware";

const authRouter = Router()

authRouter.get('/', AuthMiddleware.authCheck, AuthController.authTokenCheck);
authRouter.post('/signup', AuthController.signup);
authRouter.get('/login/:username', AuthController.loginCheck);
authRouter.post('/login', AuthController.login);
authRouter.get('/logout', AuthMiddleware.authCheck, AuthController.logout);
authRouter.delete('/delete', AuthMiddleware.authCheck, AuthController.deleteUser);

export default authRouter