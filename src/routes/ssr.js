import express from 'express';

const router = express.Router();

router.get('/', async(req, res)=>{
  res.status(201).send('ssr');
});

export default router;