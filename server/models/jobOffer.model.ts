import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface JobOfferAttributes {
    id: number;
    position: string;
    expririance: string;
    salary: string;
    rozklad: string;
    vidpustka: string;
    likarnyani: string;
}

export interface JobOfferCreationAttributes extends Optional<JobOfferAttributes, 'id'> {}

export class JobOffer extends Model<JobOfferAttributes, JobOfferCreationAttributes>
    implements JobOfferAttributes {
    public id!: number;
    public position!: string;
    public expririance!: string;
    public salary!: string;
    public rozklad!: string;
    public vidpustka!: string;
    public likarnyani!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

JobOffer.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        position: {
            type: DataTypes.STRING(120),
            allowNull: false,
        },
        expririance: {
            type: DataTypes.STRING(30),
            allowNull: false,
        },
        salary: {
            type: DataTypes.STRING(30),
            allowNull: false,
        },
        rozklad: {
            type: DataTypes.STRING(40),
            allowNull: false,
        },
        vidpustka: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        likarnyani: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: 'jobOffers',
        modelName: 'JobOffer',
        timestamps: false,
        underscored: false,
    }
);