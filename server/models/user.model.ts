import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import { RoleTypeEnum } from '../enums/role-type-enum';

export interface UserAttributes {
    id: number;
    login: string;
    password: string;
    role: RoleTypeEnum;
}

export interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    id!: number;
    login!: string;
    role!: RoleTypeEnum;
    password!: string;
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        login: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        role: {
            type: DataTypes.ENUM(...Object.values(RoleTypeEnum)),
            allowNull: false
        },
    },
    {
        sequelize,
        tableName: 'users',
        modelName: 'User',
        timestamps: false,
        underscored: true,
    }
);
