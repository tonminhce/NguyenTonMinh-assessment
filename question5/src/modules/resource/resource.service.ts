import { Resource } from '@/interfaces/resource.interfaces';
import { repo } from './resource.repo';

export const createResourceService = async (name: string, description: string) => {
    return await repo.createResource(name, description);
}

export const listResourcesService = async (filters: {
    name?: string;
}) => {
    return await repo.listResources(filters);
};

export const getResourceDetailsService = async (id: string) => {
    return await repo.getResourceDetails(id);
};

export const updateResourceService = async (
    id: string,
    updates: Partial<Resource>,
) => {
    return await repo.updateResource(id, updates);
};

export const deleteResourceService = async (id: string) => {
    return await repo.deleteResource(id);
};