import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface NewsAttributes {
    id: number;
    title: string;
    description: string;
    short_description: string;
    date: Date;
    main_photo: string | null;
    photos: string | null;
}

export interface UserCreationAttributes extends Optional<NewsAttributes, 'id'> {}

export class News extends Model<NewsAttributes, UserCreationAttributes> implements NewsAttributes {
    id!: number;
    title!: string;
    description!: string;
    short_description!: string;
    date!: Date;
    main_photo!: string | null;
    photos!: string | null;
}

News.init(
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
        short_description: {
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
    },
    {
        sequelize,
        tableName: 'news',
        modelName: 'News',
        timestamps: false,
        underscored: true,
    }
);
