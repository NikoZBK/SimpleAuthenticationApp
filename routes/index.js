import { Router } from 'express';

const router = Router();

/* GET home page. */
router.get('/', (_req, res) => {
  res.send('Hello Express!! 👋');
});

export default router;
