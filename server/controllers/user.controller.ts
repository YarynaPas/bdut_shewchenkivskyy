import { Request, Response, NextFunction } from 'express';
import { userService } from '../services/user.service';
import {User} from "../models/user.model";
import {AuthenticatedRequest} from "../types/authenticated-request";

export const getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const users = await userService.getAllUsers();
        res.json(users);
    } catch (error) {
        next(error);
    }
};


export const getUserData = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        const user = await User.findOne({ where: { id: userId } });

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        const { password, ...userData } = user.toJSON();
        res.status(200).json(userData);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        res.status(400).json({ message: 'Invalid id' });
        return;
    }
    try {
        const user = await userService.getUserById(id); // передаємо number
        if (!user) return next(new Error('User not found'));
        res.json(user);
    } catch (error) {
        next(error);
    }
};


