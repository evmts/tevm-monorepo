import { type EIP1193RequestFn, http } from 'viem'
import { mainnet as viemMainnet, optimism as viemOptimism } from 'viem/chains'
import { BLOCK_HASH, BLOCK_NUMBER, TRANSACTION_HASH, USER_OPERATION_HASH } from './constants.js'

const EMPTY_32 = `0x${'0'.repeat(64)}`
const EMPTY_BLOOM = `0x${'0'.repeat(512)}`
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'
const MOCK_ACCOUNT = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'

const getRpcUrl = (envVar: 'TEVM_RPC_URLS_MAINNET' | 'TEVM_RPC_URLS_OPTIMISM') =>
	(process.env[envVar] ?? '')
		.split(',')
		.map((url) => url.trim())
		.find(Boolean)

const createMockTransaction = () => ({
	hash: TRANSACTION_HASH,
	nonce: '0x1',
	blockHash: BLOCK_HASH,
	blockNumber: BLOCK_NUMBER,
	transactionIndex: '0x0',
	from: MOCK_ACCOUNT,
	to: ZERO_ADDRESS,
	value: '0x0',
	gas: '0x5208',
	gasPrice: '0x1',
	input: '0x',
	type: '0x2',
	chainId: '0x1',
	v: '0x1',
	r: EMPTY_32,
	s: EMPTY_32,
})

const createMockBlock = (blockNumber: string, includeTxObjects: boolean) => ({
	number: blockNumber,
	hash: BLOCK_HASH,
	parentHash: EMPTY_32,
	nonce: '0x0000000000000000',
	sha3Uncles: '0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347',
	logsBloom: EMPTY_BLOOM,
	transactionsRoot: EMPTY_32,
	stateRoot: EMPTY_32,
	receiptsRoot: EMPTY_32,
	miner: ZERO_ADDRESS,
	difficulty: '0x0',
	totalDifficulty: '0x0',
	extraData: '0x',
	size: '0x1',
	gasLimit: '0x1c9c380',
	gasUsed: '0x0',
	timestamp: '0x1',
	uncles: [],
	baseFeePerGas: '0x1',
	blobGasUsed: '0x0',
	excessBlobGas: '0x0',
	parentBeaconBlockRoot: EMPTY_32,
	withdrawalsRoot: EMPTY_32,
	withdrawals: [],
	transactions: includeTxObjects ? [createMockTransaction()] : [TRANSACTION_HASH],
})

const createMockReceipt = () => ({
	transactionHash: TRANSACTION_HASH,
	transactionIndex: '0x0',
	blockHash: BLOCK_HASH,
	blockNumber: BLOCK_NUMBER,
	from: MOCK_ACCOUNT,
	to: ZERO_ADDRESS,
	cumulativeGasUsed: '0x5208',
	gasUsed: '0x5208',
	contractAddress: null,
	logs: [],
	logsBloom: EMPTY_BLOOM,
	status: '0x1',
	effectiveGasPrice: '0x1',
	type: '0x2',
})

const normalizeBlockNumber = (blockTag: unknown) =>
	typeof blockTag === 'string' && blockTag.startsWith('0x') ? blockTag : BLOCK_NUMBER

const normalizeParams = (params: unknown) => (Array.isArray(params) ? params : [])

const createMockTransport = () => {
	const request = (async ({ method, params }) => {
		const paramsArray = normalizeParams(params)

		switch (method) {
			case 'eth_chainId':
				return '0x1'
			case 'eth_blockNumber':
				return BLOCK_NUMBER
			case 'eth_blobBaseFee':
			case 'eth_gasPrice':
			case 'eth_maxPriorityFeePerGas':
				return '0x1'
			case 'eth_accounts':
				return [MOCK_ACCOUNT]
			case 'eth_coinbase':
				return ZERO_ADDRESS
			case 'eth_syncing':
				return false
			case 'eth_protocolVersion':
				return '0x41'
			case 'eth_getBalance':
				return '0xde0b6b3a7640000'
			case 'eth_getCode':
				return '0x'
			case 'eth_getStorageAt':
				return EMPTY_32
			case 'eth_getTransactionCount':
				return '0x1'
			case 'eth_estimateGas':
				return '0x5208'
			case 'eth_call':
				return '0x'
			case 'eth_sendRawTransaction':
			case 'eth_sendTransaction':
				return TRANSACTION_HASH
			case 'eth_sign':
				return `0x${'11'.repeat(65)}`
			case 'eth_getBlockByNumber':
				return createMockBlock(normalizeBlockNumber(paramsArray[0]), paramsArray[1] === true)
			case 'eth_getBlockByHash':
				return createMockBlock(BLOCK_NUMBER, paramsArray[1] === true)
			case 'eth_getBlockTransactionCountByHash':
			case 'eth_getBlockTransactionCountByNumber':
			case 'eth_getUncleCountByBlockHash':
			case 'eth_getUncleCountByBlockNumber':
				return '0x0'
			case 'eth_getTransactionByHash':
			case 'eth_getTransactionByBlockHashAndIndex':
			case 'eth_getTransactionByBlockNumberAndIndex':
				return createMockTransaction()
			case 'eth_getTransactionReceipt':
				return createMockReceipt()
			case 'eth_getUncleByBlockHashAndIndex':
			case 'eth_getUncleByBlockNumberAndIndex':
				return null
			case 'eth_getLogs':
			case 'eth_getFilterLogs':
			case 'eth_getFilterChanges':
				return []
			case 'eth_newFilter':
			case 'eth_newBlockFilter':
			case 'eth_newPendingTransactionFilter':
				return '0x1'
			case 'eth_uninstallFilter':
				return true
			case 'eth_createAccessList':
				return { accessList: [], gasUsed: '0x5208' }
			case 'eth_feeHistory':
				return {
					oldestBlock: normalizeBlockNumber(paramsArray[1]),
					baseFeePerGas: ['0x1', '0x1'],
					gasUsedRatio: [0],
					reward: [['0x1']],
				}
			case 'eth_getProof':
				return {
					address: paramsArray[0] ?? ZERO_ADDRESS,
					accountProof: [],
					balance: '0x0',
					codeHash: EMPTY_32,
					nonce: '0x0',
					storageHash: EMPTY_32,
					storageProof: [],
				}
			case 'eth_supportedEntryPoints':
				return [ZERO_ADDRESS]
			case 'eth_getUserOperationByHash':
				return {
					userOperationHash: USER_OPERATION_HASH,
					entryPoint: ZERO_ADDRESS,
					transactionHash: TRANSACTION_HASH,
				}
			case 'eth_getUserOperationReceipt':
				return {
					userOpHash: USER_OPERATION_HASH,
					entryPoint: ZERO_ADDRESS,
					transactionHash: TRANSACTION_HASH,
					blockHash: BLOCK_HASH,
					blockNumber: BLOCK_NUMBER,
					logs: [],
				}
			case 'eth_simulateV1':
				return { calls: [], gasUsed: '0x0' }
			default:
				return null
		}
	}) as EIP1193RequestFn

	return { request }
}

const createTransport = (rpcUrl: string | undefined, chain: typeof viemMainnet | typeof viemOptimism) => {
	if (!rpcUrl) {
		console.warn('RPC URL is not set, using deterministic in-memory mock transport for tests')
		return createMockTransport()
	}
	return http(rpcUrl)({ chain, retryCount: 2, timeout: 20_000 })
}

export const transports = {
	mainnet: createTransport(getRpcUrl('TEVM_RPC_URLS_MAINNET'), viemMainnet),
	optimism: createTransport(getRpcUrl('TEVM_RPC_URLS_OPTIMISM'), viemOptimism),
}
