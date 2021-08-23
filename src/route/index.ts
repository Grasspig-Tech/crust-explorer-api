import express, {Express} from 'express';
import catchErrorMiddleware from './middleware/err';
import blockRoute from './module/block';
import LogMiddle from './middleware/log';
import networkOverviewRoute from './module/network_overview';
import accountRoute from './module/account';
import eraRoute from './module/era';
export default (app: Express) => {
  app.use(LogMiddle);
  app.use(express.urlencoded({extended: true}));
  app.use(express.json({limit: '50mb'}));
  app.use('/api/block', blockRoute);
  app.use('/api/era', eraRoute);
  app.use('/api/network_overview', networkOverviewRoute);
  app.use('/api/account', accountRoute);
  app.use(catchErrorMiddleware);
};
