import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { User } from '../models/user.model';
import { RoleTypeEnum } from '../enums/role-type-enum';
import { AuthenticatedRequest } from '../types/authenticated-request';

export const authorizeAdmin = (roles: RoleTypeEnum[]) => {
    return async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            const authHeader = req.headers.authorization;

            if (!authHeader) {
                console.error('Authorization header is missing');
                res.status(401).json({ message: 'No token provided' });
                return;
            }

            const token = authHeader.split(' ')[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret') as JwtPayload & {
                id: number;
            };

            if (!decoded.id) {
                console.error('Invalid token payload: missing user ID');
                res.status(401).json({ message: 'Invalid token' });
                return;
            }

            const user = await User.findByPk(decoded.id);

            if (!user) {
                console.error('User not found');
                res.status(403).json({ message: 'Forbidden' });
                return;
            }

            if (!roles.includes(user.role as RoleTypeEnum)) {
                console.error(`User role '${user.role}' does not have access`);
                res.status(403).json({ message: 'Forbidden' });
                return;
            }

            req.user = user;
            next();
        } catch (error: any) {
            console.error('Authorization error:', error.message || error);
            res.status(401).json({ message: 'Invalid token' });
        }
    };
};
