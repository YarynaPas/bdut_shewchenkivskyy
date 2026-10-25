import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/database';


export interface PsychologyAttributes {
    id: number;
    title: string;
    description: string
    date: Date;
    main_photo: string | null;
    photos: string | null;
    long_description: string | null;
}

export interface UserCreationAttributes extends Optional<PsychologyAttributes, 'id'> {}

export class Psychology extends Model<PsychologyAttributes, UserCreationAttributes> implements PsychologyAttributes {
    id!: number;
    title!: string;
    description!: string;
    date!: Date;
    main_photo!: string | null;
    photos!: string | null;
    long_description!: string | null;
}

Psychology.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        date: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        main_photo: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        photos: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        long_description:{
            type: DataTypes.STRING,
            allowNull:true,
        }
    },
    {
        sequelize,
        tableName: 'psychology',
        modelName: 'Psychology',
        timestamps: false,
        underscored: true,
    }
);
