import { DB } from '@/database';
import { Resource } from '@/interfaces/resource.interfaces';
import { Op } from 'sequelize';

export const repo = {
    createResource: async (
        name: string,
        description: string,
    ): Promise<Resource> => {
        const resource = await DB.Resources.create({ name, description });
        return resource;
    },
    listResources: async (filters: { name?: string }): Promise<Resource[]> => {
        const whereClause: any = {};
        if (filters.name) {
            whereClause.name = { [Op.like]: `%${filters.name}%` };
        }
        const resources = await DB.Resources.findAll({
            where: whereClause,
            attributes: ['name', 'description'],
        });
        return resources;
    },
    getResourceDetails: async (id: string): Promise<Resource | null> => {
        const resource = await DB.Resources.findByPk(id);
        return resource;
    },
    updateResource: async (
        id: string,
        updates: Partial<Resource>,
    ): Promise<[number, Resource[]]> => {
        const [affectedCount, affectedRows] = await DB.Resources.update(
            updates,
            {
                where: { id },
                returning: true,
            },
        );
        return [affectedCount, affectedRows];
    },
    deleteResource: async (id: string): Promise<number> => {
        const deletedCount = await DB.Resources.destroy({
            where: { id },
        });
        return deletedCount;
    },
};
