import { Router } from "express";

import {
    authorizeAdmin
} from "../middlewares/authorize.middleware";

import {
    RoleTypeEnum
} from "../enums/role-type-enum";

import {
    eventsController
} from "../controllers/events.controller";


const eventsRouter = Router();


/* ========================================= */
/* GET ALL */
/* ========================================= */

eventsRouter.get(
    "/",
    eventsController.getAllEvents
);


/* ========================================= */
/* GET BY ID */
/* ========================================= */

eventsRouter.get(
    "/:id",
    eventsController.getEventById
);


/* ========================================= */
/* CREATE */
/* ========================================= */

eventsRouter.post(
    "/",
    authorizeAdmin([
        RoleTypeEnum.Admin
    ]),
    eventsController.createEvents
);


/* ========================================= */
/* UPDATE */
/* ========================================= */

eventsRouter.put(
    "/:id",
    authorizeAdmin([
        RoleTypeEnum.Admin
    ]),
    eventsController.updateEvents
);


/* ========================================= */
/* DELETE */
/* ========================================= */

eventsRouter.delete(
    "/:id",
    authorizeAdmin([
        RoleTypeEnum.Admin
    ]),
    eventsController.deleteEvents
);


export default eventsRouter;