import {Router} from 'express';
import {errorHandler} from '../middlewares/error.middleware';
import {getUserById, getUserData, getUsers} from "../controllers/user.controller";
import {authenticateUser} from "../middlewares/auth.middleware";
const userRouter = Router();

userRouter.get('/user', authenticateUser, getUserData);
userRouter.get('/', getUsers);
userRouter.get('/:id', getUserById);
userRouter.use(errorHandler);

export {userRouter};

