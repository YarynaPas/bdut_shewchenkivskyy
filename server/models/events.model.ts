import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface EventAttributes {
    id: number;
    title: string;
    description: string;
    date: Date;
    main_photo: string;
}

export interface EventCreationAttributes extends Optional<EventAttributes, 'id'> {}

export class Event extends Model<EventAttributes, EventCreationAttributes> implements EventAttributes {
    id!: number;
    title!: string;
    description!: string;
    date!: Date;
    main_photo!: string;
}

Event.init(
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
            type: DataTypes.TEXT,
            allowNull: true,
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        main_photo:{
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        sequelize,
        tableName: 'events',
        modelName: 'Event',
        timestamps: false,
        underscored: true,
    }
);
