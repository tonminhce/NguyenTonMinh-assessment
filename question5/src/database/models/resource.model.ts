import { Resource } from '@/interfaces/resource.interfaces';
import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

export type ResourceCreationAttributes = Optional<Resource, 'id' | 'name'>;

export class ResourceModel
    extends Model<Resource, ResourceCreationAttributes>
    implements Resource
{
    public id!: string;
    public name!: string;
    public description!: string;
    public created_at: string | undefined;
    public updated_at: string | undefined;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export default function (sequelize: Sequelize): typeof ResourceModel {
    ResourceModel.init(
        {
            id: {
                primaryKey: true,
                type: DataTypes.UUIDV4,
                defaultValue: DataTypes.UUIDV4,
            },
            name: {
                allowNull: false,
                type: DataTypes.STRING,
            },
            description: {
                allowNull: true,
                type: DataTypes.STRING,
            },
            created_at: DataTypes.DATE,
            updated_at: DataTypes.DATE,
        },
        {
            tableName: 'resources',
            sequelize,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            timestamps: true,
        },
    );

    return ResourceModel;
}
