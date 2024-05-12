import * as express from 'express';
import trainings from './trainings.router';
const router = express.Router();

router.use('/trainings', trainings);

export default router;
