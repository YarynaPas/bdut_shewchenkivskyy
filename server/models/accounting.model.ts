import {DataTypes, Model, Optional} from "sequelize";
import {sequelize} from "../config/database";
import {AccountingTypeEnum} from "../enums/accounting-type-enum";
export interface AccountingAttributes {
    id: number;
    category: AccountingTypeEnum;
    name: string;
    date: Date;
    photos: string;
    year: number;
    pid_category: string;
}

export interface AccountingCreationAttributes extends Optional<AccountingAttributes, 'id'> {}
export class Accounting extends Model<AccountingAttributes, AccountingCreationAttributes> implements AccountingAttributes {
    id!: number;
    category!: AccountingTypeEnum;
    name!: string;
    date!: Date;
    photos!: string;
    year!: number;
    pid_category!: string;
}

Accounting.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        category: {
            type: DataTypes.ENUM(...Object.values(AccountingTypeEnum)),
            allowNull: false,
            unique: true,
        },
        name: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        date: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        photos: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        year: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: new Date().getFullYear(),
        },
        pid_category:{
            type: DataTypes.STRING,
            allowNull: true,
        }
    },
    {
        sequelize,
        tableName: 'accounting',
        modelName: 'Accounting',
        timestamps: false,
        underscored: true,
    }
);
