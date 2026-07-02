import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface RozkladAttributes {
    id: number;
    photo: string;
}

export interface RozkladCreationAttributes extends Optional<RozkladAttributes, 'id'> {}

export class Rozklad extends Model<RozkladAttributes, RozkladCreationAttributes> implements RozkladAttributes {
    id!: number;
    photo!: string;
}

Rozklad.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        photo:{
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        sequelize,
        tableName: 'rozklad',
        modelName: 'Rozklad',
        timestamps: false,
        underscored: true,
    }
);
