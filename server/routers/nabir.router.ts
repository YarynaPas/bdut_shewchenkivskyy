import { Router } from 'express';
import { authorizeAdmin } from '../middlewares/authorize.middleware';
import { RoleTypeEnum } from '../enums/role-type-enum';
import {nabirController} from "../controllers/nabir.controller";

const nabirRouter = Router();
nabirRouter.get('/', nabirController.getAllNabir);
nabirRouter.get('/:id', nabirController.getNabirById);
nabirRouter.post('/',authorizeAdmin([RoleTypeEnum.Admin]),  nabirController.createNabir);
nabirRouter.delete('/:id', authorizeAdmin([RoleTypeEnum.Admin]), nabirController.deleteNabir);

export default nabirRouter;