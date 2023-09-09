import path from 'path';
import express from 'express';

const apisRouter = express.Router();

apisRouter.get('/dashboard', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../../pages/dashboard.html'), (err) => {
    console.log(err);
    res.status(404).send('NOT FOUND')
  });
});

export default apisRouter;
