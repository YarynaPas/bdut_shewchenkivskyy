import { Model, DataTypes, Optional } from "sequelize";
import { sequelize } from "../config/database";

export type Napryam =
    | "Художньо-естетичний відділ"
    | "Гуманітарний відділ"
    | "Вокально-хореографічний відділ";

export interface GurtkyAttributes {
    id: number;
    name: string;
    teacher: string;
    napryam: Napryam;
    vikova_grupa: string;
    description: string;
    classrom: string;
    pictograma: string;
    long_description: string;
    photos: string;
}

export interface GurtkyCreationAttributes
    extends Optional<GurtkyAttributes, "id"> {}

export class Gurtky
    extends Model<GurtkyAttributes, GurtkyCreationAttributes>
    implements GurtkyAttributes
{
    id!: number;
    name!: string;
    teacher!: string;
    napryam!: Napryam;
    vikova_grupa!: string;
    description!: string;
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
            allowNull: false,
            unique: true,
        },

        teacher: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        napryam: {
            type: DataTypes.ENUM(
                "Художньо-естетичний відділ",
                "Гуманітарний відділ",
                "Вокально-хореографічний відділ"
            ),
            allowNull: false,
        },

        vikova_grupa: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },

        classrom: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        pictograma: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        long_description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },

        photos: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    },
    {
        sequelize,
        tableName: "gyrtky",
        modelName: "Gurtky",
        timestamps: false,
        underscored: true,
    }
);