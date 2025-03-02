import express from 'express';
import {
    createResourceController,
    deleteResourceController,
    getResourceDetailsController,
    listResourcesController,
    updateResourceController,
} from './resource.controller';

const resourceRouter = express.Router();

resourceRouter.post('/create', createResourceController);
resourceRouter.get('/list', listResourcesController);
resourceRouter.get('/get/:id', getResourceDetailsController);
resourceRouter.put('/update/:id', updateResourceController);
resourceRouter.delete('/delete/:id', deleteResourceController);

export default resourceRouter;
