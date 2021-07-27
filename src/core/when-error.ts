import {sleep} from '../util/index';
import Log from '../util/log';
import SSClient from '../api/ss-client';
import {
  ERROR_COUNT,
  ERROR_RESTART,
  RESTART_TIME,
  ERROR_SS_SEND,
} from '../config';
import {PromiseFuncOrPlainFunc} from '../interface';
import {globalErrorCount} from '../util/err-count';
import handlerError from '../controller/error-handle';

/**
 * loop：发生错误时的重启函数（支持async函数）
 * beforeExit：退出程序前执行的函数（支持async函数）
 */
export default async (config: {
  loop: PromiseFuncOrPlainFunc;
  beforeExit: PromiseFuncOrPlainFunc;
}) => {
  // 程序错误回调
  const {loop, beforeExit} = config;
  async function errBack(err: string): Promise<void> {
    // 运行出错
    globalErrorCount.add();
    const curErrCount = globalErrorCount.get();
    Log.error(`server is run error ${curErrCount}, ${err}`);
    if (ERROR_RESTART && curErrCount <= ERROR_COUNT) {
      sleep(RESTART_TIME); // 暂停一段时间
      await loop().catch((err: any) => {
        throw err;
      });
    } else {
      // server 酱 通知
      if (ERROR_SS_SEND) {
        const ssClient = new SSClient();
        // await ssClient.send(`server-is-run-error-${curErrCount}`, err).catch(err => { throw err });
        await ssClient
          .send({title: `server-is-run-error-${curErrCount}`, context: err})
          .catch(err => {
            throw err;
          });
      }
      try {
        await beforeExit();
      } finally {
        process.exit(0); // eslint-disable-line no-process-exit
      }
    }
  }
  // 监听未捕获的异常
  // process.on('uncaughtException', err => errBack(JSON.stringify(err.message || err)));
  // 监听Promise没有被捕获的失败函数
  // process.on('unhandledRejection', (err, promise) => errBack(JSON.stringify(err)));
  process.on('uncaughtException', err => {
    handlerError(err, () => errBack(JSON.stringify(err.message || err)));
  });
  process.on('unhandledRejection', err => {
    handlerError(err, () => errBack(JSON.stringify(err)));
  });
};
