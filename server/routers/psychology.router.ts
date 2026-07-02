import { Router } from 'express';
import { authorizeAdmin } from '../middlewares/authorize.middleware';
import { RoleTypeEnum } from '../enums/role-type-enum';
import { psychologyController } from '../controllers/psychology.controller';

const psychologyRouter = Router();
psychologyRouter.get('/', psychologyController.getAllPsychology);
psychologyRouter.get('/:id', psychologyController.getPsychologyById);
psychologyRouter.post('/',authorizeAdmin([RoleTypeEnum.Psychologist,  RoleTypeEnum.Admin]),  psychologyController.createPsychology);
psychologyRouter.delete('/:id', authorizeAdmin([RoleTypeEnum.Psychologist,  RoleTypeEnum.Admin]), psychologyController.deletePsychology);

export default psychologyRouter;