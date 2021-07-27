import NodeCron from 'node-cron';
import {NodecronTaskConfig} from '../interface';

/**
 * timeConfig：时间配置，如'0 30 5,11,17,23 * * *'
 * task：定时任务函数（支持async函数）
 * nodeCronConfig：nodeCron的第三个参数，默认是{scheduled:true}
 */
export default (taskConfig: NodecronTaskConfig | NodecronTaskConfig[]) => {
  if (!Array.isArray(taskConfig)) {
    taskConfig = [taskConfig];
  }
  taskConfig.forEach(({task, timeConfig, nodeCronConfig}) => {
    nodeCronConfig = nodeCronConfig ? nodeCronConfig : {scheduled: true};
    NodeCron.schedule(timeConfig, task, nodeCronConfig);
  });
};
