/* 入口 */
import express from 'express';
import route from './route';
import {LISTEN_ADDR, LISTEN_PORT, WS_NETWORK_URL} from './config';
import grantWs from './api/grant-ws';
const app = express();

(async () => {
  // eslint-disable-next-line no-useless-catch
  try {
    await Promise.all([
      grantWs.connect('/api/block/list1'),
      grantWs.connect('/api/block/list2'),
      grantWs.connect('/api/block/list3'),
      grantWs.connect('/api/block/last_block'),
      grantWs.connect('/api/era'),
      grantWs.connect('/api/network_overview'),
      // grantWs.connect('/api/account/'),
    ]);
    route(app);
    app.listen(LISTEN_PORT, LISTEN_ADDR, () => {
      console.log(`conn crust server ${WS_NETWORK_URL}`);
      console.log(`listen api server ${LISTEN_ADDR}:${LISTEN_PORT}`);
    });
  } catch (error) {
    throw error;
  }
})();
