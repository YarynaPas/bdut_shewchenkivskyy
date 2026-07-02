import {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';
import configs from '../config/config';

export const authenticateUser = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        res.status(401).json({message: 'Authorization header is missing'});
        return;
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, configs.JWT_SECRET);
        (req as any).user = decoded;
        next();
    } catch (error) {
        res.status(401).json({message: 'Invalid or expired token'});
    }
};
