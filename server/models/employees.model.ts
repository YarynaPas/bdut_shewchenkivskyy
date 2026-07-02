import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface EmployeeAttributes {
    id: number;
    full_name: string;
    main_photo: string;
    position: string;
}

export interface EmployeeCreationAttributes extends Optional<EmployeeAttributes, 'id'> {}

export class Employee extends Model<EmployeeAttributes, EmployeeCreationAttributes> implements EmployeeAttributes {
    id!: number;
    full_name!: string;
    main_photo!: string;
    position!: string;
}

Employee.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        full_name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        main_photo: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        position: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: 'employees',
        modelName: 'Employee',
        timestamps: false,
        underscored: true,
    }
);
