// 日志有关
import fs from 'fs';
import path from 'path';
import {dateFormat} from './index';
import {LOG_DIR, LOG_SAVA_DAY} from '../config';
import {LogType} from '../interface';

/**
 * @description 日志类
 * @author huazhuangnan
 * @date 09/04/2021
 * @class Log
 */
class Log {
  public dir: string = LOG_DIR;
  private static instance: Log;
  public static getInstance(): Log {
    this.instance = this.instance || new Log();
    return this.instance;
  }
  constructor() {
    if (!fs.existsSync(this.dir)) {
      fs.mkdirSync(this.dir);
    }
  }

  /**
   * @description 写日志
   * @author huazhuangnan
   * @date 09/04/2021
   * @param {LOGType} type
   * @param {string} str
   * @memberof Log
   */
  public write(type: LogType, str: string): void {
    const time = dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss');
    const oldTime = dateFormat(
      new Date(new Date().setDate(new Date().getDate() - LOG_SAVA_DAY)),
      'yyyy-MM-dd'
    );
    fs.appendFileSync(
      path.resolve(this.dir, `./${dateFormat(new Date(), 'yyyy-MM-dd')}.log`),
      `${time} ${type} ${str.trim()}\n`,
      'utf8'
    );
    // 删除老的文件
    this.delete(oldTime);
  }

  /**
   * @description 调试
   * @author huazhuangnan
   * @date 2021/09/04
   * @param {string} str
   * @memberof Log
   */
  public debug(str: string): Log {
    this.write('DEBUG', str);
    return this;
  }

  /**
   * @description 信息
   * @author huazhuangnan
   * @date 2021/09/04
   * @param {string} str
   * @memberof Log
   */
  public info(str: string): Log {
    this.write('INFO', str);
    return this;
  }

  /**
   * @description 警告
   * @author huazhuangnan
   * @date 2021/09/04
   * @param {string} str
   * @memberof Log
   */
  public warn(str: string): Log {
    this.write('WARING', str);
    return this;
  }

  /**
   * @description 错误日子
   * @author huazhuangnan
   * @date 2021/09/04
   * @param {string} str
   * @memberof Log
   */
  public error(str: string): Log {
    this.write('ERROR', str);
    return this;
  }

  /**
   * @description 读日志
   * @author huazhuangnan
   * @date 09/04/2021
   * @param {LOGType} type
   * @param {string} date
   * @memberof Log
   */
  public read(type: LogType, date: string): void {
    const filename = path.resolve(this.dir, `./${date}.log`);
    if (fs.existsSync(filename) && fs.statSync(filename).isFile()) {
      // 存在并且是文件
      fs.readFile(filename, 'utf8', (err, data) => {
        if (err) {
          this.error(`读取${date}日志文件出错！`);
          return '';
        } else {
          return data;
        }
      });
    }
  }
  public delete(date: string): void {
    const filename = path.resolve(this.dir, `./${date}.log`);
    if (fs.existsSync(filename)) {
      fs.unlinkSync(filename); // 删除
    }
  }
}

export default Log.getInstance();
