import {User} from "../models/user.model";
import {ApiError} from "../errors/api-error";


export class UserService {
    async getAllUsers() {
        return await User.findAll();
    }

    async getUserById(id: number) {
        return await User.findByPk(id);
    }

    async getUserData(userId: number) {
        const user = await User.findByPk(userId);

        if (!user) {
            throw ApiError.notFound('Користувач не знайдений');
        }

        return user;
    }
}

export const userService = new UserService();
