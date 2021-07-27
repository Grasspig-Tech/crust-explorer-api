import { ErrorConfig } from '../../interface';
import { delay } from '../../util';
import FSClient from './index';
import { ERROR_SS_SEND, MAX_FS_ERROR_SEND_NUM } from '../../config';
import SSClient from '../ss-client';
import { fsSendErrorCount } from '../../util/err-count';

const whenErrorConfig: ErrorConfig[] = [
  {
    code: 0,
    task: text => {
      // console.log('[@@@@@]：', text);
    },
  },
  {
    /* 网络不报错，但是发送失败 */
    code: 1,
    task: async (text: string) => {
      fsSendErrorCount.add();
      // console.log(`尝试第${fsSendErrorCount.get()}次飞书发送`);
      if (fsSendErrorCount.get() > MAX_FS_ERROR_SEND_NUM) {
        /* 飞书有点问题，得用server酱 */
        if (ERROR_SS_SEND) {
          // server 酱 通知
          const res = await SSClient.getInstance().send({
            title: '转飞书',
            context: text,
          });
          // console.log('[server酱]发送成功');
          // console.log(res);
        }
        fsSendErrorCount.set(0);
        return;
      }
      await delay(5000);
      await FSClient.getInstance().send(text);
      /* 没报错，说明发送成功，次数重新置为0 */
      // console.log('[飞书机器人]发送成功');
      fsSendErrorCount.set(0);
    },
  },
  {
    /* 网络报错 */
    code: 2,
    task: 1, //和code为1执行一样的任务
  },
];

export default whenErrorConfig;
