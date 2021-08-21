/* 入口 */
import Log from './util/log';
import express from 'express';
import route from './route';
import {LISTEN_ADDR, LISTEN_PORT, WS_MAX_CONN} from './config';
import CrustWsPool from './api/crust-network';
const app = express();

// run async main
(async () => {
  Log.info(`conn ${WS_MAX_CONN} crust network ....`);
  await CrustWsPool.Init()
    .catch(err => {
      Log.error('start is error');
      throw err;
    })
    .then(res => {
      route(app);
      app.listen(LISTEN_PORT, () => {
        Log.info(`listen api server http://${LISTEN_ADDR}:${LISTEN_PORT}`);
      });
    });
})();
