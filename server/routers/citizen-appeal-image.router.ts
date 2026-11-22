
import { Router } from 'express';

import {
    authorizeAdmin
} from '../middlewares/authorize.middleware';

import {
    RoleTypeEnum
} from '../enums/role-type-enum';

import {
    citizenAppealImageController
} from '../controllers/citizen-appeal-image.controller';


const citizenAppealImageRouter = Router();


/* ========================================= */
/* GET ALL IMAGES */
/* ========================================= */

citizenAppealImageRouter.get(
    '/',
    citizenAppealImageController.getAllImages
);


/* ========================================= */
/* CREATE IMAGE */
/* ========================================= */

citizenAppealImageRouter.post(
    '/',
    authorizeAdmin([
        RoleTypeEnum.Admin
    ]),
    citizenAppealImageController.createImage
);


/* ========================================= */
/* UPDATE IMAGE */
/* ========================================= */

citizenAppealImageRouter.put(
    '/:id',
    authorizeAdmin([
        RoleTypeEnum.Admin
    ]),
    citizenAppealImageController.updateImage
);


/* ========================================= */
/* DELETE IMAGE */
/* ========================================= */

citizenAppealImageRouter.delete(
    '/:id',
    authorizeAdmin([
        RoleTypeEnum.Admin
    ]),
    citizenAppealImageController.deleteImage
);


export default citizenAppealImageRouter;
