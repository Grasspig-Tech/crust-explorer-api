// 配置
import path from 'path';
import fsClientErrorConfig from './api/fs-client/error-config';
import SSClientErrorConfig from './api/ss-client/error-config';
import { ErrorConfig } from './interface';
//飞书机器人配置
export const FS_ROBOT_KEY = '飞书机器人密钥'; //密钥
export const FS_ROBOT_REQUEST_URL =
  'webhook address'; //webhook地址

// 环境
export const IsProduction = process.env.NODE_ENV === 'production';

// api 有关
export const REQUEST_TIME = 100; // 每次请求暂停时间
export const SERVER_API = 'mint-api接口地址'; // 服务器接口
export const SERVER_TOKEN = 'mint服务端密码'; // 服务端密码

export const CHAIN_WS_URL = IsProduction
  ? 'ws://127.0.0.1:19944'
  : 'wss://api.crust.network/';

export const CRUST_SUBSCAN_API = 'https://crust.subscan.io/api'; // crust subscan api 地址
export const CRUST_SUBSCAN_TOKEN = ''; // crust subscan api token

// export const SPLORER_API = 'https://splorer-api.crustcode.com/api'; // crust storage 存储 api
export const SPLORER_API = 'https://splorer-api.crust.network/api'; // crust storage 存储 api
export const SPLORER_AUTHORIZATION = 'Basic Y3J1c3Q6MTYyNTM0'; // crust storage 存储 api 认证

export const SERVER_SS_API = ' server 酱地址 server 酱地址'; // server 酱地址
export const SERVER_SS_TOKEN = 'server 酱 token'; // server 酱 token

// 日志
export const LOG_DIR: string = path.resolve(__dirname, './log'); // 日志目录
export const LOG_SAVA_DAY = 30; // 缓存保存天数

// 缓存有关
export const TEMP_DIR: string = path.resolve(__dirname, './temp'); // 缓存目录
export const TEMP_RESULT_FILENAME = 'result.info'; // 缓存结果文件，防止提交出错频繁调用

// 出错重试开关
export const ERROR_RESTART = true; // 是否自动重试
export const SUCCESS_SS_SEND = false; // 开启server酱成功通知
export const ERROR_SS_SEND = true; // 开启server酱错误通知
export const RESTART_TIME = 1000; // 重试间隔时间 mm
export const ERROR_COUNT = 6; // 出现错误后重试次数,运行次数就是+1
export const CRON_TIME = 6; // 每6小时调用一次
// 账户密码
export const ACCOUNT_BACKUP =
  '账户信息';
export const ACCOUNT_PASSWD = '账号密码';

// 错误配置
export const ERROR_CONFIG_LIST: { [config: string]: ErrorConfig[] } = {
  fs_client: fsClientErrorConfig,
  ss_client: SSClientErrorConfig,
};
// 飞书的重试次数
export const MAX_FS_ERROR_SEND_NUM = 6;

// express监听端口
export const LISTEN_PORT = 9527;
// 主网路径
export const WS_NETWORK_URL = "wss://api.decloudf.com/";
// export const WS_NETWORK_URL = "wss://api.crust.network/";
// export const WS_NETWORK_URL = "ws://192.168.1.108:9999/";//本地
// export const WS_NETWORK_URL = "ws://172.18.128.88:1276/";//旧节点
// export const WS_NETWORK_URL = "ws://127.0.0.1:19944/"//新节点

// 多少个区块才算确认
export const CONFIRM_BLOCK = 6;




