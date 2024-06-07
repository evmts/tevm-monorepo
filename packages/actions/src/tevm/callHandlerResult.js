import { serializeTransaction, EthjsAddress, bytesToHex, getAddress, isBytes, toHex, hexToBytes } from '@tevm/utils'
import { decodeFunctionResult, encodeFunctionData } from 'viem'

/**
* Creates an CallHandler for handling call params with Ethereumjs EVM
* @param {import('@tevm/evm').EvmRunCallOpts} evmInput
* @param {import('@tevm/vm').RunTxResult} evmResult
* @param {import('@tevm/utils').Hex | undefined} txHash
* @param {import('@tevm/actions-types').DebugTraceCallResult | undefined} trace
* @param {Map<string, Set<string>> | undefined} accessList returned by the evm
* @param {import('@tevm/vm').Vm} vm
* @returns {Promise<import('@tevm/actions-types').CallResult>}
*/
export const callHandlerResult = async (evmInput, evmResult, txHash, trace, accessList, vm) => {
/**
* @type {import('@tevm/actions-types').CallResult}
*/
const out = {
rawData: toHex(evmResult.execResult.returnValue),
executionGasUsed: evmResult.execResult.executionGasUsed,
}

if (trace) {
out.trace = trace
}
if (txHash) {
if (evmResult.totalGasSpent) {
out.totalGasSpent = evmResult.totalGasSpent
}
if (evmResult.minerValue) {
out.minerValue = evmResult.minerValue
}
if (evmResult.blobGasUsed) {
out.blobGasUsed = evmResult.blobGasUsed
}
if (evmResult.amountSpent) {
out.amountSpent = evmResult.amountSpent
}
if (accessList && evmResult.preimages) {
out.preimages = evmResult.preimages
}
const isOpstack = vm.common.sourceId !== undefined
if (isOpstack) {
// calculate the l1 fee
/**
* @type {typeof import('viem/chains').optimism}
*/
const opstackChain = /** @type {any}*/(vm.common)
const serializedTx = serializeTransaction({ chainId: opstackChain.id, data: bytesToHex(evmInput.data ?? new Uint8Array()), type: 'eip1559' })
/**
* @type {[{
inputs: [{ internalType: 'bytes', name: '_data', type: 'bytes' }],
name: 'getL1Fee',
outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
stateMutability: 'view',
type: 'function',
}]}
*/
const abi = [{
inputs: [{ internalType: 'bytes', name: '_data', type: 'bytes' }],
name: 'getL1Fee',
outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
stateMutability: 'view',
type: 'function',
}]
const estimateL1FeeResult = await vm.evm.runCall({
to: EthjsAddress.fromString(opstackChain.contracts.gasPriceOracle.address),
data: hexToBytes(encodeFunctionData({
functionName: 'getL1Fee',
args: [serializedTx],
abi
}))
})
out.l1DataFee = decodeFunctionResult({
abi,
functionName: 'getL1Fee',
data: bytesToHex(estimateL1FeeResult.execResult.returnValue)
})
}
}

if (accessList) {
// this might break next ethjs release
out.accessList = /** @type {Record<import('@tevm/utils').Address, Set<import('@tevm/utils').Hex>>} */(
Object.fromEntries(
[...accessList.entries()]
.map(([address, storageKeys]) => {
const hexKeys = new Set([...storageKeys].map(key => `0x${key}`))
return [`0x${address}`, hexKeys]
}))
)
}
if (txHash) {
out.txHash = txHash
}

if (evmResult.execResult.gasRefund) {
out.gasRefund = evmResult.gasRefund ?? evmResult.execResult.gasRefund
}
if (evmResult.execResult.selfdestruct) {
out.selfdestruct = new Set(
[...evmResult.execResult.selfdestruct].map((address) =>
getAddress(address),
),
)
}
if (evmResult.execResult.gas) {
out.gas = evmResult.execResult.gas
}
if (evmResult.execResult.logs) {
// type Log = [address: Address, topics: Hex[], data: Hex]
out.logs = evmResult.execResult.logs.map((log) => {
const [address, topics, data] = log
return {
address: getAddress(toHex(address)),
topics: topics.map((topic) => toHex(topic)),
data: toHex(data),
}
})
}
if (evmResult.execResult.runState) {
// don't do anything with runState atm
}
if (evmResult.execResult.blobGasUsed) {
out.blobGasUsed = evmResult.execResult.blobGasUsed
}
if (evmResult.execResult.exceptionError) {
out.errors = [
{
name: evmResult.execResult.exceptionError.error,
_tag: evmResult.execResult.exceptionError.error,
message: isBytes(evmResult.execResult.returnValue)
? bytesToHex(evmResult.execResult.returnValue)
: 'There was an error executing call',
},
]
}

if (evmResult.execResult.createdAddresses) {
out.createdAddresses = new Set(
[...evmResult.execResult.createdAddresses].map(getAddress),
)
}

if (evmResult.createdAddress) {
out.createdAddress = getAddress(evmResult.createdAddress.toString())
}

return out
}
