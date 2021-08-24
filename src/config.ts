// 配置
import path from 'path';
// 环境
export const IsProduction = process.env.NODE_ENV === 'production';

// export const SPLORER_API = 'https://splorer-api.crustcode.com/api'; // crust storage 存储 api
export const SPLORER_API = 'https://splorer-api.crust.network/api'; // crust storage 存储 api
export const SPLORER_AUTHORIZATION = 'Basic Y3J1c3Q6MTYyNTM0'; // crust storage 存储 api 认证

// 日志
export const LOG_DIR: string = path.resolve(__dirname, './log'); // 日志目录
export const LOG_SAVA_DAY = 30; // 缓存保存天数

// 缓存有关
export const TEMP_DIR: string = path.resolve(__dirname, './temp'); // 缓存目录
export const TEMP_RESULT_FILENAME = 'result.info'; // 缓存结果文件，防止提交出错频繁调用

// express监听端口
export const LISTEN_PORT = 9527;
export const LISTEN_ADDR = '0.0.0.0';

// crust network 路径
export const WS_MAX_CONN = 2; // 每个url开启的最大链接数量
export const WS_NETWORK_URLS = [
  'wss://api.crust.network',
  // 'wss://rpc.pinknode.io/maxwell/aaa-bbb',
  'wss://api-maxwell.crust.network',
  'wss://api.decloudf.com',
];
// export const WS_NETWORK_URL = 'wss://api-maxwell.crust.network';
// export const WS_NETWORK_URL = 'wss://api.decloudf.com/';
// export const WS_NETWORK_URL = "wss://api.crust.network/";
// export const WS_NETWORK_URL = "ws://192.168.1.108:9999/";//本地
// export const WS_NETWORK_URL = "ws://172.18.128.88:1276/";//旧节点
// export const WS_NETWORK_URL = "ws://127.0.0.1:19944/"//新节点

// 多少个区块才算确认
export const CONFIRM_BLOCK = 6;
