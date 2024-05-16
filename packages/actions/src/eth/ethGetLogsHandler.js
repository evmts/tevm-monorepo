import { EthjsAddress, bytesToHex, hexToBytes } from '@tevm/utils'

/**
* @param {import('@tevm/blockchain').Chain} blockchain
* @param {import('@tevm/actions-types').BlockParam} blockParam
* @returns {Promise<bigint >}
*/
const parseBlockParam = async (blockchain, blockParam) => {
if (typeof blockParam === 'number') {
return BigInt(blockParam)
}
if (typeof blockParam === 'bigint') {
return blockParam
}
if (typeof blockParam === 'string' && blockParam.startsWith('0x')) {
const block = await blockchain.getBlock(hexToBytes(/** @type {import('@tevm/utils').Hex}*/(blockParam)))
return BigInt(block.header.number)
}
if (blockParam === 'safe') {
const safeBlock = blockchain.blocksByTag.get('safe')
// let's handle it here in case we forget to update it later
if (safeBlock) {
return safeBlock.header.number
}
throw new Error('safe not currently supported as block tag')
}
if (blockParam === 'latest') {
const safeBlock = blockchain.blocksByTag.get('latest')
// let's handle it here in case we forget to update it later
if (safeBlock) {
return safeBlock.header.number
}
throw new Error('latest block does not exist on chain')
}
if (blockParam === 'pending') {
// for pending we need to mine a new block and then handle it
// let's skip this functionality for now
throw new Error(
'Pending not yet supported but will be in future. Consider opening an issue or reaching out on telegram if you need this feature to expediate its release',
)
}
if (blockParam === 'earliest') {
return BigInt(1)
}
if (blockParam === 'finalized') {
throw new Error('finalized noet yet supported for this feature')
}
blockchain.logger.error({ blockParam }, 'Unknown block param pased to blockNumberHandler')
throw new Error('Unknown block param pased to blockNumberHandler')
}

/**
* @param {import('@tevm/base-client').BaseClient} client
* @returns {import('@tevm/actions-types').EthGetLogsHandler}
*/
export const ethGetLogsHandler = (client) => async (params) => {
params.filterParams.topics
params.filterParams.address

client.logger.debug(params, 'blockNumberHandler called with params')
const vm = await client.getVm()
const receiptsManager = await client.getReceiptsManager()

// TODO make this more parallized
const fromBlock = await vm.blockchain.getBlock(await parseBlockParam(vm.blockchain, params.filterParams.fromBlock))
const toBlock = await vm.blockchain.getBlock(await parseBlockParam(vm.blockchain, params.filterParams.toBlock))

// let's make sure that we cached most of the blocks already otherwise we will burn a lot of alchemy credits
if (toBlock.header.number - fromBlock.header.number > 200) {
let uncachedBlocks = 0
for (let i = fromBlock.header.number; i <= toBlock.header.number; i++) {
uncachedBlocks += vm.blockchain.blocksByNumber.has(i) ? 0 : 1
if (uncachedBlocks > 200) {
throw new Error('Block range provided to eth_getLogs traverses more than 200 uncached blocks. This will be too slow and cost too many rpc credits. This restriction will be lifted in a future version when forked logs are fetched in a safer way')
}
}
}

const logs = await receiptsManager.getLogs(
fromBlock,
toBlock,
[EthjsAddress.fromString(params.filterParams.address).bytes],
params.filterParams.topics.map((topic) => hexToBytes(topic)),
)
return logs.map(({ log, block, tx, txIndex, logIndex }) => ({
// what does this mean?
removed: false,
logIndex: BigInt(logIndex),
transactionIndex: BigInt(txIndex),
transactionHash: bytesToHex(tx.hash()),
blockHash: bytesToHex(block.hash()),
blockNumber: block.header.number,
address: bytesToHex(log[0]),
topics: log[1].map((topic) => bytesToHex(topic)),
data: bytesToHex(log[2]),
}))
}
