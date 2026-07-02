import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface NabirAttributes {
    id: number;
    name: string | null;
    amount: string | null;
    number: string | null;
    vik: string | null;
    teacher: string | null;
    rozklad: string | null;
    auditory: string | null;
    pictogram: string | null;
}

export interface NabirCreationAttributes extends Optional<NabirAttributes, 'id'> {}

export class Nabir extends Model<NabirAttributes, NabirCreationAttributes> implements NabirAttributes {
     id!: number;
     name!: string | null;
     amount!: string | null;
     number!: string | null;
     vik!: string | null;
     teacher!: string | null;
     rozklad!: string | null;
     auditory!: string | null;
     pictogram!: string | null;
}

Nabir.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING(120),
            allowNull: true,
        },
        amount: {
            type: DataTypes.STRING(3),
            allowNull: true,
        },
        number: {
            type: DataTypes.STRING(3),
            allowNull: true,
        },
        vik: {
            type: DataTypes.STRING(20),
            allowNull: true,
        },
        teacher: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        rozklad: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        auditory: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        pictogram: {
            type: DataTypes.STRING(256),
            allowNull: true,
        },
    },
    {
        sequelize,
        tableName: 'nabir',
        modelName: 'Nabir',
        timestamps: false,
        underscored: true,
    }
);