import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { ApiError } from '../errors/api-error';
import { RoleTypeEnum } from "../enums/role-type-enum";

const authService = new AuthService();

export class AuthController {
    async signUp(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { login, password } = req.body;

            if (!login || !password) {
                return next(ApiError.badRequest('Логін та пароль є обов\'язковими'));
            }

            const user = await authService.signUp({
                login,
                password,
                role: RoleTypeEnum.User // Автоматично встановлюємо роль USER
            });

            res.status(201).json({ message: 'Реєстрація успішна', user });
        } catch (error) {
            console.error("Error in signUp:", error);
            next(ApiError.internal('Помилка при реєстрації користувача'));
        }
    }


    async signIn(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { login, password } = req.body;

            if (!login || !password) {
                return next(ApiError.badRequest('Логін та пароль є обов\'язковими'));
            }

            const authData = await authService.signIn(login, password);

            res.status(200).json({ message: 'Увійшли успішно', ...authData });
        } catch (error) {
            console.error("Error in signIn:", error);
            next(ApiError.internal('Помилка при вході користувача'));
        }
    }
}
