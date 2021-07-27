// import { exec, spawn } from 'child_process';
// // 系统
// process.env.SHELL_ENV = /^win/.test(process.platform) ? 'win' : 'linux';
// // 运行 exec 状态
// export function execRun(cmd: string, debug = false) {
//   if (debug) // console.log('[Run Cmd]: ', cmd);
//     return new Promise((resolve: Function, reject: Function) => {
//       exec(cmd, (err, stdout, stderr) => {
//         if (err || stderr) {
//           const msg = err ? err : stderr;
//           if (debug) // console.error('[Exec Error]: ', msg);
//             reject(msg);
//         } else {
//           const result = stdout.length > 0 ? stdout : 'no result';
//           if (debug) // console.log('[Exec Success]: ', result.toString());
//             resolve(result);
//         }
//       });
//     });
// }
// // 运行 Spawn 数据流
// export function spawnRun(cmd: string, callback: Function, debug = false) {
//   if (debug) // console.log('[Run Cmd]: ', cmd);
//     // 配置
//     const options = {
//       cmd: __dirname, // 当前工作目录
//       env: process.env, // 环境变量
//       shell: true, // 在 shell 中运行
//       detached: false, // 独立主进程
//     };
//   const args = cmd.split(/\s/);
//   const command = args[0];
//   args.shift(); // 删除第一个元素
//   return new Promise((resolve: Function, reject: Function) => {
//     const data: string[] = [];
//     const ls = spawn(command, args, options);
//     ls.stdout.on('data', res => {
//       const line = res.toString();
//       if (debug) // console.log('[Spawn Success]: ', line);
//         data.push(line);
//       callback(line);
//     });
//     ls.stderr.on('data', err => {
//       // // console.error('[Spawn Error]: ',err);
//       reject(err);
//     });
//     ls.on('close', code => {
//       if (debug) // console.error('[Spawn Close]: ', code);
//         resolve({ data, code });
//     });
//   });
// }

// // example
// // const cmdStr = 'git version';

// // // console.log('[Cmd Device]: ', process.env.SHELL_ENV);
// // // console.log('[Node Version]: ', process.version);
// // runExec('chcp 65001') // 修改编码
// //   .then(() => runExec('title 测试'))
// //   .then(() =>
// //     runSpawn(cmdStr, (line: string) => {
// //       // console.log(line);
// //     })
// //   )
// //   .then((res: any) => {
// //     // console.log('程序运行结束，退出码:', res.code);
// //   })
// //   // .then(e=>runExec('chcp 936'))
// //   .catch(e => // console.log(e));
