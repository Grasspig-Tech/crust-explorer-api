import {ErrorConfig} from '../../interface';
import {delay} from '../../util';
import SSClient from './index';

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
    task: async ({title, context}) => {
      await delay(5000);
      await SSClient.getInstance().send({title, context});
    },
  },
  {
    /* 网络报错 */
    code: 2,
    task: 1, //和code为1执行一样的任务
  },
];

export default whenErrorConfig;
