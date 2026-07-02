import { Router } from 'express';
import { authorizeAdmin } from '../middlewares/authorize.middleware';
import { RoleTypeEnum } from '../enums/role-type-enum';
import { eventsController } from '../controllers/events.controller';

const eventsRouter = Router();
eventsRouter.get('/', eventsController.getAllEvents);
eventsRouter.get('/:id', eventsController.getEventById);
eventsRouter.post('/',authorizeAdmin([RoleTypeEnum.Admin]),  eventsController.createEvents);
eventsRouter.delete('/:id', authorizeAdmin([RoleTypeEnum.Admin]), eventsController.deleteEvents);

export default eventsRouter;