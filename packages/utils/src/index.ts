export type { Log as EthjsLog } from '@ethereumjs/evm'
export type {
	AddressLike,
	BatchDBOp as BatchDbOp,
	BigIntLike,
	BytesLike,
	DB as Db,
	DBObject as DbObject,
	EncodingOpts,
	JSONRPCWithdrawal as JsonRpcWithdrawal,
	WithdrawalData,
} from '@ethereumjs/util'
export type {
	Abi,
	AbiConstructor,
	AbiEvent,
	AbiFunction,
	AbiItemType,
	AbiParametersToPrimitiveTypes,
	Account,
	Address,
	BlockNumber,
	BlockTag,
	ContractConstructorArgs,
	ContractFunctionName,
	CreateEventFilterParameters,
	DecodeFunctionResultReturnType,
	EncodeDeployDataParameters,
	EncodeFunctionDataParameters,
	ExtractAbiEvent,
	ExtractAbiEventNames,
	ExtractAbiEvents,
	ExtractAbiFunction,
	ExtractAbiFunctionNames,
	Filter,
	FormatAbi,
	GetEventArgs,
	HDAccount,
	Hex,
	ParseAbi,
} from './abitype.js'
export { Bloom } from './Bloom.js'
export type { CreateMemoryDbFn } from './CreateMemoryDbFn.js'
export { createMemoryDb } from './createMemoryDb.js'
export {
	bytesToUnprefixedHex,
	bytesToUtf8,
	concatBytes,
	createAccount,
	createAddressFromString,
	createWithdrawal,
	EthjsAccount,
	EthjsAddress,
	ecrecover,
	equalsBytes,
	fetchFromProvider,
	// ecsign was removed in newer versions
	// zeros was also removed
	// AsyncEventEmitter was also removed
	GWEI_TO_WEI,
	getProvider,
	KECCAK256_RLP,
	KECCAK256_RLP_ARRAY,
	KeyEncoding,
	randomBytes,
	setLengthLeft,
	TypeOutput,
	toType,
	ValueEncoding,
	Withdrawal,
} from './ethereumjs.js'
export type { MemoryDb } from './MemoryDb.js'
export * from './prefundedAccounts.js'
export {
	hashMessage,
	recoverAddress,
	recoverMessageAddress,
	recoverPublicKey,
	signMessage,
	verifyMessage,
} from './signature.js'
export {
	boolToBytes,
	boolToHex,
	bytesToBigInt,
	bytesToBigint,
	bytesToBool,
	bytesToHex,
	bytesToNumber,
	decodeAbiParameters,
	decodeErrorResult,
	decodeEventLog,
	decodeFunctionData,
	decodeFunctionResult,
	encodeAbiParameters,
	encodeDeployData,
	encodeErrorResult,
	encodeEventTopics,
	encodeFunctionData,
	encodeFunctionResult,
	encodePacked,
	formatAbi,
	formatEther,
	formatGwei,
	formatLog,
	fromBytes,
	fromHex,
	fromRlp,
	getAddress,
	hexToBigInt,
	hexToBool,
	hexToBytes,
	hexToNumber,
	hexToString,
	isAddress,
	isBytes,
	isHex,
	keccak256,
	mnemonicToAccount,
	numberToHex,
	parseAbi,
	parseEther,
	parseGwei,
	serializeTransaction,
	stringToHex,
	toBytes,
	toHex,
	toRlp,
} from './viem.js'
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
export type { EncodeEventTopicsParameters } from 'viem/utils'
export * from './invariant.js'
export type {
	BigIntToHex,
	JsonSerializable,
	JsonSerializableArray,
	JsonSerializableObject,
	JsonSerializableSet,
	SerializeToJson,
	SetToHex,
} from './SerializeToJson.js'
