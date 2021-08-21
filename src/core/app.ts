// 入口

import Log from '../util/log';
import mainWork from './main-work';
import rewardSend from './reward-send';
import nodeCronToExecuteTask from './nodecron-task-exec';
import whenError from './when-error';
import {NodecronTaskConfig} from '../interface';
import FSClient from '../api/fs-client';
// 运行程序
export default async function app() {
  let startTime = Date.now(); // 程序运行时间

  /* 处理错误情况 */
  whenError({
    loop: mainWork, //主函数
    beforeExit: () => {
      startTime = Date.now(); // 程序运行时间
      Log.info(`server run time: ${(Date.now() - startTime) / 1e3} s`);
    },
  });
}
