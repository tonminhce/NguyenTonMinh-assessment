import { NextFunction, Request, Response } from 'express';
import {
    createResourceService,
    listResourcesService,
    getResourceDetailsService,
    updateResourceService,
    deleteResourceService,
} from './resource.service';
import logger from '@/utils/logger';

const controllerName = 'resourceController';

export const createResourceController = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        logger.info(`${controllerName}.createResourceController is running.`);
        const { name, description } = req.body;
        await createResourceService(name, description);
        logger.info(
            `${controllerName}.createResourceController - Resource created successfully`,
        );
        res.status(200).json({ message: 'Resource created' });
    } catch (error) {
        logger.error(
            `${controllerName}.createResourceController -  Error creating resource: ${error}`,
        );
        next(error);
    }
};

export const listResourcesController = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        logger.info(`${controllerName}.listResourcesController is running.`);
        const { name } = req.query;
        const filters = {
            name: name as string,
        };
        const resources = await listResourcesService(filters);
        logger.info(
            `${controllerName}.listResourcesController - There are ${resources.length} resources found.`,
        );
        if (resources.length === 0) {
            res.status(404).json({ message: 'No resources found' });
        } else {
            res.status(200).json(resources);
        }
    } catch (error) {
        logger.error(
            `${controllerName}.createResourceController -  Error creating resource: ${error}`,
        );
        next(error);
    }
};

export const getResourceDetailsController = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        logger.info(
            `${controllerName}.getResourceDetailsController is running.`,
        );
        const { id } = req.params;
        const resource = await getResourceDetailsService(id);
        if (!resource) {
            res.status(404).json({ message: 'Resource not found' });
        } else {
            res.status(200).json(resource);
        }
    } catch (error) {
        logger.error(
            `${controllerName}.getResourceDetailsController -  Error getting resource details: ${error}`,
        );
        next(error);
    }
};

export const updateResourceController = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        logger.info(`${controllerName}.updateResourceController is running.`);
        const { id } = req.params;
        const updates = req.body;
        const [affectedCount, affectedRows] = await updateResourceService(
            id,
            updates,
        );
        logger.info(
            `${controllerName}.updateResourceController - ${affectedCount} resource updated.`,
        );
        if (affectedCount === 0) {
            res.status(404).json({ message: 'Resource not found' });
        } else {
            res.status(200).json({
                message: 'Resource updated',
                resource: affectedRows[0],
            });
        }
    } catch (error) {
        logger.error(
            `${controllerName}.updateResourceController -  Error updating resource: ${error}`,
        );
        next(error);
    }
};

export const deleteResourceController = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        logger.info(`${controllerName}.deleteResourceController is running.`);
        const { id } = req.params;
        const deletedCount = await deleteResourceService(id);
        logger.info(
            `${controllerName}.deleteResourceController - ${deletedCount} resource deleted.`,
        );
        if (deletedCount === 0) {
            res.status(404).json({ message: 'Resource not found' });
        } else {
            res.status(200).json({ message: 'Resource deleted' });
        }
    } catch (error) {
        logger.error(
            `${controllerName}.deleteResourceController -  Error deleting resource: ${error}`,
        );
        next(error);
    }
};
