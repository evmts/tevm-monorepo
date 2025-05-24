export type { CreateMemoryDbFn } from './CreateMemoryDbFn.js'
export type { MemoryDb } from './MemoryDb.js'
export { createMemoryDb } from './createMemoryDb.js'

export type {
	Abi,
	AbiConstructor,
	AbiEvent,
	AbiFunction,
	AbiItemType,
	Address,
	EncodeDeployDataParameters,
	Hex,
	BlockTag,
	ParseAbi,
	FormatAbi,
	BlockNumber,
	GetEventArgs,
	ExtractAbiEvent,
	ExtractAbiFunction,
	ExtractAbiEventNames,
	ExtractAbiFunctionNames,
	ExtractAbiEvents,
	CreateEventFilterParameters,
	AbiParametersToPrimitiveTypes,
	ContractFunctionName,
	EncodeFunctionDataParameters,
	DecodeFunctionResultReturnType,
	Account,
	HDAccount,
	Filter,
	ContractConstructorArgs,
} from './abitype.js'
export * from './prefundedAccounts.js'
export {
	serializeTransaction,
	mnemonicToAccount,
	formatAbi,
	parseAbi,
	bytesToHex,
	hexToBool,
	hexToBytes,
	hexToBigInt,
	hexToNumber,
	numberToHex,
	boolToHex,
	stringToHex,
	fromHex,
	fromBytes,
	toBytes,
	toHex,
	encodePacked,
	encodeDeployData,
	encodeErrorResult,
	encodeEventTopics,
	encodeAbiParameters,
	encodeFunctionData,
	encodeFunctionResult,
	decodeFunctionData,
	decodeFunctionResult,
	decodeEventLog,
	decodeErrorResult,
	decodeAbiParameters,
	formatGwei,
	formatLog,
	formatEther,
	fromRlp,
	getAddress,
	isAddress,
	isBytes,
	isHex,
	keccak256,
	boolToBytes,
	bytesToBool,
	hexToString,
	bytesToBigint,
	bytesToBigInt,
	bytesToNumber,
	parseEther,
	parseGwei,
	toRlp,
} from './viem.js'
export { Bloom } from './Bloom.js'
export {
	EthjsAccount,
	EthjsAddress,
	equalsBytes,
	bytesToUnprefixedHex,
	concatBytes,
	KeyEncoding,
	ValueEncoding,
	setLengthLeft,
	toType,
	TypeOutput,
	bytesToUtf8,
	fetchFromProvider,
	getProvider,
	KECCAK256_RLP,
	KECCAK256_RLP_ARRAY,
	Withdrawal,
	ecrecover,
	// ecsign was removed in newer versions
	// zeros was also removed
	// AsyncEventEmitter was also removed
	GWEI_TO_WEI,
	randomBytes,
} from './ethereumjs.js'
export type {
	WithdrawalData,
	DB as Db,
	DBObject as DbObject,
	BatchDBOp as BatchDbOp,
	EncodingOpts,
	AddressLike,
	BigIntLike,
	BytesLike,
	JSONRPCWithdrawal as JsonRpcWithdrawal,
} from '@ethereumjs/util'
export type { Log as EthjsLog } from '@ethereumjs/evm'
// GenesisState is now in @ethereumjs/common, but we need the account-based GenesisState
// which seems to have been removed. Let's define it here for backward compatibility.
export type GenesisState = Record<string, string | Record<string, any>>

// AsyncEventEmitter was removed from @ethereumjs/util
// Define a compatible type for backward compatibility
export type AsyncEventEmitter<T extends Record<string, any> = {}> = {
	on<K extends keyof T>(event: K, listener: T[K]): void
	once<K extends keyof T>(event: K, listener: T[K]): void
	off<K extends keyof T>(event: K, listener: T[K]): void
	emit<K extends keyof T>(event: K, ...args: Parameters<T[K]>): boolean
	removeAllListeners<K extends keyof T>(event?: K): void
}
export type {
	SetToHex,
	BigIntToHex,
	SerializeToJson,
	JsonSerializable,
	JsonSerializableSet,
	JsonSerializableArray,
	JsonSerializableObject,
} from './SerializeToJson.js'
export * from './invariant.js'
export type { EncodeEventTopicsParameters } from 'viem/utils'
