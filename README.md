# crust-explorer-api

## 构建

```bash
chmod +x ./build.sh
./build.sh
```

## 安装运行

```bash
tar -xcvf crust-explorer-api@0.0.1.tar.gz
cd crust-explorer-api
# ubuntu
chmod +x ./script.sh
./script.sh install
./script.sh start

test: GET http://localhost:9527/api/block/last_block?row=3

```

## api文档
[文档](./doc/api.md)

## 说明

> RPC 远程调用执行
> api.\<type\>.\<module\>.\<section\>
> Multi 多个查询
> 数据类型转换 https://polkadot.js.org/docs/api/start/types.basics 
> queryMulti 多元查询 https://polkadot.js.org/docs/api/start/api.query.multi

### substrate 框架

- api.consts 运行时候的常量 Constants https://polkadot.js.org/docs/substrate/constants
- api.query.\<module\>.\<method\> 链有关 Storage https://polkadot.js.org/docs/substrate/storage
- api.tx 所有扩展，交易等等 Extrinsics https://polkadot.js.org/docs/substrate/extrinsics
- api.event 运行时候的事件 Events  https://polkadot.js.org/docs/substrate/events
- api.errors 运行模块会出现的问题 Errors https://polkadot.js.org/docs/substrate/errors
- api.rpc 节点回调信息，上面所有api的基础  RPC https://polkadot.js.org/docs/substrate/rpc

- api.derive 派生接口，各种查询结果的结合