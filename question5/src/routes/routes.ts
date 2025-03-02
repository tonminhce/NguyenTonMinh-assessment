import resourceRouter from '@/modules/resource/resource.routes';
import express from 'express';

const router = express.Router();

router.use('/resource', resourceRouter);

export default router;
