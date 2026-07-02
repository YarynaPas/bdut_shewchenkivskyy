import { Router } from 'express';
import { authorizeAdmin } from '../middlewares/authorize.middleware';
import { RoleTypeEnum } from '../enums/role-type-enum';
import {gurtkyController} from "../controllers/gurtky.controller";
const gurtkyRouter = Router();
gurtkyRouter.get('/', gurtkyController.getAllGurtky);
gurtkyRouter.get('/:id', gurtkyController.getGurtkyById);
gurtkyRouter.post('/',  gurtkyController.createGurtky);
gurtkyRouter.delete('/:id', gurtkyController.deleteGurtky);

export default gurtkyRouter;