import { Router } from 'express';
import { authorizeAdmin } from '../middlewares/authorize.middleware';
import { RoleTypeEnum } from '../enums/role-type-enum';
import {nabirController} from "../controllers/nabir.controller";
import {rozkladController} from "../controllers/rozklad.controller";

const rozkladRouter = Router();
rozkladRouter.get('/', rozkladController.getAllRozklad);
rozkladRouter.get('/:id', rozkladController.getRozkladById);
rozkladRouter.post('/',authorizeAdmin([RoleTypeEnum.Admin]),  rozkladController.createRozklad);
rozkladRouter.delete('/:id', authorizeAdmin([RoleTypeEnum.Admin]), rozkladController.deleteRozklad);

export default rozkladRouter;