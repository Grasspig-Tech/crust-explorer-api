import { ApiPromise, WsProvider } from '@polkadot/api';
import { typesBundleForPolkadot } from '@crustio/type-definitions';
import {
  CHAIN_WS_URL,
  REQUEST_TIME,
  TEMP_RESULT_FILENAME,
  SUCCESS_SS_SEND,
} from '../config';
import {
  tempFileDelete,
  isHaveTempFile,
  tempFileRead,
  sleep,
  tempFileWrite,
} from '../util/index';
import SClient from '../api/s-client';
import { ResultInfo } from '../interface';
import Log from '../util/log';
import SSClient from '../api/ss-client';
// import infoQuery from './info-query';
import { PromiseFuncOrPlainFunc } from '../interface';
import { globalErrorCount } from '../util/err-count';
const mainConfig: {
  beforeRun: PromiseFuncOrPlainFunc;
  afterRunSuccess: PromiseFuncOrPlainFunc;
} = {
  beforeRun: () => {
    //main函数运行前
    // 写日志
    Log.info('server start');
  },
  afterRunSuccess: (data: { result: Array<ResultInfo> }) => {
    //main函数成功后
    // 成功日志
    Log.info(`server sub data ${JSON.stringify(data)}`);
    // server 酱 通知
    if (SUCCESS_SS_SEND) {
      const ssClient = new SSClient();
      ssClient
        // .send(`server-is-run-success`, JSON.stringify(data))
        .send({ title: 'server-is-run-success', context: JSON.stringify(data) })
        .then(res => res)
        .catch(err => {
          throw err;
        });
    }
  },
};

/**
 * @description 主工作函数
 * @author huazhuangnan
 * @date 2021/09/04
 */
export default async function main() {
  const { beforeRun, afterRunSuccess } = mainConfig;
  beforeRun && (await beforeRun());

  

  // afterRunSuccess && (await afterRunSuccess(data));

}
