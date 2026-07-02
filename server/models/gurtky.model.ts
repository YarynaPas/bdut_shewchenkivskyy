import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface GurtkyAttributes {
    id:number,
    name:string,
    teacher:string,
    description:string,
    classrom: string,
    pictograma: string,
    long_description: string,
    photos: string
}

export interface GurtkyCreationAttributes extends Optional<GurtkyAttributes, 'id'> {}

export class Gurtky extends Model<GurtkyAttributes, GurtkyCreationAttributes> implements GurtkyAttributes {
    id!:number;
    name!:string;
    teacher!:string;
    description!:string;
    classrom!: string;
    pictograma!: string;
    long_description!: string;
    photos!: string;
}

Gurtky.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true,
        },
        pictograma: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        teacher: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        classrom: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        long_description: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        photos: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    },
    {
        sequelize,
        tableName: 'gyrtky',
        modelName: 'Gurtky',
        timestamps: false,
        underscored: true,
    }
);
