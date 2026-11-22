
import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface CitizenAppealImageAttributes {
    id: number;
    title: string;
    image_path: string;
    sort_order: number;
    created_at: Date;
}

export interface CitizenAppealImageCreationAttributes
    extends Optional<CitizenAppealImageAttributes, 'id' | 'sort_order' | 'created_at'> {}

export class CitizenAppealImage
    extends Model<CitizenAppealImageAttributes, CitizenAppealImageCreationAttributes>
    implements CitizenAppealImageAttributes {

    id!: number;
    title!: string;
    image_path!: string;
    sort_order!: number;
    created_at!: Date;
}

CitizenAppealImage.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        title: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        image_path: {
            type: DataTypes.STRING(500),
            allowNull: false,
        },
        sort_order: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize,
        tableName: 'citizen_appeal_images',
        modelName: 'CitizenAppealImage',
        timestamps: false,
        underscored: true,
    }
);
