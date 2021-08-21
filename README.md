# crust-explorer-api

## api doc

[api-doc](./doc/api.md)

## build

```bash
chmod +x ./build.sh
./build.sh
```

## install and run

```bash
# install
tar -xcvf crust-explorer-api@0.0.1.tar.gz
cd crust-explorer-api
# chmod +x ./script.sh
./script.sh install # ./script.sh install cn

# run
./script.sh start

test: GET http://[LISTEN_ADDR]:[LISTEN_PORT]/api/block/last_block?row=3
```

## crust api info

> RPC # remote call
> api.\<type\>.\<module\>.\<section\>
> Multi # query more
> data type conversion <https://polkadot.js.org/docs/api/start/types.basics>
> queryMulti <https://polkadot.js.org/docs/api/start/api.query.multi>

### substrate api info

- api.consts  # Constants <https://polkadot.js.org/docs/substrate/constants>
- api.query.\<module\>.\<method\> # Storage  <https://polkadot.js.org/docs/substrate/storage>
- api.tx # Extrinsics <https://polkadot.js.org/docs/substrate/extrinsics>
- api.event # Events  <https://polkadot.js.org/docs/substrate/events>
- api.errors # Errors <https://polkadot.js.org/docs/substrate/errors>
- api.rpc # RPC <https://polkadot.js.org/docs/substrate/rpc>
- api.derive # derived interfaces
