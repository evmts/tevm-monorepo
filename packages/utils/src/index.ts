// Native EthjsLog type (migrated from @ethereumjs/evm)
export type { EthjsLog } from './EthjsLog.js'
// Native Proof types (migrated from @ethereumjs/statemanager)
export type { Proof, StorageProof } from './proof-types.js'
// Native Cache types (migrated from @ethereumjs/statemanager)
export { CacheType } from './cache-types.js'
export type { CacheType as CacheTypeValue, CacheOpts, CachesStateManagerOpts } from './cache-types.js'
// Native AccountCache and StorageCache implementations (migrated from @ethereumjs/statemanager)
export { AccountCache } from './AccountCache.js'
export { StorageCache } from './StorageCache.js'
// Native DB types (migrated from @ethereumjs/util)
export type {
	DB as Db,
	DBObject as DbObject,
	BatchDBOp as BatchDbOp,
	EncodingOpts,
	PutBatch,
	DelBatch,
} from './db-types.js'
// Native common types (migrated from @ethereumjs/util)
export type {
	AddressLike,
	BigIntLike,
	BytesLike,
	PrefixedHexString,
	TransformableToBytes,
	NestedUint8Array,
	NumericString,
} from './common-types.js'
export { isNestedUint8Array } from './common-types.js'
// WithdrawalData and JsonRpcWithdrawal are now provided by native implementation
export type { WithdrawalData, JsonRpcWithdrawal } from './withdrawal.js'
export type {
	Abi,
	AbiConstructor,
	AbiEvent,
	AbiFunction,
	AbiItemType,
	AbiParametersToPrimitiveTypes,
	AbiStateMutability,
	Account,
	Address,
	BlockNumber,
	BlockTag,
	ContractConstructorArgs,
	ContractFunctionArgs,
	ContractFunctionName,
	ContractFunctionReturnType,
	CreateEventFilterParameters,
	DecodeFunctionResultReturnType,
	EncodeDeployDataParameters,
	EncodeFunctionDataParameters,
	ExtractAbiEvent,
	ExtractAbiEventNames,
	ExtractAbiEvents,
	ExtractAbiFunction,
	ExtractAbiFunctionNames,
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
	// createAccount - migrated to native implementation in account-class.js
	// EthjsAccount - migrated to native implementation in account-class.js
	// createAddressFromString - migrated to native implementation in address.js
	// EthjsAddress - migrated to native implementation in address.js
	// ecrecover - migrated to native implementation in ecrecover.js
	// fetchFromProvider - migrated to native implementation in provider.js
	// ecsign was removed in newer versions
	// zeros was also removed
	// AsyncEventEmitter was also removed
	// getProvider - migrated to native implementation in provider.js
	// KECCAK256_RLP - migrated to native implementation in constants.js
	// KECCAK256_RLP_ARRAY - migrated to native implementation in constants.js
	// KeyEncoding - migrated to native implementation in encoding.js
	// randomBytes - migrated to native implementation in randomBytes.js
	// TypeOutput - migrated to native implementation in typeOutput.js
	// toType - migrated to native implementation in typeOutput.js
	// ValueEncoding - migrated to native implementation in encoding.js
	// Withdrawal - migrated to native implementation in withdrawal.js
	// createWithdrawal - migrated to native implementation in withdrawal.js
	// EIP-7702 - migrated to native implementation in eip7702.js
} from './ethereumjs.js'
// Native EIP-7702 implementation (migrated from @ethereumjs/util)
export {
	eoaCode7702RecoverAuthority,
	eoaCode7702SignAuthorization,
	eoaCode7702AuthorizationMessageToSign,
	eoaCode7702AuthorizationHashedMessageToSign,
	eoaCode7702AuthorizationListBytesItemToJSON,
	eoaCode7702AuthorizationListJSONItemToBytes,
	isEOACode7702AuthorizationList,
	isEOACode7702AuthorizationListBytes,
	EOA_CODE_7702_AUTHORITY_SIGNING_MAGIC,
} from './eip7702.js'
// Native Account implementation (migrated from @ethereumjs/util)
export { Account as EthjsAccount, createAccount } from './account-class.js'
// Native Address implementation (migrated from @ethereumjs/util)
export { Address as EthjsAddress, createAddressFromString, createZeroAddress, createAddressFromBigInt } from './address.js'
// Native Withdrawal implementation (migrated from @ethereumjs/util)
export { Withdrawal, createWithdrawal, createWithdrawalFromBytesArray } from './withdrawal.js'
// Native provider utilities (migrated from @ethereumjs/util)
export { fetchFromProvider, getProvider } from './provider.js'
// Native KeyEncoding and ValueEncoding implementation (migrated from @ethereumjs/util)
export { KeyEncoding, ValueEncoding } from './encoding.js'
// Native TypeOutput and toType implementation (migrated from @ethereumjs/util)
export { TypeOutput, toType } from './typeOutput.js'
// Native constant implementations (migrated from @ethereumjs/util)
export {
	GWEI_TO_WEI,
	BIGINT_0,
	BIGINT_1,
	MAX_UINT64,
	SECP256K1_ORDER_DIV_2,
	KECCAK256_RLP,
	KECCAK256_RLP_ARRAY,
	KECCAK256_NULL,
	KECCAK256_RLP_BYTES,
	KECCAK256_RLP_ARRAY_BYTES,
	KECCAK256_NULL_BYTES,
} from './constants.js'
// Native implementations (migrated from @ethereumjs/util)
export { bytesToUnprefixedHex } from './bytesToUnprefixedHex.js'
export { bytesToUtf8 } from './bytesToUtf8.js'
export { concatBytes } from './concatBytes.js'
export { equalsBytes } from './equalsBytes.js'
export { setLengthLeft } from './setLengthLeft.js'
export { randomBytes } from './randomBytes.js'
export { ecrecover } from './ecrecover.js'
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
	privateKeyToAddress,
	generatePrivateKey,
	numberToBytes,
	numberToHex,
	parseAbi,
	parseEther,
	parseGwei,
	parseUnits,
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
	ContractFunctionExecutionError,
	ContractFunctionRevertedError,
	ContractFunctionZeroDataError,
	createPublicClient,
	createTransport,
	custom,
	defineChain,
	http,
	webSocket,
} from './viem.js'
// Native provider types for fork client compatibility (migrated from viem)
export type {
	EIP1193RequestFn,
	Transport,
	TransportConfig,
	PublicClient,
} from './provider-types.js'
// Native RPC types for JSON-RPC schema definitions (migrated from viem)
export type {
	Index,
	Quantity,
	Status,
	TransactionType,
	RpcBlock,
	RpcBlockIdentifier,
	RpcBlockNumber,
	RpcFeeHistory,
	RpcLog,
	RpcProof,
	RpcStateOverride,
	RpcTransaction,
	RpcTransactionReceipt,
	RpcTransactionRequest,
	RpcUncle,
	RpcAccessList,
	RpcAccessListItem,
	RpcAuthorization,
	RpcAuthorizationList,
	RpcStorageProof,
	RpcStateMapping,
	RpcAccountStateOverride,
	RpcWithdrawal,
} from './rpc-types.js'
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
// Native EncodeEventTopicsParameters type (migrated from viem/utils)
export type { EncodeEventTopicsParameters, ContractEventName, ContractEventArgs } from './provider-types.js'
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
// Native utility types (migrated from viem)
export type { Prettify } from './utility-types.js'
