/* 入口 */
import express from 'express';
import route from './route';
import {LISTEN_PORT} from './config';
import grantWs from './api/grant-ws';
const app = express();

(async () => {
  try {
    await Promise.all([
      grantWs.connect('/api/block/list1'),
      grantWs.connect('/api/block/list2'),
      grantWs.connect('/api/block/list3'),
      grantWs.connect('/api/block/last_block'),
      grantWs.connect('/api/era'),
      grantWs.connect('/api/network_overview'),
    //   grantWs.connect('/api/account/'), // 最后的斜杆不能去掉
    ]);
    route(app);
    app.listen(LISTEN_PORT, () => {
      console.log(`开始监听端口：${LISTEN_PORT}`);
    });
  } catch (error) {
    throw error;
  }
})();
