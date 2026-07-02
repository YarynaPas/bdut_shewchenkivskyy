import { Router } from 'express';
import { authorizeAdmin } from '../middlewares/authorize.middleware';
import { RoleTypeEnum } from '../enums/role-type-enum';
import {employeeController} from "../controllers/employee.controller";

const employeesRouter = Router();
employeesRouter.get('/', employeeController.getAllEmployees);
employeesRouter.get('/:id', employeeController.getEmployeeById);
employeesRouter.post('/',authorizeAdmin([RoleTypeEnum.Admin]),  employeeController.createEmployee);
employeesRouter.delete('/:id', authorizeAdmin([RoleTypeEnum.Admin]), employeeController.deleteEmployee);

export default employeesRouter;