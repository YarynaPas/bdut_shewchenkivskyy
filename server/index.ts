import express, { NextFunction, Request, Response } from 'express';
import configs from './config/config';
import { ApiError } from './errors/api-error';
import cors from 'cors';
import authRouter from "./routers/auth.router";
import newsRouter from "./routers/news.router";
import eventsRouter from "./routers/events.router";
import accountingRouter from "./routers/accounting.router";
import employeesRouter from "./routers/employees.router";
import path from "path";
import gurtkyRouter from "./routers/gurtky.router";
import nabirRouter from "./routers/nabir.router";
import { userRouter } from "./routers/user.router";
import rozkladRouter from "./routers/rozklad.router";

const app = express();

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(process.cwd(), 'public/uploads')));

app.use('/users', userRouter);
app.use('/auth', authRouter);
app.use('/news', newsRouter);
app.use('/event', eventsRouter);
app.use('/accounting', accountingRouter);
app.use('/employee', employeesRouter);
app.use('/gurtky', gurtkyRouter);
app.use('/nabir', nabirRouter);
app.use('/rozklad', rozkladRouter);

// FIX: '/{*path}' замість '*'
app.use('/{*path}', (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof ApiError) {
        res.status(err.statusCode || 500).send(err.message);
    } else {
        res.status(500).send('Internal Server Error');
    }
});

process.on('uncaughtException', (error) => {
    console.error('uncaughtException', error.message, error.stack);
    process.exit(1);
});

const port = configs.APP_PORT || 3003;
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});