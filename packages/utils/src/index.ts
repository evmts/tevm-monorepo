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
	AbiError,
	AbiEvent,
	AbiEventParameter,
	AbiFunction,
	AbiItemType,
	AbiParameter,
	AbiParametersToPrimitiveTypes,
	AbiParameterToPrimitiveType,
	AbiStateMutability,
	Account,
	Address,
	BlockNumber,
	BlockTag,
	ContractConstructorArgs,
	ContractErrorArgs,
	ContractErrorName,
	ContractFunctionArgs,
	ContractFunctionName,
	ContractFunctionReturnType,
	CreateEventFilterParameters,
	DecodeErrorResultReturnType,
	DecodeFunctionResultReturnType,
	EncodeDeployDataParameters,
	EncodeFunctionDataParameters,
	ExtractAbiError,
	ExtractAbiEvent,
	ExtractAbiEventNames,
	ExtractAbiEvents,
	ExtractAbiFunction,
	ExtractAbiFunctionNames,
	FormatAbi,
	GetEventArgs,
	HDAccount,
	Hex,
	IsAddressOptions,
	JsonRpcAccount,
	LocalAccount,
	NativeAccount,
	NativeHDAccount,
	NativeMnemonicAccount,
	NativePrivateKeyAccount,
	ParseAbi,
	SignMessageParameters,
	SignParameters,
	SignTypedDataParameters,
	SmartAccount,
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
/**
 * Data for initializing an Account
 */
export type AccountData = {
	nonce?: bigint
	balance?: bigint
	storageRoot?: Uint8Array
	codeHash?: Uint8Array
	codeSize?: number
	version?: number
}
/**
 * Interface for Account objects used by the state manager
 */
export type AccountInterface = {
	nonce: bigint
	balance: bigint
	storageRoot: Uint8Array
	codeHash: Uint8Array
	codeSize?: number | undefined
	isContract(): boolean
}
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
	hashTypedData,
	recoverAddress,
	recoverMessageAddress,
	recoverPublicKey,
	signMessage,
	signTypedData,
	verifyMessage,
	verifyTypedData,
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
	isAddressEqual,
	isBytes,
	isHex,
	keccak256,
	// Native account implementations (recommended - no viem dependency)
	nativePrivateKeyToAccount,
	nativeHdAccount,
	nativeMnemonicToAccount,
	generatePrivateKey,
	privateKeyToAddress,
	/**
	 * @deprecated Use nativeMnemonicToAccount instead - provides identical API with no viem dependency
	 */
	mnemonicToAccount,
	/**
	 * @deprecated Use nativePrivateKeyToAccount instead - provides identical API with no viem dependency
	 */
	privateKeyToAccount,
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
	trim,
	getContractError,
	RawContractError,
	ContractFunctionExecutionError,
	ContractFunctionRevertedError,
	ContractFunctionZeroDataError,
	createPublicClient,
	createWalletClient,
	createTransport,
	custom,
	defineChain,
	http,
	webSocket,
} from './viem.js'
// Native size function - get byte size of hex/bytes values
export { size } from './size.js'
// Native pad function - pad hex/bytes to target size
export { pad, padHex, padBytes, SizeExceedsPaddingSizeError } from './pad.js'
export type { PadOptions } from './pad.js'
// Native fork RPC client - provides viem-compatible API without viem dependency
export { createForkRpcClient } from './createForkRpcClient.js'
export type { ForkRpcClient, ProofResult, StorageProofEntry } from './fork-rpc-types.js'
// Native HTTP transport - provides viem-compatible http() API without viem dependency
export { nativeHttp } from './nativeHttp.js'
// Native WebSocket transport - provides viem-compatible webSocket() API without viem dependency
export { nativeWebSocket } from './nativeWebSocket.js'
// Native custom transport - provides viem-compatible custom() API without viem dependency
export { nativeCustom } from './nativeCustom.js'
// Native defineChain - provides viem-compatible defineChain() API without viem dependency
export { nativeDefineChain } from './nativeDefineChain.js'
// Native ERC-20 ABI constant - provides viem-compatible erc20Abi without viem dependency
export { erc20Abi } from './erc20Abi.js'
// Convert @tevm/chains format to viem-compatible Chain format
export { tevmChainToViemChain } from './tevmChainToViemChain.js'
// Chain types for native chain definitions (migrated from viem)
export type {
	Chain,
	ChainBlockExplorer,
	ChainContract,
	ChainFees,
	ChainFormatter,
	ChainFormatters,
	ChainNativeCurrency,
	ChainRpcUrls,
	ChainSerializers,
	SimpleChain,
} from './chain-types.js'
// Native provider types for fork client compatibility (migrated from viem)
export type {
	EIP1193RequestFn,
	EIP1193Parameters,
	EIP1474Methods,
	Transport,
	TransportConfig,
	PublicClient,
	RpcSchema,
	ClientConfig,
	Client,
	TestActions,
	PublicActions,
	WalletActions,
	PublicRpcSchema,
	TestRpcSchema,
} from './provider-types.js'
// Native RPC types for JSON-RPC schema definitions (migrated from viem)
export type {
	Index,
	Quantity,
	Status,
	TransactionType,
	TransactionReceipt,
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
export type { ExactPartial, Prettify } from './utility-types.js'
// Native Log types (migrated from viem)
export type { Log, Hash, LogTopic } from './log-types.js'
// Native parseEventLogs function (migrated from viem)
export { parseEventLogs } from './parseEventLogs.js'
export type { ParseEventLogsParameters, ParseEventLogsReturnType } from './parseEventLogs.js'
// Native Account Abstraction types (EIP-4337) - migrated from viem
export type { RpcUserOperation, SignedAuthorization } from './account-abstraction-types.js'
