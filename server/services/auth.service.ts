import { User } from '../models/user.model';
import { ApiError } from '../errors/api-error';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import configs from '../config/config';
import { RoleTypeEnum } from "../enums/role-type-enum";

export class AuthService {
    public async signUp(userData: { login: string; password: string; role: RoleTypeEnum }): Promise<any> {
        const existingUser = await User.findOne({ where: { login: userData.login } });

        if (existingUser) {
            throw ApiError.badRequest('Користувач з таким логіном вже існує');
        }

        const hashedPassword = await bcrypt.hash(userData.password, 10);

        const newUser = await User.create({
            login: userData.login,
            password: hashedPassword,
            role: userData.role
        });

        return { id: newUser.id, login: newUser.login, role: newUser.role };
    }

    public async signIn(login: string, password: string): Promise<any> {
        const user = await User.findOne({ where: { login } });

        if (!user) {
            throw ApiError.badRequest('Невірний логін або пароль');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw ApiError.badRequest('Невірний логін або пароль');
        }
        const token = jwt.sign(
            { id: user.id, login: user.login, role: user.role },
            configs.JWT_SECRET as string,
            { expiresIn: '12h' }
        );

        return { user: { id: user.id, login: user.login, role: user.role }, token };
    }
}
