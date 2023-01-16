import express from 'express';
import locationRoute from './location';
import schoolRoute from './school';
import userRouter from './user';
import classRouter from './class';

var router = express.Router();

router.use('/location', locationRoute);
router.use('/school', schoolRoute);
router.use('/user', userRouter);
router.use('/class', classRouter);

router.get('/health-check', (req, res) => {
   res.send("Health is running completely fine")
});

export default router;