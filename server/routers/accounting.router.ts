import {Router} from 'express';
import {authorizeAdmin} from '../middlewares/authorize.middleware';
import {RoleTypeEnum} from '../enums/role-type-enum';
import {accountingController} from '../controllers/accounting.controller';

const accountingRouter = Router();
accountingRouter.get('/', accountingController.getAllAccounting);
accountingRouter.get('/:id', accountingController.getAccountingById);
accountingRouter.post('/',authorizeAdmin([RoleTypeEnum.Admin, RoleTypeEnum.Accountant]),  accountingController.createAccounting);
accountingRouter.put('/:id', authorizeAdmin([RoleTypeEnum.Accountant,  RoleTypeEnum.Admin]),accountingController.updateAccounting);
accountingRouter.delete('/:id', authorizeAdmin([RoleTypeEnum.Accountant, RoleTypeEnum.Admin,]), accountingController.deleteAccounting);

export default accountingRouter;