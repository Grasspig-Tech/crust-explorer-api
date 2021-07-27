import {CommitErrorMessage} from '../interface';
import {ERROR_CONFIG_LIST} from '../config';

/**
 *
 *
 * @export
 * @param {(COMMIT_ERROR_MESSAGE | any)} errorMessage 错误信息
 * @param {() => any} defaultHandlerError 没命中的话，默认处理错误的函数
 * @return {*}
 */
export default async function errorHandle(
  errorMessage: CommitErrorMessage | any,
  defaultHandlerError: (...args: any[]) => any
) {
  if (!errorMessage.target) {
    /* 不是配置里的错误，执行默认的错误处理函数 */
    defaultHandlerError(errorMessage);
    return;
  }
  const {target, code, payload} = errorMessage;
  const isTargetExit: boolean = Object.keys(ERROR_CONFIG_LIST).includes(target);
  if (!isTargetExit) {
    /* 没有配置，执行默认处理函数 */
    defaultHandlerError(errorMessage);
    return;
  }
  /* 走到这，说明存在目标的配置 */
  const taskConfig = ERROR_CONFIG_LIST[target].find(it => it.code === code);
  if (!taskConfig) {
    /* 目标配置里没有对应的code的错误处理函数 */
    defaultHandlerError(errorMessage);
    return;
  }
  let {task} = taskConfig;
  if (typeof task === 'number') {
    /* 数字类型，说明执行和code=task的task */
    task = ERROR_CONFIG_LIST[target].find(it => it.code === task)?.task as (
      message: CommitErrorMessage
    ) => any;
  }
  task && (await task(payload));
}
