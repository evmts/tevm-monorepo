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
	// EIP-7702 EOA Code authorization utilities
	eoaCode7702RecoverAuthority,
	eoaCode7702SignAuthorization,
	eoaCode7702AuthorizationMessageToSign,
	eoaCode7702AuthorizationHashedMessageToSign,
	eoaCode7702AuthorizationListBytesItemToJSON,
	eoaCode7702AuthorizationListJSONItemToBytes,
	isEOACode7702AuthorizationList,
	EOA_CODE_7702_AUTHORITY_SIGNING_MAGIC,
	// Additional constants needed for EIP-7702 validation
	MAX_UINT64,
	SECP256K1_ORDER_DIV_2,
	BIGINT_0,
	BIGINT_1,
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
	concatHex,
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
	privateKeyToAccount,
	numberToBytes,
	numberToHex,
	parseAbi,
	parseEther,
	parseGwei,
	serializeTransaction,
	stringToBytes,
	stringToHex,
	toBytes,
	toEventSelector,
	toFunctionSelector,
	toHex,
	toRlp,
	getContractError,
	RawContractError,
	createPublicClient,
	createTransport,
	custom,
	http,
} from './viem.js'
// Re-export viem types for fork client compatibility
export type { EIP1193RequestFn, Transport, PublicClient } from 'viem'
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
