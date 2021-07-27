import { ApiPromise, WsProvider } from '@polkadot/api';
import { typesBundleForPolkadot } from '@crustio/type-definitions';
import { CeBlock } from "../../model/ce_block"
/**
 * 通过区块头获取
 *
 * @export
 */
export async function getBlockByBlockNum(blockNum: number) {
    const wsProvider = new WsProvider('wss://api.decloudf.com/');
    // const wsProvider = new WsProvider('wss://rpc.polkadot.io');
    const api = await ApiPromise.create({ provider: wsProvider, typesBundle: typesBundleForPolkadot });
    await api.isReady;
    try {
        let blockHash = (await api.rpc.chain.getBlockHash(blockNum)).toHuman();
        let { block, events }: any = await api.derive.tx.events(blockHash as any);

        // console.log(block)
        let specVersion = api.consts.system.version.toHuman().specVersion;
        let blockToHuamn = block.toHuman();
        if (!blockToHuamn) {
            throw new Error("报错")
        }
        debugger;
        const {
            block: { extrinsics, header: { number, parentHash, stateRoot, extrinsicsRoot } }
        }: any = blockToHuamn;
        blockHash = String(blockHash);
        specVersion = Number(specVersion);
        debugger;

        let ceBlock: CeBlock = {
            finalized: 0,
            blockNum: blockNum,
            blockTimestamp: 0,
            hash: blockHash,
            parentHash: parentHash,
            eventCount: events.length,
            extrinsicsCount: extrinsics.length,
            stateRoot: stateRoot,
            extrinsicsRoot: extrinsicsRoot,
            specVersion: specVersion,
            validator: "",
            accountDisplay: ""
        }
        // console.log(ceBlock)
        debugger;
        return ceBlock;

    } catch (error) {
        throw new Error(error)
    } finally {
        // await wsProvider.disconnect();

    }



}


