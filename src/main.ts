/* 入口 */
import Log from './util/log';
import express from 'express';
import route from './route';
import {LISTEN_ADDR, LISTEN_PORT, WS_MAX_CONN, WS_NETWORK_URLS} from './config';
import CrustPool from './crust-pool';
import compression from 'compression';

const app = express();

// run async main
(async () => {
  Log.info(`conn ${WS_MAX_CONN * WS_NETWORK_URLS.length} crust network ....`);
  await CrustPool.Init()
    .catch((err: any) => {
      Log.error('start is error');
      throw err;
    })
    .then(res => {
      app.set('x-powered-by', false);
      app.use(compression());
      route(app);
      app.listen(LISTEN_PORT, () => {
        Log.info(`crust network conn suc: ${res.length} `);
        Log.info(`listen api server http://${LISTEN_ADDR}:${LISTEN_PORT}`);
      });
    });
})();
