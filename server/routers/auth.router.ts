import {Router} from 'express';
import {AuthController} from '../controllers/auth.controller';
import {validateUserData} from '../middlewares/validateUserData';

const router = Router();
const authController = new AuthController();

router.post('/signup', validateUserData, authController.signUp);
router.post('/signin', validateUserData, authController.signIn);
export default router;
