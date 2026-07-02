import { Router } from 'express';
import { authorizeAdmin } from '../middlewares/authorize.middleware';
import { RoleTypeEnum } from '../enums/role-type-enum';
import { newsController } from '../controllers/news.controller';

const newsRouter = Router();
newsRouter.get('/', newsController.getAllNews);
newsRouter.get('/:id', newsController.getNewsById);
newsRouter.post('/',authorizeAdmin([RoleTypeEnum.Admin]),  newsController.createNews);
newsRouter.delete('/:id', authorizeAdmin([RoleTypeEnum.Admin]), newsController.deleteNews);

export default newsRouter;