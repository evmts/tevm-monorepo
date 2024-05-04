**@tevm/opstack** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > createL1Client

# Function: createL1Client()

> **createL1Client**(`__namedParameters`): `object`

Creates a Tevm client preloaded and initialized with L1 contracts. This corresponds to the 3.0 major version of Optimism
When possible it uses the values from mainnet. For some constants this
isn't possible as currently this protocol isn't deployed to a testnet or mainnet.

All constants including vital OP stack addresses and owners are available and transactions may be sent mocking them using tevm `to` property.

## Parameters

▪ **\_\_namedParameters**: `object`= `{}`

▪ **\_\_namedParameters.chainId?**: `10`= `10`

## Returns

> ### call
>
> > **call**: `CallHandler`
>
> Executes a call against the VM. It is similar to `eth_call` but has more
> options for controlling the execution environment
>
> By default it does not modify the state after the call is complete but this can be configured.
>
> #### Example
>
> ```ts
> const res = tevm.call({
> to: '0x123...',
> data: '0x123...',
> from: '0x123...',
> gas: 1000000,
> gasPrice: 1n,
> skipBalance: true,
> }
> ```
>
> ### contract
>
> > **contract**: `ContractHandler`
>
> Executes a contract call against the VM. It is similar to `eth_call` but has more
> options for controlling the execution environment along with a typesafe API
> for creating the call via the contract abi.
>
> The contract must already be deployed. Otherwise see `script` which executes calls
> against undeployed contracts
>
> #### Example
>
> ```ts
> const res = await tevm.contract({
> to: '0x123...',
> abi: [...],
> function: 'run',
> args: ['world']
> from: '0x123...',
> gas: 1000000,
> gasPrice: 1n,
> skipBalance: true,
> }
> console.log(res.data) // "hello"
> ```
>
> ### dumpState
>
> > **dumpState**: `DumpStateHandler`
>
> Dumps the current state of the VM into a JSON-seralizable object
>
> State can be dumped as follows
>
> #### Example
>
> ```typescript
> const {state} = await tevm.dumpState()
> fs.writeFileSync('state.json', JSON.stringify(state))
> ```
>
> And then loaded as follows
>
> #### Example
>
> ```typescript
> const state = JSON.parse(fs.readFileSync('state.json'))
> await tevm.loadState({state})
> ```
>
> ### eth
>
> > **eth**: `object`
>
> Standard JSON-RPC methods for interacting with the VM
>
> #### See
>
> [JSON-RPC](https://ethereum.github.io/execution-apis/api-documentation/)
>
> ### eth.blockNumber
>
> > **eth.blockNumber**: `EthBlockNumberHandler`
>
> Returns the current block number
> Set the `tag` to a block number or block hash to get the balance at that block
> Block tag defaults to 'pending' tag which is the optimistic state of the VM
>
> #### See
>
> [JSON-RPC](https://ethereum.github.io/execution-apis/api-documentation/)
>
> #### Example
>
> ```ts
> const blockNumber = await tevm.eth.blockNumber()
> console.log(blockNumber) // 0n
> ```
>
> ### eth.call
>
> > **eth.call**: `EthCallHandler`
>
> Executes a call without modifying the state
> Set the `tag` to a block number or block hash to get the balance at that block
> Block tag defaults to 'pending' tag which is the optimistic state of the VM
>
> #### See
>
> [JSON-RPC](https://ethereum.github.io/execution-apis/api-documentation/)
>
> #### Example
>
> ```ts
> const res = await tevm.eth.call({to: '0x123...', data: '0x123...'})
> console.log(res) // "0x..."
> ```
>
> ### eth.chainId
>
> > **eth.chainId**: `EthChainIdHandler`
>
> Returns the current chain id
> Set the `tag` to a block number or block hash to get the balance at that block
> Block tag defaults to 'pending' tag which is the optimistic state of the VM
>
> #### See
>
> [JSON-RPC](https://ethereum.github.io/execution-apis/api-documentation/)
>
> #### Example
>
> ```ts
> const chainId = await tevm.eth.chainId()
> console.log(chainId) // 10n
> ```
>
> ### eth.gasPrice
>
> > **eth.gasPrice**: `EthGasPriceHandler`
>
> Returns the current gas price
> Set the `tag` to a block number or block hash to get the balance at that block
> Block tag defaults to 'pending' tag which is the optimistic state of the VM
>
> #### See
>
> [JSON-RPC](https://ethereum.github.io/execution-apis/api-documentation/)
>
> #### Example
>
> ```ts
> const gasPrice = await tevm.eth.gasPrice()
> console.log(gasPrice) // 0n
> ```
>
> ### eth.getBalance
>
> > **eth.getBalance**: `EthGetBalanceHandler`
>
> Returns the balance of a given address
> Set the `tag` to a block number or block hash to get the balance at that block
> Block tag defaults to 'pending' tag which is the optimistic state of the VM
>
> #### See
>
> [JSON-RPC](https://ethereum.github.io/execution-apis/api-documentation/)
>
> #### Example
>
> ```ts
> const balance = await tevm.eth.getBalance({address: '0x123...', tag: 'pending'})
> console.log(gasPrice) // 0n
> ```
>
> ### eth.getCode
>
> > **eth.getCode**: `EthGetCodeHandler`
>
> Returns code at a given address
> Set the `tag` to a block number or block hash to get the balance at that block
> Block tag defaults to 'pending' tag which is the optimistic state of the VM
>
> #### See
>
> [JSON-RPC](https://ethereum.github.io/execution-apis/api-documentation/)
>
> #### Example
>
> ```ts
> const code = await tevm.eth.getCode({address: '0x123...'})
> ```
>
> ### eth.getStorageAt
>
> > **eth.getStorageAt**: `EthGetStorageAtHandler`
>
> Returns storage at a given address and slot
> Set the `tag` to a block number or block hash to get the balance at that block
> Block tag defaults to 'pending' tag which is the optimistic state of the VM
>
> #### See
>
> [JSON-RPC](https://ethereum.github.io/execution-apis/api-documentation/)
>
> #### Example
>
> ```ts
> const storageValue = await tevm.eth.getStorageAt({address: '0x123...', position: 0})
> ```
>
> ### extend
>
> > **`readonly`** **extend**: \<`TExtension`\>(`decorator`) => `BaseClient`\<`"fork"` \| `"normal"`, `object` & `TExtension`\>
>
> Extends the base client with additional functionality. This enables optimal code splitting
> and extensibility
>
> #### Type parameters
>
> ▪ **TExtension** extends `Record`\<`string`, `any`\>
>
> #### Parameters
>
> ▪ **decorator**: (`client`) => `TExtension`
>
> ### forkUrl
>
> > **`readonly`** **forkUrl**?: `string`
>
> Fork url if the EVM is forked
>
> #### Example
>
> ```ts
> const client = createMemoryClient({ forkUrl: 'https://mainnet.infura.io/v3/your-api-key' })
> console.log(client.forkUrl)
> ```
>
> ### getAccount
>
> > **getAccount**: `GetAccountHandler`
>
> Gets the state of a specific ethereum address
>
> #### Example
>
> ```ts
> const res = tevm.getAccount({address: '0x123...'})
> console.log(res.deployedBytecode)
> console.log(res.nonce)
> console.log(res.balance)
> ```
>
> ### getReceiptsManager
>
> > **`readonly`** **getReceiptsManager**: () => `Promise`\<`ReceiptsManager`\>
>
> Interface for querying receipts and historical state
>
> ### getTxPool
>
> > **`readonly`** **getTxPool**: () => `Promise`\<`TxPool`\>
>
> Gets the pool of pending transactions to be included in next block
>
> ### getVm
>
> > **`readonly`** **getVm**: () => `Promise`\<`Vm`\>
>
> Internal instance of the VM. Can be used for lower level operations.
> Normally not recomended to use unless building libraries or extensions
> on top of Tevm.
>
> ### loadState
>
> > **loadState**: `LoadStateHandler`
>
> Loads a previously dumped state into the VM
>
> State can be dumped as follows
>
> #### Example
>
> ```typescript
> const {state} = await tevm.dumpState()
> fs.writeFileSync('state.json', JSON.stringify(state))
> ```
>
> And then loaded as follows
>
> #### Example
>
> ```typescript
> const state = JSON.parse(fs.readFileSync('state.json'))
> await tevm.loadState({state})
> ```
>
> ### logger
>
> > **`readonly`** **logger**: `Logger`
>
> The logger instance
>
> ### miningConfig
>
> > **`readonly`** **miningConfig**: `MiningConfig`
>
> The configuration for mining. Defaults to 'auto'
> - 'auto' will mine a block on every transaction
> - 'interval' will mine a block every `interval` milliseconds
> - 'manual' will not mine a block automatically and requires a manual call to `mineBlock`
>
> ### mode
>
> > **`readonly`** **mode**: `"fork"` \| `"normal"`
>
> The mode the current client is running in
> `fork` mode will fetch and cache all state from the block forked from the provided URL
> `normal` mode will not fetch any state and will only run the EVM in memory
>
> #### Example
>
> ```ts
> let client = createMemoryClient()
> console.log(client.mode) // 'normal'
> client = createMemoryClient({ forkUrl: 'https://mainnet.infura.io/v3/your-api-key' })
> console.log(client.mode) // 'fork'
> ```
>
> ### op
>
> > **op**: `object`
>
> ### op.BATCHER\_HASH
>
> > **op.BATCHER\_HASH**: `"0x0000000000000000000000006887246668a3b87f54deb3b94ba47a6f63f32985"`
>
> ### op.BATCH\_INBOX
>
> > **op.BATCH\_INBOX**: `"0xff00000000000000000000000000000011155420"`
>
> ### op.CHAIN\_ID
>
> > **op.CHAIN\_ID**: `10`
>
> ### op.DISPUTE\_GAME\_FACTORY\_OWNER
>
> > **op.DISPUTE\_GAME\_FACTORY\_OWNER**: \`0x${string}\`
>
> ### op.DisputeGameFactory
>
> > **op.DisputeGameFactory**: `Omit`\<`Script`\<`"DisputeGameFactory"`, readonly [`"constructor()"`, `"function create(uint32 _gameType, bytes32 _rootClaim, bytes _extraData) payable returns (address proxy_)"`, `"function findLatestGames(uint32 _gameType, uint256 _start, uint256 _n) view returns ((uint256 index, bytes32 metadata, uint64 timestamp, bytes32 rootClaim, bytes extraData)[] games_)"`, `"function gameAtIndex(uint256 _index) view returns (uint32 gameType_, uint64 timestamp_, address proxy_)"`, `"function gameCount() view returns (uint256 gameCount_)"`, `"function gameImpls(uint32) view returns (address)"`, `"function games(uint32 _gameType, bytes32 _rootClaim, bytes _extraData) view returns (address proxy_, uint64 timestamp_)"`, `"function getGameUUID(uint32 _gameType, bytes32 _rootClaim, bytes _extraData) pure returns (bytes32 uuid_)"`, `"function initBonds(uint32) view returns (uint256)"`, `"function initialize(address _owner)"`, `"function owner() view returns (address)"`, `"function renounceOwnership()"`, `"function setImplementation(uint32 _gameType, address _impl)"`, `"function setInitBond(uint32 _gameType, uint256 _initBond)"`, `"function transferOwnership(address newOwner)"`, `"function version() view returns (string)"`, `"event DisputeGameCreated(address indexed disputeProxy, uint32 indexed gameType, bytes32 indexed rootClaim)"`, `"event ImplementationSet(address indexed impl, uint32 indexed gameType)"`, `"event InitBondUpdated(uint32 indexed gameType, uint256 indexed newBond)"`, `"event Initialized(uint8 version)"`, `"event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)"`, `"error GameAlreadyExists(bytes32 uuid)"`, `"error InsufficientBond()"`, `"error NoImplementation(uint32 gameType)"`]\>, `"address"` \| `"events"` \| `"read"` \| `"write"`\> & `object`
>
> #### Type declaration
>
> ##### address
>
> > **address**: `"0x6901690169016901690169016901690169016901"`
>
> The deployed contract address
>
> ##### events
>
> > **events**: `EventActionCreator`\<readonly [`"constructor()"`, `"function create(uint32 _gameType, bytes32 _rootClaim, bytes _extraData) payable returns (address proxy_)"`, `"function findLatestGames(uint32 _gameType, uint256 _start, uint256 _n) view returns ((uint256 index, bytes32 metadata, uint64 timestamp, bytes32 rootClaim, bytes extraData)[] games_)"`, `"function gameAtIndex(uint256 _index) view returns (uint32 gameType_, uint64 timestamp_, address proxy_)"`, `"function gameCount() view returns (uint256 gameCount_)"`, `"function gameImpls(uint32) view returns (address)"`, `"function games(uint32 _gameType, bytes32 _rootClaim, bytes _extraData) view returns (address proxy_, uint64 timestamp_)"`, `"function getGameUUID(uint32 _gameType, bytes32 _rootClaim, bytes _extraData) pure returns (bytes32 uuid_)"`, `"function initBonds(uint32) view returns (uint256)"`, `"function initialize(address _owner)"`, `"function owner() view returns (address)"`, `"function renounceOwnership()"`, `"function setImplementation(uint32 _gameType, address _impl)"`, `"function setInitBond(uint32 _gameType, uint256 _initBond)"`, `"function transferOwnership(address newOwner)"`, `"function version() view returns (string)"`, `"event DisputeGameCreated(address indexed disputeProxy, uint32 indexed gameType, bytes32 indexed rootClaim)"`, `"event ImplementationSet(address indexed impl, uint32 indexed gameType)"`, `"event InitBondUpdated(uint32 indexed gameType, uint256 indexed newBond)"`, `"event Initialized(uint8 version)"`, `"event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)"`, `"error GameAlreadyExists(bytes32 uuid)"`, `"error InsufficientBond()"`, `"error NoImplementation(uint32 gameType)"`], \`0x${string}\`, \`0x${string}\`, `"0x6901690169016901690169016901690169016901"`\>
>
> Action creators for events. Can be used to create event filters in a typesafe way
>
> ###### Example
>
> ```typescript
> tevm.eth.getLog(
> MyScript.withAddress('0x420...').events.Transfer({ from: '0x1234...' }),
> )
> ===
>
> ##### read
>
> > **read**: `ReadActionCreator`\<readonly [`"constructor()"`, `"function create(uint32 _gameType, bytes32 _rootClaim, bytes _extraData) payable returns (address proxy_)"`, `"function findLatestGames(uint32 _gameType, uint256 _start, uint256 _n) view returns ((uint256 index, bytes32 metadata, uint64 timestamp, bytes32 rootClaim, bytes extraData)[] games_)"`, `"function gameAtIndex(uint256 _index) view returns (uint32 gameType_, uint64 timestamp_, address proxy_)"`, `"function gameCount() view returns (uint256 gameCount_)"`, `"function gameImpls(uint32) view returns (address)"`, `"function games(uint32 _gameType, bytes32 _rootClaim, bytes _extraData) view returns (address proxy_, uint64 timestamp_)"`, `"function getGameUUID(uint32 _gameType, bytes32 _rootClaim, bytes _extraData) pure returns (bytes32 uuid_)"`, `"function initBonds(uint32) view returns (uint256)"`, `"function initialize(address _owner)"`, `"function owner() view returns (address)"`, `"function renounceOwnership()"`, `"function setImplementation(uint32 _gameType, address _impl)"`, `"function setInitBond(uint32 _gameType, uint256 _initBond)"`, `"function transferOwnership(address newOwner)"`, `"function version() view returns (string)"`, `"event DisputeGameCreated(address indexed disputeProxy, uint32 indexed gameType, bytes32 indexed rootClaim)"`, `"event ImplementationSet(address indexed impl, uint32 indexed gameType)"`, `"event InitBondUpdated(uint32 indexed gameType, uint256 indexed newBond)"`, `"event Initialized(uint8 version)"`, `"event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)"`, `"error GameAlreadyExists(bytes32 uuid)"`, `"error InsufficientBond()"`, `"error NoImplementation(uint32 gameType)"`], \`0x${string}\`, \`0x${string}\`, `"0x6901690169016901690169016901690169016901"`\>
>
> Action creators for contract view and pure functions
>
> ###### Example
>
> ```typescript
> tevm.contract(
> MyScript.withAddress('0x420...').read.balanceOf('0x1234...'),
> )
> ```
>
> ##### write
>
> > **write**: `WriteActionCreator`\<readonly [`"constructor()"`, `"function create(uint32 _gameType, bytes32 _rootClaim, bytes _extraData) payable returns (address proxy_)"`, `"function findLatestGames(uint32 _gameType, uint256 _start, uint256 _n) view returns ((uint256 index, bytes32 metadata, uint64 timestamp, bytes32 rootClaim, bytes extraData)[] games_)"`, `"function gameAtIndex(uint256 _index) view returns (uint32 gameType_, uint64 timestamp_, address proxy_)"`, `"function gameCount() view returns (uint256 gameCount_)"`, `"function gameImpls(uint32) view returns (address)"`, `"function games(uint32 _gameType, bytes32 _rootClaim, bytes _extraData) view returns (address proxy_, uint64 timestamp_)"`, `"function getGameUUID(uint32 _gameType, bytes32 _rootClaim, bytes _extraData) pure returns (bytes32 uuid_)"`, `"function initBonds(uint32) view returns (uint256)"`, `"function initialize(address _owner)"`, `"function owner() view returns (address)"`, `"function renounceOwnership()"`, `"function setImplementation(uint32 _gameType, address _impl)"`, `"function setInitBond(uint32 _gameType, uint256 _initBond)"`, `"function transferOwnership(address newOwner)"`, `"function version() view returns (string)"`, `"event DisputeGameCreated(address indexed disputeProxy, uint32 indexed gameType, bytes32 indexed rootClaim)"`, `"event ImplementationSet(address indexed impl, uint32 indexed gameType)"`, `"event InitBondUpdated(uint32 indexed gameType, uint256 indexed newBond)"`, `"event Initialized(uint8 version)"`, `"event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)"`, `"error GameAlreadyExists(bytes32 uuid)"`, `"error InsufficientBond()"`, `"error NoImplementation(uint32 gameType)"`], \`0x${string}\`, \`0x${string}\`, `"0x6901690169016901690169016901690169016901"`\>
>
> Action creators for contract payable and nonpayable functions
>
> ###### Example
>
> ```typescript
> tevm.contract(
> MyScript.withAddress('0x420...').read.balanceOf('0x1234...'),
> )
> ```
>
> ### op.EXPLORER
>
> > **op.EXPLORER**: `"https://explorer.optimism.io"`
>
> ### op.GAS\_LIMIT
>
> > **op.GAS\_LIMIT**: `30000000n`
>
> ### op.GUARDIAN
>
> > **op.GUARDIAN**: `"0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"`
>
> ### op.L1CrossDomainMessenger
>
> > **op.L1CrossDomainMessenger**: `Omit`\<`Script`\<`"L1CrossDomainMessenger"`, readonly [`"constructor()"`, `"function MESSAGE_VERSION() view returns (uint16)"`, `"function MIN_GAS_CALLDATA_OVERHEAD() view returns (uint64)"`, `"function MIN_GAS_DYNAMIC_OVERHEAD_DENOMINATOR() view returns (uint64)"`, `"function MIN_GAS_DYNAMIC_OVERHEAD_NUMERATOR() view returns (uint64)"`, `"function OTHER_MESSENGER() view returns (address)"`, `"function PORTAL() view returns (address)"`, `"function RELAY_CALL_OVERHEAD() view returns (uint64)"`, `"function RELAY_CONSTANT_OVERHEAD() view returns (uint64)"`, `"function RELAY_GAS_CHECK_BUFFER() view returns (uint64)"`, `"function RELAY_RESERVED_GAS() view returns (uint64)"`, `"function baseGas(bytes _message, uint32 _minGasLimit) pure returns (uint64)"`, `"function failedMessages(bytes32) view returns (bool)"`, `"function initialize(address _superchainConfig, address _portal)"`, `"function messageNonce() view returns (uint256)"`, `"function otherMessenger() view returns (address)"`, `"function paused() view returns (bool)"`, `"function portal() view returns (address)"`, `"function relayMessage(uint256 _nonce, address _sender, address _target, uint256 _value, uint256 _minGasLimit, bytes _message) payable"`, `"function sendMessage(address _target, bytes _message, uint32 _minGasLimit) payable"`, `"function successfulMessages(bytes32) view returns (bool)"`, `"function superchainConfig() view returns (address)"`, `"function version() view returns (string)"`, `"function xDomainMessageSender() view returns (address)"`, `"event FailedRelayedMessage(bytes32 indexed msgHash)"`, `"event Initialized(uint8 version)"`, `"event RelayedMessage(bytes32 indexed msgHash)"`, `"event SentMessage(address indexed target, address sender, bytes message, uint256 messageNonce, uint256 gasLimit)"`, `"event SentMessageExtension1(address indexed sender, uint256 value)"`]\>, `"address"` \| `"events"` \| `"read"` \| `"write"`\> & `object`
>
> #### Type declaration
>
> ##### address
>
> > **address**: `"0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1"`
>
> The deployed contract address
>
> ##### events
>
> > **events**: `EventActionCreator`\<readonly [`"constructor()"`, `"function MESSAGE_VERSION() view returns (uint16)"`, `"function MIN_GAS_CALLDATA_OVERHEAD() view returns (uint64)"`, `"function MIN_GAS_DYNAMIC_OVERHEAD_DENOMINATOR() view returns (uint64)"`, `"function MIN_GAS_DYNAMIC_OVERHEAD_NUMERATOR() view returns (uint64)"`, `"function OTHER_MESSENGER() view returns (address)"`, `"function PORTAL() view returns (address)"`, `"function RELAY_CALL_OVERHEAD() view returns (uint64)"`, `"function RELAY_CONSTANT_OVERHEAD() view returns (uint64)"`, `"function RELAY_GAS_CHECK_BUFFER() view returns (uint64)"`, `"function RELAY_RESERVED_GAS() view returns (uint64)"`, `"function baseGas(bytes _message, uint32 _minGasLimit) pure returns (uint64)"`, `"function failedMessages(bytes32) view returns (bool)"`, `"function initialize(address _superchainConfig, address _portal)"`, `"function messageNonce() view returns (uint256)"`, `"function otherMessenger() view returns (address)"`, `"function paused() view returns (bool)"`, `"function portal() view returns (address)"`, `"function relayMessage(uint256 _nonce, address _sender, address _target, uint256 _value, uint256 _minGasLimit, bytes _message) payable"`, `"function sendMessage(address _target, bytes _message, uint32 _minGasLimit) payable"`, `"function successfulMessages(bytes32) view returns (bool)"`, `"function superchainConfig() view returns (address)"`, `"function version() view returns (string)"`, `"function xDomainMessageSender() view returns (address)"`, `"event FailedRelayedMessage(bytes32 indexed msgHash)"`, `"event Initialized(uint8 version)"`, `"event RelayedMessage(bytes32 indexed msgHash)"`, `"event SentMessage(address indexed target, address sender, bytes message, uint256 messageNonce, uint256 gasLimit)"`, `"event SentMessageExtension1(address indexed sender, uint256 value)"`], \`0x${string}\`, \`0x${string}\`, `"0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1"`\>
>
> Action creators for events. Can be used to create event filters in a typesafe way
>
> ###### Example
>
> ```typescript
> tevm.eth.getLog(
> MyScript.withAddress('0x420...').events.Transfer({ from: '0x1234...' }),
> )
> ===
>
> ##### read
>
> > **read**: `ReadActionCreator`\<readonly [`"constructor()"`, `"function MESSAGE_VERSION() view returns (uint16)"`, `"function MIN_GAS_CALLDATA_OVERHEAD() view returns (uint64)"`, `"function MIN_GAS_DYNAMIC_OVERHEAD_DENOMINATOR() view returns (uint64)"`, `"function MIN_GAS_DYNAMIC_OVERHEAD_NUMERATOR() view returns (uint64)"`, `"function OTHER_MESSENGER() view returns (address)"`, `"function PORTAL() view returns (address)"`, `"function RELAY_CALL_OVERHEAD() view returns (uint64)"`, `"function RELAY_CONSTANT_OVERHEAD() view returns (uint64)"`, `"function RELAY_GAS_CHECK_BUFFER() view returns (uint64)"`, `"function RELAY_RESERVED_GAS() view returns (uint64)"`, `"function baseGas(bytes _message, uint32 _minGasLimit) pure returns (uint64)"`, `"function failedMessages(bytes32) view returns (bool)"`, `"function initialize(address _superchainConfig, address _portal)"`, `"function messageNonce() view returns (uint256)"`, `"function otherMessenger() view returns (address)"`, `"function paused() view returns (bool)"`, `"function portal() view returns (address)"`, `"function relayMessage(uint256 _nonce, address _sender, address _target, uint256 _value, uint256 _minGasLimit, bytes _message) payable"`, `"function sendMessage(address _target, bytes _message, uint32 _minGasLimit) payable"`, `"function successfulMessages(bytes32) view returns (bool)"`, `"function superchainConfig() view returns (address)"`, `"function version() view returns (string)"`, `"function xDomainMessageSender() view returns (address)"`, `"event FailedRelayedMessage(bytes32 indexed msgHash)"`, `"event Initialized(uint8 version)"`, `"event RelayedMessage(bytes32 indexed msgHash)"`, `"event SentMessage(address indexed target, address sender, bytes message, uint256 messageNonce, uint256 gasLimit)"`, `"event SentMessageExtension1(address indexed sender, uint256 value)"`], \`0x${string}\`, \`0x${string}\`, `"0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1"`\>
>
> Action creators for contract view and pure functions
>
> ###### Example
>
> ```typescript
> tevm.contract(
> MyScript.withAddress('0x420...').read.balanceOf('0x1234...'),
> )
> ```
>
> ##### write
>
> > **write**: `WriteActionCreator`\<readonly [`"constructor()"`, `"function MESSAGE_VERSION() view returns (uint16)"`, `"function MIN_GAS_CALLDATA_OVERHEAD() view returns (uint64)"`, `"function MIN_GAS_DYNAMIC_OVERHEAD_DENOMINATOR() view returns (uint64)"`, `"function MIN_GAS_DYNAMIC_OVERHEAD_NUMERATOR() view returns (uint64)"`, `"function OTHER_MESSENGER() view returns (address)"`, `"function PORTAL() view returns (address)"`, `"function RELAY_CALL_OVERHEAD() view returns (uint64)"`, `"function RELAY_CONSTANT_OVERHEAD() view returns (uint64)"`, `"function RELAY_GAS_CHECK_BUFFER() view returns (uint64)"`, `"function RELAY_RESERVED_GAS() view returns (uint64)"`, `"function baseGas(bytes _message, uint32 _minGasLimit) pure returns (uint64)"`, `"function failedMessages(bytes32) view returns (bool)"`, `"function initialize(address _superchainConfig, address _portal)"`, `"function messageNonce() view returns (uint256)"`, `"function otherMessenger() view returns (address)"`, `"function paused() view returns (bool)"`, `"function portal() view returns (address)"`, `"function relayMessage(uint256 _nonce, address _sender, address _target, uint256 _value, uint256 _minGasLimit, bytes _message) payable"`, `"function sendMessage(address _target, bytes _message, uint32 _minGasLimit) payable"`, `"function successfulMessages(bytes32) view returns (bool)"`, `"function superchainConfig() view returns (address)"`, `"function version() view returns (string)"`, `"function xDomainMessageSender() view returns (address)"`, `"event FailedRelayedMessage(bytes32 indexed msgHash)"`, `"event Initialized(uint8 version)"`, `"event RelayedMessage(bytes32 indexed msgHash)"`, `"event SentMessage(address indexed target, address sender, bytes message, uint256 messageNonce, uint256 gasLimit)"`, `"event SentMessageExtension1(address indexed sender, uint256 value)"`], \`0x${string}\`, \`0x${string}\`, `"0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1"`\>
>
> Action creators for contract payable and nonpayable functions
>
> ###### Example
>
> ```typescript
> tevm.contract(
> MyScript.withAddress('0x420...').read.balanceOf('0x1234...'),
> )
> ```
>
> ### op.L1Erc721Bridge
>
> > **op.L1Erc721Bridge**: `Omit`\<`Script`\<`"L1ERC721Bridge"`, readonly [`"constructor()"`, `"function MESSENGER() view returns (address)"`, `"function OTHER_BRIDGE() view returns (address)"`, `"function bridgeERC721(address _localToken, address _remoteToken, uint256 _tokenId, uint32 _minGasLimit, bytes _extraData)"`, `"function bridgeERC721To(address _localToken, address _remoteToken, address _to, uint256 _tokenId, uint32 _minGasLimit, bytes _extraData)"`, `"function deposits(address, address, uint256) view returns (bool)"`, `"function finalizeBridgeERC721(address _localToken, address _remoteToken, address _from, address _to, uint256 _tokenId, bytes _extraData)"`, `"function initialize(address _messenger, address _superchainConfig)"`, `"function messenger() view returns (address)"`, `"function otherBridge() view returns (address)"`, `"function paused() view returns (bool)"`, `"function superchainConfig() view returns (address)"`, `"function version() view returns (string)"`, `"event ERC721BridgeFinalized(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 tokenId, bytes extraData)"`, `"event ERC721BridgeInitiated(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 tokenId, bytes extraData)"`, `"event Initialized(uint8 version)"`]\>, `"address"` \| `"events"` \| `"read"` \| `"write"`\> & `object`
>
> #### Type declaration
>
> ##### address
>
> > **address**: `"0x5a7749f83b81B301cAb5f48EB8516B986DAef23D"`
>
> The deployed contract address
>
> ##### events
>
> > **events**: `EventActionCreator`\<readonly [`"constructor()"`, `"function MESSENGER() view returns (address)"`, `"function OTHER_BRIDGE() view returns (address)"`, `"function bridgeERC721(address _localToken, address _remoteToken, uint256 _tokenId, uint32 _minGasLimit, bytes _extraData)"`, `"function bridgeERC721To(address _localToken, address _remoteToken, address _to, uint256 _tokenId, uint32 _minGasLimit, bytes _extraData)"`, `"function deposits(address, address, uint256) view returns (bool)"`, `"function finalizeBridgeERC721(address _localToken, address _remoteToken, address _from, address _to, uint256 _tokenId, bytes _extraData)"`, `"function initialize(address _messenger, address _superchainConfig)"`, `"function messenger() view returns (address)"`, `"function otherBridge() view returns (address)"`, `"function paused() view returns (bool)"`, `"function superchainConfig() view returns (address)"`, `"function version() view returns (string)"`, `"event ERC721BridgeFinalized(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 tokenId, bytes extraData)"`, `"event ERC721BridgeInitiated(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 tokenId, bytes extraData)"`, `"event Initialized(uint8 version)"`], \`0x${string}\`, \`0x${string}\`, `"0x5a7749f83b81B301cAb5f48EB8516B986DAef23D"`\>
>
> Action creators for events. Can be used to create event filters in a typesafe way
>
> ###### Example
>
> ```typescript
> tevm.eth.getLog(
> MyScript.withAddress('0x420...').events.Transfer({ from: '0x1234...' }),
> )
> ===
>
> ##### read
>
> > **read**: `ReadActionCreator`\<readonly [`"constructor()"`, `"function MESSENGER() view returns (address)"`, `"function OTHER_BRIDGE() view returns (address)"`, `"function bridgeERC721(address _localToken, address _remoteToken, uint256 _tokenId, uint32 _minGasLimit, bytes _extraData)"`, `"function bridgeERC721To(address _localToken, address _remoteToken, address _to, uint256 _tokenId, uint32 _minGasLimit, bytes _extraData)"`, `"function deposits(address, address, uint256) view returns (bool)"`, `"function finalizeBridgeERC721(address _localToken, address _remoteToken, address _from, address _to, uint256 _tokenId, bytes _extraData)"`, `"function initialize(address _messenger, address _superchainConfig)"`, `"function messenger() view returns (address)"`, `"function otherBridge() view returns (address)"`, `"function paused() view returns (bool)"`, `"function superchainConfig() view returns (address)"`, `"function version() view returns (string)"`, `"event ERC721BridgeFinalized(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 tokenId, bytes extraData)"`, `"event ERC721BridgeInitiated(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 tokenId, bytes extraData)"`, `"event Initialized(uint8 version)"`], \`0x${string}\`, \`0x${string}\`, `"0x5a7749f83b81B301cAb5f48EB8516B986DAef23D"`\>
>
> Action creators for contract view and pure functions
>
> ###### Example
>
> ```typescript
> tevm.contract(
> MyScript.withAddress('0x420...').read.balanceOf('0x1234...'),
> )
> ```
>
> ##### write
>
> > **write**: `WriteActionCreator`\<readonly [`"constructor()"`, `"function MESSENGER() view returns (address)"`, `"function OTHER_BRIDGE() view returns (address)"`, `"function bridgeERC721(address _localToken, address _remoteToken, uint256 _tokenId, uint32 _minGasLimit, bytes _extraData)"`, `"function bridgeERC721To(address _localToken, address _remoteToken, address _to, uint256 _tokenId, uint32 _minGasLimit, bytes _extraData)"`, `"function deposits(address, address, uint256) view returns (bool)"`, `"function finalizeBridgeERC721(address _localToken, address _remoteToken, address _from, address _to, uint256 _tokenId, bytes _extraData)"`, `"function initialize(address _messenger, address _superchainConfig)"`, `"function messenger() view returns (address)"`, `"function otherBridge() view returns (address)"`, `"function paused() view returns (bool)"`, `"function superchainConfig() view returns (address)"`, `"function version() view returns (string)"`, `"event ERC721BridgeFinalized(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 tokenId, bytes extraData)"`, `"event ERC721BridgeInitiated(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 tokenId, bytes extraData)"`, `"event Initialized(uint8 version)"`], \`0x${string}\`, \`0x${string}\`, `"0x5a7749f83b81B301cAb5f48EB8516B986DAef23D"`\>
>
> Action creators for contract payable and nonpayable functions
>
> ###### Example
>
> ```typescript
> tevm.contract(
> MyScript.withAddress('0x420...').read.balanceOf('0x1234...'),
> )
> ```
>
> ### op.L1StandardBridge
>
> > **op.L1StandardBridge**: `Omit`\<`Script`\<`"L1StandardBridge"`, readonly [`"constructor()"`, `"receive() external payable"`, `"function MESSENGER() view returns (address)"`, `"function OTHER_BRIDGE() view returns (address)"`, `"function bridgeERC20(address _localToken, address _remoteToken, uint256 _amount, uint32 _minGasLimit, bytes _extraData)"`, `"function bridgeERC20To(address _localToken, address _remoteToken, address _to, uint256 _amount, uint32 _minGasLimit, bytes _extraData)"`, `"function bridgeETH(uint32 _minGasLimit, bytes _extraData) payable"`, `"function bridgeETHTo(address _to, uint32 _minGasLimit, bytes _extraData) payable"`, `"function depositERC20(address _l1Token, address _l2Token, uint256 _amount, uint32 _minGasLimit, bytes _extraData)"`, `"function depositERC20To(address _l1Token, address _l2Token, address _to, uint256 _amount, uint32 _minGasLimit, bytes _extraData)"`, `"function depositETH(uint32 _minGasLimit, bytes _extraData) payable"`, `"function depositETHTo(address _to, uint32 _minGasLimit, bytes _extraData) payable"`, `"function deposits(address, address) view returns (uint256)"`, `"function finalizeBridgeERC20(address _localToken, address _remoteToken, address _from, address _to, uint256 _amount, bytes _extraData)"`, `"function finalizeBridgeETH(address _from, address _to, uint256 _amount, bytes _extraData) payable"`, `"function finalizeERC20Withdrawal(address _l1Token, address _l2Token, address _from, address _to, uint256 _amount, bytes _extraData)"`, `"function finalizeETHWithdrawal(address _from, address _to, uint256 _amount, bytes _extraData) payable"`, `"function initialize(address _messenger, address _superchainConfig)"`, `"function l2TokenBridge() view returns (address)"`, `"function messenger() view returns (address)"`, `"function otherBridge() view returns (address)"`, `"function paused() view returns (bool)"`, `"function superchainConfig() view returns (address)"`, `"function version() view returns (string)"`, `"event ERC20BridgeFinalized(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 amount, bytes extraData)"`, `"event ERC20BridgeInitiated(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 amount, bytes extraData)"`, `"event ERC20DepositInitiated(address indexed l1Token, address indexed l2Token, address indexed from, address to, uint256 amount, bytes extraData)"`, `"event ERC20WithdrawalFinalized(address indexed l1Token, address indexed l2Token, address indexed from, address to, uint256 amount, bytes extraData)"`, `"event ETHBridgeFinalized(address indexed from, address indexed to, uint256 amount, bytes extraData)"`, `"event ETHBridgeInitiated(address indexed from, address indexed to, uint256 amount, bytes extraData)"`, `"event ETHDepositInitiated(address indexed from, address indexed to, uint256 amount, bytes extraData)"`, `"event ETHWithdrawalFinalized(address indexed from, address indexed to, uint256 amount, bytes extraData)"`, `"event Initialized(uint8 version)"`]\>, `"address"` \| `"events"` \| `"read"` \| `"write"`\> & `object`
>
> #### Type declaration
>
> ##### address
>
> > **address**: `"0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1"`
>
> The deployed contract address
>
> ##### events
>
> > **events**: `EventActionCreator`\<readonly [`"constructor()"`, `"receive() external payable"`, `"function MESSENGER() view returns (address)"`, `"function OTHER_BRIDGE() view returns (address)"`, `"function bridgeERC20(address _localToken, address _remoteToken, uint256 _amount, uint32 _minGasLimit, bytes _extraData)"`, `"function bridgeERC20To(address _localToken, address _remoteToken, address _to, uint256 _amount, uint32 _minGasLimit, bytes _extraData)"`, `"function bridgeETH(uint32 _minGasLimit, bytes _extraData) payable"`, `"function bridgeETHTo(address _to, uint32 _minGasLimit, bytes _extraData) payable"`, `"function depositERC20(address _l1Token, address _l2Token, uint256 _amount, uint32 _minGasLimit, bytes _extraData)"`, `"function depositERC20To(address _l1Token, address _l2Token, address _to, uint256 _amount, uint32 _minGasLimit, bytes _extraData)"`, `"function depositETH(uint32 _minGasLimit, bytes _extraData) payable"`, `"function depositETHTo(address _to, uint32 _minGasLimit, bytes _extraData) payable"`, `"function deposits(address, address) view returns (uint256)"`, `"function finalizeBridgeERC20(address _localToken, address _remoteToken, address _from, address _to, uint256 _amount, bytes _extraData)"`, `"function finalizeBridgeETH(address _from, address _to, uint256 _amount, bytes _extraData) payable"`, `"function finalizeERC20Withdrawal(address _l1Token, address _l2Token, address _from, address _to, uint256 _amount, bytes _extraData)"`, `"function finalizeETHWithdrawal(address _from, address _to, uint256 _amount, bytes _extraData) payable"`, `"function initialize(address _messenger, address _superchainConfig)"`, `"function l2TokenBridge() view returns (address)"`, `"function messenger() view returns (address)"`, `"function otherBridge() view returns (address)"`, `"function paused() view returns (bool)"`, `"function superchainConfig() view returns (address)"`, `"function version() view returns (string)"`, `"event ERC20BridgeFinalized(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 amount, bytes extraData)"`, `"event ERC20BridgeInitiated(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 amount, bytes extraData)"`, `"event ERC20DepositInitiated(address indexed l1Token, address indexed l2Token, address indexed from, address to, uint256 amount, bytes extraData)"`, `"event ERC20WithdrawalFinalized(address indexed l1Token, address indexed l2Token, address indexed from, address to, uint256 amount, bytes extraData)"`, `"event ETHBridgeFinalized(address indexed from, address indexed to, uint256 amount, bytes extraData)"`, `"event ETHBridgeInitiated(address indexed from, address indexed to, uint256 amount, bytes extraData)"`, `"event ETHDepositInitiated(address indexed from, address indexed to, uint256 amount, bytes extraData)"`, `"event ETHWithdrawalFinalized(address indexed from, address indexed to, uint256 amount, bytes extraData)"`, `"event Initialized(uint8 version)"`], \`0x${string}\`, \`0x${string}\`, `"0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1"`\>
>
> Action creators for events. Can be used to create event filters in a typesafe way
>
> ###### Example
>
> ```typescript
> tevm.eth.getLog(
> MyScript.withAddress('0x420...').events.Transfer({ from: '0x1234...' }),
> )
> ===
>
> ##### read
>
> > **read**: `ReadActionCreator`\<readonly [`"constructor()"`, `"receive() external payable"`, `"function MESSENGER() view returns (address)"`, `"function OTHER_BRIDGE() view returns (address)"`, `"function bridgeERC20(address _localToken, address _remoteToken, uint256 _amount, uint32 _minGasLimit, bytes _extraData)"`, `"function bridgeERC20To(address _localToken, address _remoteToken, address _to, uint256 _amount, uint32 _minGasLimit, bytes _extraData)"`, `"function bridgeETH(uint32 _minGasLimit, bytes _extraData) payable"`, `"function bridgeETHTo(address _to, uint32 _minGasLimit, bytes _extraData) payable"`, `"function depositERC20(address _l1Token, address _l2Token, uint256 _amount, uint32 _minGasLimit, bytes _extraData)"`, `"function depositERC20To(address _l1Token, address _l2Token, address _to, uint256 _amount, uint32 _minGasLimit, bytes _extraData)"`, `"function depositETH(uint32 _minGasLimit, bytes _extraData) payable"`, `"function depositETHTo(address _to, uint32 _minGasLimit, bytes _extraData) payable"`, `"function deposits(address, address) view returns (uint256)"`, `"function finalizeBridgeERC20(address _localToken, address _remoteToken, address _from, address _to, uint256 _amount, bytes _extraData)"`, `"function finalizeBridgeETH(address _from, address _to, uint256 _amount, bytes _extraData) payable"`, `"function finalizeERC20Withdrawal(address _l1Token, address _l2Token, address _from, address _to, uint256 _amount, bytes _extraData)"`, `"function finalizeETHWithdrawal(address _from, address _to, uint256 _amount, bytes _extraData) payable"`, `"function initialize(address _messenger, address _superchainConfig)"`, `"function l2TokenBridge() view returns (address)"`, `"function messenger() view returns (address)"`, `"function otherBridge() view returns (address)"`, `"function paused() view returns (bool)"`, `"function superchainConfig() view returns (address)"`, `"function version() view returns (string)"`, `"event ERC20BridgeFinalized(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 amount, bytes extraData)"`, `"event ERC20BridgeInitiated(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 amount, bytes extraData)"`, `"event ERC20DepositInitiated(address indexed l1Token, address indexed l2Token, address indexed from, address to, uint256 amount, bytes extraData)"`, `"event ERC20WithdrawalFinalized(address indexed l1Token, address indexed l2Token, address indexed from, address to, uint256 amount, bytes extraData)"`, `"event ETHBridgeFinalized(address indexed from, address indexed to, uint256 amount, bytes extraData)"`, `"event ETHBridgeInitiated(address indexed from, address indexed to, uint256 amount, bytes extraData)"`, `"event ETHDepositInitiated(address indexed from, address indexed to, uint256 amount, bytes extraData)"`, `"event ETHWithdrawalFinalized(address indexed from, address indexed to, uint256 amount, bytes extraData)"`, `"event Initialized(uint8 version)"`], \`0x${string}\`, \`0x${string}\`, `"0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1"`\>
>
> Action creators for contract view and pure functions
>
> ###### Example
>
> ```typescript
> tevm.contract(
> MyScript.withAddress('0x420...').read.balanceOf('0x1234...'),
> )
> ```
>
> ##### write
>
> > **write**: `WriteActionCreator`\<readonly [`"constructor()"`, `"receive() external payable"`, `"function MESSENGER() view returns (address)"`, `"function OTHER_BRIDGE() view returns (address)"`, `"function bridgeERC20(address _localToken, address _remoteToken, uint256 _amount, uint32 _minGasLimit, bytes _extraData)"`, `"function bridgeERC20To(address _localToken, address _remoteToken, address _to, uint256 _amount, uint32 _minGasLimit, bytes _extraData)"`, `"function bridgeETH(uint32 _minGasLimit, bytes _extraData) payable"`, `"function bridgeETHTo(address _to, uint32 _minGasLimit, bytes _extraData) payable"`, `"function depositERC20(address _l1Token, address _l2Token, uint256 _amount, uint32 _minGasLimit, bytes _extraData)"`, `"function depositERC20To(address _l1Token, address _l2Token, address _to, uint256 _amount, uint32 _minGasLimit, bytes _extraData)"`, `"function depositETH(uint32 _minGasLimit, bytes _extraData) payable"`, `"function depositETHTo(address _to, uint32 _minGasLimit, bytes _extraData) payable"`, `"function deposits(address, address) view returns (uint256)"`, `"function finalizeBridgeERC20(address _localToken, address _remoteToken, address _from, address _to, uint256 _amount, bytes _extraData)"`, `"function finalizeBridgeETH(address _from, address _to, uint256 _amount, bytes _extraData) payable"`, `"function finalizeERC20Withdrawal(address _l1Token, address _l2Token, address _from, address _to, uint256 _amount, bytes _extraData)"`, `"function finalizeETHWithdrawal(address _from, address _to, uint256 _amount, bytes _extraData) payable"`, `"function initialize(address _messenger, address _superchainConfig)"`, `"function l2TokenBridge() view returns (address)"`, `"function messenger() view returns (address)"`, `"function otherBridge() view returns (address)"`, `"function paused() view returns (bool)"`, `"function superchainConfig() view returns (address)"`, `"function version() view returns (string)"`, `"event ERC20BridgeFinalized(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 amount, bytes extraData)"`, `"event ERC20BridgeInitiated(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 amount, bytes extraData)"`, `"event ERC20DepositInitiated(address indexed l1Token, address indexed l2Token, address indexed from, address to, uint256 amount, bytes extraData)"`, `"event ERC20WithdrawalFinalized(address indexed l1Token, address indexed l2Token, address indexed from, address to, uint256 amount, bytes extraData)"`, `"event ETHBridgeFinalized(address indexed from, address indexed to, uint256 amount, bytes extraData)"`, `"event ETHBridgeInitiated(address indexed from, address indexed to, uint256 amount, bytes extraData)"`, `"event ETHDepositInitiated(address indexed from, address indexed to, uint256 amount, bytes extraData)"`, `"event ETHWithdrawalFinalized(address indexed from, address indexed to, uint256 amount, bytes extraData)"`, `"event Initialized(uint8 version)"`], \`0x${string}\`, \`0x${string}\`, `"0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1"`\>
>
> Action creators for contract payable and nonpayable functions
>
> ###### Example
>
> ```typescript
> tevm.contract(
> MyScript.withAddress('0x420...').read.balanceOf('0x1234...'),
> )
> ```
>
> ### op.L2OutputOracle
>
> > **op.L2OutputOracle**: `Omit`\<`Script`\<`"L2OutputOracle"`, readonly [`"constructor()"`, `"function CHALLENGER() view returns (address)"`, `"function FINALIZATION_PERIOD_SECONDS() view returns (uint256)"`, `"function L2_BLOCK_TIME() view returns (uint256)"`, `"function PROPOSER() view returns (address)"`, `"function SUBMISSION_INTERVAL() view returns (uint256)"`, `"function challenger() view returns (address)"`, `"function computeL2Timestamp(uint256 _l2BlockNumber) view returns (uint256)"`, `"function deleteL2Outputs(uint256 _l2OutputIndex)"`, `"function finalizationPeriodSeconds() view returns (uint256)"`, `"function getL2Output(uint256 _l2OutputIndex) view returns ((bytes32 outputRoot, uint128 timestamp, uint128 l2BlockNumber))"`, `"function getL2OutputAfter(uint256 _l2BlockNumber) view returns ((bytes32 outputRoot, uint128 timestamp, uint128 l2BlockNumber))"`, `"function getL2OutputIndexAfter(uint256 _l2BlockNumber) view returns (uint256)"`, `"function initialize(uint256 _submissionInterval, uint256 _l2BlockTime, uint256 _startingBlockNumber, uint256 _startingTimestamp, address _proposer, address _challenger, uint256 _finalizationPeriodSeconds)"`, `"function l2BlockTime() view returns (uint256)"`, `"function latestBlockNumber() view returns (uint256)"`, `"function latestOutputIndex() view returns (uint256)"`, `"function nextBlockNumber() view returns (uint256)"`, `"function nextOutputIndex() view returns (uint256)"`, `"function proposeL2Output(bytes32 _outputRoot, uint256 _l2BlockNumber, bytes32 _l1BlockHash, uint256 _l1BlockNumber) payable"`, `"function proposer() view returns (address)"`, `"function startingBlockNumber() view returns (uint256)"`, `"function startingTimestamp() view returns (uint256)"`, `"function submissionInterval() view returns (uint256)"`, `"function version() view returns (string)"`, `"event Initialized(uint8 version)"`, `"event OutputProposed(bytes32 indexed outputRoot, uint256 indexed l2OutputIndex, uint256 indexed l2BlockNumber, uint256 l1Timestamp)"`, `"event OutputsDeleted(uint256 indexed prevNextOutputIndex, uint256 indexed newNextOutputIndex)"`]\>, `"address"` \| `"events"` \| `"read"` \| `"write"`\> & `object`
>
> #### Type declaration
>
> ##### address
>
> > **address**: `"0xdfe97868233d1aa22e815a266982f2cf17685a27"`
>
> The deployed contract address
>
> ##### events
>
> > **events**: `EventActionCreator`\<readonly [`"constructor()"`, `"function CHALLENGER() view returns (address)"`, `"function FINALIZATION_PERIOD_SECONDS() view returns (uint256)"`, `"function L2_BLOCK_TIME() view returns (uint256)"`, `"function PROPOSER() view returns (address)"`, `"function SUBMISSION_INTERVAL() view returns (uint256)"`, `"function challenger() view returns (address)"`, `"function computeL2Timestamp(uint256 _l2BlockNumber) view returns (uint256)"`, `"function deleteL2Outputs(uint256 _l2OutputIndex)"`, `"function finalizationPeriodSeconds() view returns (uint256)"`, `"function getL2Output(uint256 _l2OutputIndex) view returns ((bytes32 outputRoot, uint128 timestamp, uint128 l2BlockNumber))"`, `"function getL2OutputAfter(uint256 _l2BlockNumber) view returns ((bytes32 outputRoot, uint128 timestamp, uint128 l2BlockNumber))"`, `"function getL2OutputIndexAfter(uint256 _l2BlockNumber) view returns (uint256)"`, `"function initialize(uint256 _submissionInterval, uint256 _l2BlockTime, uint256 _startingBlockNumber, uint256 _startingTimestamp, address _proposer, address _challenger, uint256 _finalizationPeriodSeconds)"`, `"function l2BlockTime() view returns (uint256)"`, `"function latestBlockNumber() view returns (uint256)"`, `"function latestOutputIndex() view returns (uint256)"`, `"function nextBlockNumber() view returns (uint256)"`, `"function nextOutputIndex() view returns (uint256)"`, `"function proposeL2Output(bytes32 _outputRoot, uint256 _l2BlockNumber, bytes32 _l1BlockHash, uint256 _l1BlockNumber) payable"`, `"function proposer() view returns (address)"`, `"function startingBlockNumber() view returns (uint256)"`, `"function startingTimestamp() view returns (uint256)"`, `"function submissionInterval() view returns (uint256)"`, `"function version() view returns (string)"`, `"event Initialized(uint8 version)"`, `"event OutputProposed(bytes32 indexed outputRoot, uint256 indexed l2OutputIndex, uint256 indexed l2BlockNumber, uint256 l1Timestamp)"`, `"event OutputsDeleted(uint256 indexed prevNextOutputIndex, uint256 indexed newNextOutputIndex)"`], \`0x${string}\`, \`0x${string}\`, `"0xdfe97868233d1aa22e815a266982f2cf17685a27"`\>
>
> Action creators for events. Can be used to create event filters in a typesafe way
>
> ###### Example
>
> ```typescript
> tevm.eth.getLog(
> MyScript.withAddress('0x420...').events.Transfer({ from: '0x1234...' }),
> )
> ===
>
> ##### read
>
> > **read**: `ReadActionCreator`\<readonly [`"constructor()"`, `"function CHALLENGER() view returns (address)"`, `"function FINALIZATION_PERIOD_SECONDS() view returns (uint256)"`, `"function L2_BLOCK_TIME() view returns (uint256)"`, `"function PROPOSER() view returns (address)"`, `"function SUBMISSION_INTERVAL() view returns (uint256)"`, `"function challenger() view returns (address)"`, `"function computeL2Timestamp(uint256 _l2BlockNumber) view returns (uint256)"`, `"function deleteL2Outputs(uint256 _l2OutputIndex)"`, `"function finalizationPeriodSeconds() view returns (uint256)"`, `"function getL2Output(uint256 _l2OutputIndex) view returns ((bytes32 outputRoot, uint128 timestamp, uint128 l2BlockNumber))"`, `"function getL2OutputAfter(uint256 _l2BlockNumber) view returns ((bytes32 outputRoot, uint128 timestamp, uint128 l2BlockNumber))"`, `"function getL2OutputIndexAfter(uint256 _l2BlockNumber) view returns (uint256)"`, `"function initialize(uint256 _submissionInterval, uint256 _l2BlockTime, uint256 _startingBlockNumber, uint256 _startingTimestamp, address _proposer, address _challenger, uint256 _finalizationPeriodSeconds)"`, `"function l2BlockTime() view returns (uint256)"`, `"function latestBlockNumber() view returns (uint256)"`, `"function latestOutputIndex() view returns (uint256)"`, `"function nextBlockNumber() view returns (uint256)"`, `"function nextOutputIndex() view returns (uint256)"`, `"function proposeL2Output(bytes32 _outputRoot, uint256 _l2BlockNumber, bytes32 _l1BlockHash, uint256 _l1BlockNumber) payable"`, `"function proposer() view returns (address)"`, `"function startingBlockNumber() view returns (uint256)"`, `"function startingTimestamp() view returns (uint256)"`, `"function submissionInterval() view returns (uint256)"`, `"function version() view returns (string)"`, `"event Initialized(uint8 version)"`, `"event OutputProposed(bytes32 indexed outputRoot, uint256 indexed l2OutputIndex, uint256 indexed l2BlockNumber, uint256 l1Timestamp)"`, `"event OutputsDeleted(uint256 indexed prevNextOutputIndex, uint256 indexed newNextOutputIndex)"`], \`0x${string}\`, \`0x${string}\`, `"0xdfe97868233d1aa22e815a266982f2cf17685a27"`\>
>
> Action creators for contract view and pure functions
>
> ###### Example
>
> ```typescript
> tevm.contract(
> MyScript.withAddress('0x420...').read.balanceOf('0x1234...'),
> )
> ```
>
> ##### write
>
> > **write**: `WriteActionCreator`\<readonly [`"constructor()"`, `"function CHALLENGER() view returns (address)"`, `"function FINALIZATION_PERIOD_SECONDS() view returns (uint256)"`, `"function L2_BLOCK_TIME() view returns (uint256)"`, `"function PROPOSER() view returns (address)"`, `"function SUBMISSION_INTERVAL() view returns (uint256)"`, `"function challenger() view returns (address)"`, `"function computeL2Timestamp(uint256 _l2BlockNumber) view returns (uint256)"`, `"function deleteL2Outputs(uint256 _l2OutputIndex)"`, `"function finalizationPeriodSeconds() view returns (uint256)"`, `"function getL2Output(uint256 _l2OutputIndex) view returns ((bytes32 outputRoot, uint128 timestamp, uint128 l2BlockNumber))"`, `"function getL2OutputAfter(uint256 _l2BlockNumber) view returns ((bytes32 outputRoot, uint128 timestamp, uint128 l2BlockNumber))"`, `"function getL2OutputIndexAfter(uint256 _l2BlockNumber) view returns (uint256)"`, `"function initialize(uint256 _submissionInterval, uint256 _l2BlockTime, uint256 _startingBlockNumber, uint256 _startingTimestamp, address _proposer, address _challenger, uint256 _finalizationPeriodSeconds)"`, `"function l2BlockTime() view returns (uint256)"`, `"function latestBlockNumber() view returns (uint256)"`, `"function latestOutputIndex() view returns (uint256)"`, `"function nextBlockNumber() view returns (uint256)"`, `"function nextOutputIndex() view returns (uint256)"`, `"function proposeL2Output(bytes32 _outputRoot, uint256 _l2BlockNumber, bytes32 _l1BlockHash, uint256 _l1BlockNumber) payable"`, `"function proposer() view returns (address)"`, `"function startingBlockNumber() view returns (uint256)"`, `"function startingTimestamp() view returns (uint256)"`, `"function submissionInterval() view returns (uint256)"`, `"function version() view returns (string)"`, `"event Initialized(uint8 version)"`, `"event OutputProposed(bytes32 indexed outputRoot, uint256 indexed l2OutputIndex, uint256 indexed l2BlockNumber, uint256 l1Timestamp)"`, `"event OutputsDeleted(uint256 indexed prevNextOutputIndex, uint256 indexed newNextOutputIndex)"`], \`0x${string}\`, \`0x${string}\`, `"0xdfe97868233d1aa22e815a266982f2cf17685a27"`\>
>
> Action creators for contract payable and nonpayable functions
>
> ###### Example
>
> ```typescript
> tevm.contract(
> MyScript.withAddress('0x420...').read.balanceOf('0x1234...'),
> )
> ```
>
> ### op.OVERHEAD
>
> > **op.OVERHEAD**: `188n`
>
> ### op.OptimismMintableERC20Factory
>
> > **op.OptimismMintableERC20Factory**: `Omit`\<`Script`\<`"OptimismMintableERC20Factory"`, readonly [`"constructor()"`, `"function BRIDGE() view returns (address)"`, `"function bridge() view returns (address)"`, `"function createOptimismMintableERC20(address _remoteToken, string _name, string _symbol) returns (address)"`, `"function createOptimismMintableERC20WithDecimals(address _remoteToken, string _name, string _symbol, uint8 _decimals) returns (address)"`, `"function createStandardL2Token(address _remoteToken, string _name, string _symbol) returns (address)"`, `"function initialize(address _bridge)"`, `"function version() view returns (string)"`, `"event Initialized(uint8 version)"`, `"event OptimismMintableERC20Created(address indexed localToken, address indexed remoteToken, address deployer)"`, `"event StandardL2TokenCreated(address indexed remoteToken, address indexed localToken)"`]\>, `"address"` \| `"events"` \| `"read"` \| `"write"`\> & `object`
>
> #### Type declaration
>
> ##### address
>
> > **address**: `"0x75505a97BD334E7BD3C476893285569C4136Fa0F"`
>
> The deployed contract address
>
> ##### events
>
> > **events**: `EventActionCreator`\<readonly [`"constructor()"`, `"function BRIDGE() view returns (address)"`, `"function bridge() view returns (address)"`, `"function createOptimismMintableERC20(address _remoteToken, string _name, string _symbol) returns (address)"`, `"function createOptimismMintableERC20WithDecimals(address _remoteToken, string _name, string _symbol, uint8 _decimals) returns (address)"`, `"function createStandardL2Token(address _remoteToken, string _name, string _symbol) returns (address)"`, `"function initialize(address _bridge)"`, `"function version() view returns (string)"`, `"event Initialized(uint8 version)"`, `"event OptimismMintableERC20Created(address indexed localToken, address indexed remoteToken, address deployer)"`, `"event StandardL2TokenCreated(address indexed remoteToken, address indexed localToken)"`], \`0x${string}\`, \`0x${string}\`, `"0x75505a97BD334E7BD3C476893285569C4136Fa0F"`\>
>
> Action creators for events. Can be used to create event filters in a typesafe way
>
> ###### Example
>
> ```typescript
> tevm.eth.getLog(
> MyScript.withAddress('0x420...').events.Transfer({ from: '0x1234...' }),
> )
> ===
>
> ##### read
>
> > **read**: `ReadActionCreator`\<readonly [`"constructor()"`, `"function BRIDGE() view returns (address)"`, `"function bridge() view returns (address)"`, `"function createOptimismMintableERC20(address _remoteToken, string _name, string _symbol) returns (address)"`, `"function createOptimismMintableERC20WithDecimals(address _remoteToken, string _name, string _symbol, uint8 _decimals) returns (address)"`, `"function createStandardL2Token(address _remoteToken, string _name, string _symbol) returns (address)"`, `"function initialize(address _bridge)"`, `"function version() view returns (string)"`, `"event Initialized(uint8 version)"`, `"event OptimismMintableERC20Created(address indexed localToken, address indexed remoteToken, address deployer)"`, `"event StandardL2TokenCreated(address indexed remoteToken, address indexed localToken)"`], \`0x${string}\`, \`0x${string}\`, `"0x75505a97BD334E7BD3C476893285569C4136Fa0F"`\>
>
> Action creators for contract view and pure functions
>
> ###### Example
>
> ```typescript
> tevm.contract(
> MyScript.withAddress('0x420...').read.balanceOf('0x1234...'),
> )
> ```
>
> ##### write
>
> > **write**: `WriteActionCreator`\<readonly [`"constructor()"`, `"function BRIDGE() view returns (address)"`, `"function bridge() view returns (address)"`, `"function createOptimismMintableERC20(address _remoteToken, string _name, string _symbol) returns (address)"`, `"function createOptimismMintableERC20WithDecimals(address _remoteToken, string _name, string _symbol, uint8 _decimals) returns (address)"`, `"function createStandardL2Token(address _remoteToken, string _name, string _symbol) returns (address)"`, `"function initialize(address _bridge)"`, `"function version() view returns (string)"`, `"event Initialized(uint8 version)"`, `"event OptimismMintableERC20Created(address indexed localToken, address indexed remoteToken, address deployer)"`, `"event StandardL2TokenCreated(address indexed remoteToken, address indexed localToken)"`], \`0x${string}\`, \`0x${string}\`, `"0x75505a97BD334E7BD3C476893285569C4136Fa0F"`\>
>
> Action creators for contract payable and nonpayable functions
>
> ###### Example
>
> ```typescript
> tevm.contract(
> MyScript.withAddress('0x420...').read.balanceOf('0x1234...'),
> )
> ```
>
> ### op.OptimismPortal2
>
> > **op.OptimismPortal2**: `Omit`\<`Script`\<`"OptimismPortal2"`, readonly [`"constructor(uint256 _proofMaturityDelaySeconds, uint256 _disputeGameFinalityDelaySeconds, uint32 _initialRespectedGameType)"`, `"receive() external payable"`, `"function GUARDIAN() view returns (address)"`, `"function SYSTEM_CONFIG() view returns (address)"`, `"function blacklistDisputeGame(address _disputeGame)"`, `"function checkWithdrawal(bytes32 _withdrawalHash) view"`, `"function deleteProvenWithdrawal(bytes32 _withdrawalHash)"`, `"function depositTransaction(address _to, uint256 _value, uint64 _gasLimit, bool _isCreation, bytes _data) payable"`, `"function disputeGameBlacklist(address) view returns (bool)"`, `"function disputeGameFactory() view returns (address)"`, `"function donateETH() payable"`, `"function finalizeWithdrawalTransaction((uint256 nonce, address sender, address target, uint256 value, uint256 gasLimit, bytes data) _tx)"`, `"function finalizedWithdrawals(bytes32) view returns (bool)"`, `"function guardian() view returns (address)"`, `"function initialize(address _disputeGameFactory, address _systemConfig, address _superchainConfig)"`, `"function l2Sender() view returns (address)"`, `"function minimumGasLimit(uint64 _byteCount) pure returns (uint64)"`, `"function params() view returns (uint128 prevBaseFee, uint64 prevBoughtGas, uint64 prevBlockNum)"`, `"function paused() view returns (bool paused_)"`, `"function proveWithdrawalTransaction((uint256 nonce, address sender, address target, uint256 value, uint256 gasLimit, bytes data) _tx, uint256 _disputeGameIndex, (bytes32 version, bytes32 stateRoot, bytes32 messagePasserStorageRoot, bytes32 latestBlockhash) _outputRootProof, bytes[] _withdrawalProof)"`, `"function provenWithdrawals(bytes32) view returns (address disputeGameProxy, uint64 timestamp)"`, `"function respectedGameType() view returns (uint32)"`, `"function setRespectedGameType(uint32 _gameType)"`, `"function superchainConfig() view returns (address)"`, `"function systemConfig() view returns (address)"`, `"function version() view returns (string)"`, `"event Initialized(uint8 version)"`, `"event TransactionDeposited(address indexed from, address indexed to, uint256 indexed version, bytes opaqueData)"`, `"event WithdrawalFinalized(bytes32 indexed withdrawalHash, bool success)"`, `"event WithdrawalProven(bytes32 indexed withdrawalHash, address indexed from, address indexed to)"`]\>, `"address"` \| `"events"` \| `"read"` \| `"write"`\> & `object`
>
> #### Type declaration
>
> ##### address
>
> > **address**: `"0xbEb5Fc579115071764c7423A4f12eDde41f106Ed"`
>
> The deployed contract address
>
> ##### events
>
> > **events**: `EventActionCreator`\<readonly [`"constructor(uint256 _proofMaturityDelaySeconds, uint256 _disputeGameFinalityDelaySeconds, uint32 _initialRespectedGameType)"`, `"receive() external payable"`, `"function GUARDIAN() view returns (address)"`, `"function SYSTEM_CONFIG() view returns (address)"`, `"function blacklistDisputeGame(address _disputeGame)"`, `"function checkWithdrawal(bytes32 _withdrawalHash) view"`, `"function deleteProvenWithdrawal(bytes32 _withdrawalHash)"`, `"function depositTransaction(address _to, uint256 _value, uint64 _gasLimit, bool _isCreation, bytes _data) payable"`, `"function disputeGameBlacklist(address) view returns (bool)"`, `"function disputeGameFactory() view returns (address)"`, `"function donateETH() payable"`, `"function finalizeWithdrawalTransaction((uint256 nonce, address sender, address target, uint256 value, uint256 gasLimit, bytes data) _tx)"`, `"function finalizedWithdrawals(bytes32) view returns (bool)"`, `"function guardian() view returns (address)"`, `"function initialize(address _disputeGameFactory, address _systemConfig, address _superchainConfig)"`, `"function l2Sender() view returns (address)"`, `"function minimumGasLimit(uint64 _byteCount) pure returns (uint64)"`, `"function params() view returns (uint128 prevBaseFee, uint64 prevBoughtGas, uint64 prevBlockNum)"`, `"function paused() view returns (bool paused_)"`, `"function proveWithdrawalTransaction((uint256 nonce, address sender, address target, uint256 value, uint256 gasLimit, bytes data) _tx, uint256 _disputeGameIndex, (bytes32 version, bytes32 stateRoot, bytes32 messagePasserStorageRoot, bytes32 latestBlockhash) _outputRootProof, bytes[] _withdrawalProof)"`, `"function provenWithdrawals(bytes32) view returns (address disputeGameProxy, uint64 timestamp)"`, `"function respectedGameType() view returns (uint32)"`, `"function setRespectedGameType(uint32 _gameType)"`, `"function superchainConfig() view returns (address)"`, `"function systemConfig() view returns (address)"`, `"function version() view returns (string)"`, `"event Initialized(uint8 version)"`, `"event TransactionDeposited(address indexed from, address indexed to, uint256 indexed version, bytes opaqueData)"`, `"event WithdrawalFinalized(bytes32 indexed withdrawalHash, bool success)"`, `"event WithdrawalProven(bytes32 indexed withdrawalHash, address indexed from, address indexed to)"`], \`0x${string}\`, \`0x${string}\`, `"0xbEb5Fc579115071764c7423A4f12eDde41f106Ed"`\>
>
> Action creators for events. Can be used to create event filters in a typesafe way
>
> ###### Example
>
> ```typescript
> tevm.eth.getLog(
> MyScript.withAddress('0x420...').events.Transfer({ from: '0x1234...' }),
> )
> ===
>
> ##### read
>
> > **read**: `ReadActionCreator`\<readonly [`"constructor(uint256 _proofMaturityDelaySeconds, uint256 _disputeGameFinalityDelaySeconds, uint32 _initialRespectedGameType)"`, `"receive() external payable"`, `"function GUARDIAN() view returns (address)"`, `"function SYSTEM_CONFIG() view returns (address)"`, `"function blacklistDisputeGame(address _disputeGame)"`, `"function checkWithdrawal(bytes32 _withdrawalHash) view"`, `"function deleteProvenWithdrawal(bytes32 _withdrawalHash)"`, `"function depositTransaction(address _to, uint256 _value, uint64 _gasLimit, bool _isCreation, bytes _data) payable"`, `"function disputeGameBlacklist(address) view returns (bool)"`, `"function disputeGameFactory() view returns (address)"`, `"function donateETH() payable"`, `"function finalizeWithdrawalTransaction((uint256 nonce, address sender, address target, uint256 value, uint256 gasLimit, bytes data) _tx)"`, `"function finalizedWithdrawals(bytes32) view returns (bool)"`, `"function guardian() view returns (address)"`, `"function initialize(address _disputeGameFactory, address _systemConfig, address _superchainConfig)"`, `"function l2Sender() view returns (address)"`, `"function minimumGasLimit(uint64 _byteCount) pure returns (uint64)"`, `"function params() view returns (uint128 prevBaseFee, uint64 prevBoughtGas, uint64 prevBlockNum)"`, `"function paused() view returns (bool paused_)"`, `"function proveWithdrawalTransaction((uint256 nonce, address sender, address target, uint256 value, uint256 gasLimit, bytes data) _tx, uint256 _disputeGameIndex, (bytes32 version, bytes32 stateRoot, bytes32 messagePasserStorageRoot, bytes32 latestBlockhash) _outputRootProof, bytes[] _withdrawalProof)"`, `"function provenWithdrawals(bytes32) view returns (address disputeGameProxy, uint64 timestamp)"`, `"function respectedGameType() view returns (uint32)"`, `"function setRespectedGameType(uint32 _gameType)"`, `"function superchainConfig() view returns (address)"`, `"function systemConfig() view returns (address)"`, `"function version() view returns (string)"`, `"event Initialized(uint8 version)"`, `"event TransactionDeposited(address indexed from, address indexed to, uint256 indexed version, bytes opaqueData)"`, `"event WithdrawalFinalized(bytes32 indexed withdrawalHash, bool success)"`, `"event WithdrawalProven(bytes32 indexed withdrawalHash, address indexed from, address indexed to)"`], \`0x${string}\`, \`0x${string}\`, `"0xbEb5Fc579115071764c7423A4f12eDde41f106Ed"`\>
>
> Action creators for contract view and pure functions
>
> ###### Example
>
> ```typescript
> tevm.contract(
> MyScript.withAddress('0x420...').read.balanceOf('0x1234...'),
> )
> ```
>
> ##### write
>
> > **write**: `WriteActionCreator`\<readonly [`"constructor(uint256 _proofMaturityDelaySeconds, uint256 _disputeGameFinalityDelaySeconds, uint32 _initialRespectedGameType)"`, `"receive() external payable"`, `"function GUARDIAN() view returns (address)"`, `"function SYSTEM_CONFIG() view returns (address)"`, `"function blacklistDisputeGame(address _disputeGame)"`, `"function checkWithdrawal(bytes32 _withdrawalHash) view"`, `"function deleteProvenWithdrawal(bytes32 _withdrawalHash)"`, `"function depositTransaction(address _to, uint256 _value, uint64 _gasLimit, bool _isCreation, bytes _data) payable"`, `"function disputeGameBlacklist(address) view returns (bool)"`, `"function disputeGameFactory() view returns (address)"`, `"function donateETH() payable"`, `"function finalizeWithdrawalTransaction((uint256 nonce, address sender, address target, uint256 value, uint256 gasLimit, bytes data) _tx)"`, `"function finalizedWithdrawals(bytes32) view returns (bool)"`, `"function guardian() view returns (address)"`, `"function initialize(address _disputeGameFactory, address _systemConfig, address _superchainConfig)"`, `"function l2Sender() view returns (address)"`, `"function minimumGasLimit(uint64 _byteCount) pure returns (uint64)"`, `"function params() view returns (uint128 prevBaseFee, uint64 prevBoughtGas, uint64 prevBlockNum)"`, `"function paused() view returns (bool paused_)"`, `"function proveWithdrawalTransaction((uint256 nonce, address sender, address target, uint256 value, uint256 gasLimit, bytes data) _tx, uint256 _disputeGameIndex, (bytes32 version, bytes32 stateRoot, bytes32 messagePasserStorageRoot, bytes32 latestBlockhash) _outputRootProof, bytes[] _withdrawalProof)"`, `"function provenWithdrawals(bytes32) view returns (address disputeGameProxy, uint64 timestamp)"`, `"function respectedGameType() view returns (uint32)"`, `"function setRespectedGameType(uint32 _gameType)"`, `"function superchainConfig() view returns (address)"`, `"function systemConfig() view returns (address)"`, `"function version() view returns (string)"`, `"event Initialized(uint8 version)"`, `"event TransactionDeposited(address indexed from, address indexed to, uint256 indexed version, bytes opaqueData)"`, `"event WithdrawalFinalized(bytes32 indexed withdrawalHash, bool success)"`, `"event WithdrawalProven(bytes32 indexed withdrawalHash, address indexed from, address indexed to)"`], \`0x${string}\`, \`0x${string}\`, `"0xbEb5Fc579115071764c7423A4f12eDde41f106Ed"`\>
>
> Action creators for contract payable and nonpayable functions
>
> ###### Example
>
> ```typescript
> tevm.contract(
> MyScript.withAddress('0x420...').read.balanceOf('0x1234...'),
> )
> ```
>
> ### op.PUBLIC\_RPC
>
> > **op.PUBLIC\_RPC**: `"https://mainnet.optimism.io"`
>
> ### op.RESOURCE\_METERING\_RESOURCE\_CONFIG
>
> > **op.RESOURCE\_METERING\_RESOURCE\_CONFIG**: `object`
>
> ### op.RESOURCE\_METERING\_RESOURCE\_CONFIG.baseFeeMaxChangeDenominator
>
> > **`readonly`** **op.RESOURCE\_METERING\_RESOURCE\_CONFIG.baseFeeMaxChangeDenominator**: `8` = `8`
>
> ### op.RESOURCE\_METERING\_RESOURCE\_CONFIG.elasticityMultiplier
>
> > **`readonly`** **op.RESOURCE\_METERING\_RESOURCE\_CONFIG.elasticityMultiplier**: `10` = `10`
>
> ### op.RESOURCE\_METERING\_RESOURCE\_CONFIG.maxResourceLimit
>
> > **`readonly`** **op.RESOURCE\_METERING\_RESOURCE\_CONFIG.maxResourceLimit**: `20000000` = `20000000`
>
> ### op.RESOURCE\_METERING\_RESOURCE\_CONFIG.maximumBaseFee
>
> > **`readonly`** **op.RESOURCE\_METERING\_RESOURCE\_CONFIG.maximumBaseFee**: `340282366920938463463374607431768211455n`
>
> ### op.RESOURCE\_METERING\_RESOURCE\_CONFIG.minimumBaseFee
>
> > **`readonly`** **op.RESOURCE\_METERING\_RESOURCE\_CONFIG.minimumBaseFee**: `1000000000` = `1000000000`
>
> ### op.RESOURCE\_METERING\_RESOURCE\_CONFIG.systemTxMaxGas
>
> > **`readonly`** **op.RESOURCE\_METERING\_RESOURCE\_CONFIG.systemTxMaxGas**: `1000000` = `1000000`
>
> ### op.SCALAR
>
> > **op.SCALAR**: `684000n`
>
> ### op.SEQUENCER\_RPC
>
> > **op.SEQUENCER\_RPC**: `"https://mainnet-sequencer.optimism.io"`
>
> ### op.SYSTEM\_CONFIG\_OWNER
>
> > **op.SYSTEM\_CONFIG\_OWNER**: `"0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"`
>
> ### op.SuperchainConfig
>
> > **op.SuperchainConfig**: `Omit`\<`Script`\<`"SuperchainConfig"`, readonly [`"constructor()"`, `"function GUARDIAN_SLOT() view returns (bytes32)"`, `"function PAUSED_SLOT() view returns (bytes32)"`, `"function guardian() view returns (address guardian_)"`, `"function initialize(address _guardian, bool _paused)"`, `"function pause(string _identifier)"`, `"function paused() view returns (bool paused_)"`, `"function unpause()"`, `"function version() view returns (string)"`, `"event ConfigUpdate(uint8 indexed updateType, bytes data)"`, `"event Initialized(uint8 version)"`, `"event Paused(string identifier)"`, `"event Unpaused()"`]\>, `"address"` \| `"events"` \| `"read"` \| `"write"`\> & `object`
>
> #### Type declaration
>
> ##### address
>
> > **address**: `"0x6902690269026902690269026902690269026902"`
>
> The deployed contract address
>
> ##### events
>
> > **events**: `EventActionCreator`\<readonly [`"constructor()"`, `"function GUARDIAN_SLOT() view returns (bytes32)"`, `"function PAUSED_SLOT() view returns (bytes32)"`, `"function guardian() view returns (address guardian_)"`, `"function initialize(address _guardian, bool _paused)"`, `"function pause(string _identifier)"`, `"function paused() view returns (bool paused_)"`, `"function unpause()"`, `"function version() view returns (string)"`, `"event ConfigUpdate(uint8 indexed updateType, bytes data)"`, `"event Initialized(uint8 version)"`, `"event Paused(string identifier)"`, `"event Unpaused()"`], \`0x${string}\`, \`0x${string}\`, `"0x6902690269026902690269026902690269026902"`\>
>
> Action creators for events. Can be used to create event filters in a typesafe way
>
> ###### Example
>
> ```typescript
> tevm.eth.getLog(
> MyScript.withAddress('0x420...').events.Transfer({ from: '0x1234...' }),
> )
> ===
>
> ##### read
>
> > **read**: `ReadActionCreator`\<readonly [`"constructor()"`, `"function GUARDIAN_SLOT() view returns (bytes32)"`, `"function PAUSED_SLOT() view returns (bytes32)"`, `"function guardian() view returns (address guardian_)"`, `"function initialize(address _guardian, bool _paused)"`, `"function pause(string _identifier)"`, `"function paused() view returns (bool paused_)"`, `"function unpause()"`, `"function version() view returns (string)"`, `"event ConfigUpdate(uint8 indexed updateType, bytes data)"`, `"event Initialized(uint8 version)"`, `"event Paused(string identifier)"`, `"event Unpaused()"`], \`0x${string}\`, \`0x${string}\`, `"0x6902690269026902690269026902690269026902"`\>
>
> Action creators for contract view and pure functions
>
> ###### Example
>
> ```typescript
> tevm.contract(
> MyScript.withAddress('0x420...').read.balanceOf('0x1234...'),
> )
> ```
>
> ##### write
>
> > **write**: `WriteActionCreator`\<readonly [`"constructor()"`, `"function GUARDIAN_SLOT() view returns (bytes32)"`, `"function PAUSED_SLOT() view returns (bytes32)"`, `"function guardian() view returns (address guardian_)"`, `"function initialize(address _guardian, bool _paused)"`, `"function pause(string _identifier)"`, `"function paused() view returns (bool paused_)"`, `"function unpause()"`, `"function version() view returns (string)"`, `"event ConfigUpdate(uint8 indexed updateType, bytes data)"`, `"event Initialized(uint8 version)"`, `"event Paused(string identifier)"`, `"event Unpaused()"`], \`0x${string}\`, \`0x${string}\`, `"0x6902690269026902690269026902690269026902"`\>
>
> Action creators for contract payable and nonpayable functions
>
> ###### Example
>
> ```typescript
> tevm.contract(
> MyScript.withAddress('0x420...').read.balanceOf('0x1234...'),
> )
> ```
>
> ### op.SystemConfig
>
> > **op.SystemConfig**: `Omit`\<`Script`\<`"SystemConfig"`, readonly [`"constructor()"`, `"function BATCH_INBOX_SLOT() view returns (bytes32)"`, `"function L1_CROSS_DOMAIN_MESSENGER_SLOT() view returns (bytes32)"`, `"function L1_ERC_721_BRIDGE_SLOT() view returns (bytes32)"`, `"function L1_STANDARD_BRIDGE_SLOT() view returns (bytes32)"`, `"function L2_OUTPUT_ORACLE_SLOT() view returns (bytes32)"`, `"function OPTIMISM_MINTABLE_ERC20_FACTORY_SLOT() view returns (bytes32)"`, `"function OPTIMISM_PORTAL_SLOT() view returns (bytes32)"`, `"function START_BLOCK_SLOT() view returns (bytes32)"`, `"function UNSAFE_BLOCK_SIGNER_SLOT() view returns (bytes32)"`, `"function VERSION() view returns (uint256)"`, `"function batchInbox() view returns (address addr_)"`, `"function batcherHash() view returns (bytes32)"`, `"function gasLimit() view returns (uint64)"`, `"function initialize(address _owner, uint256 _overhead, uint256 _scalar, bytes32 _batcherHash, uint64 _gasLimit, address _unsafeBlockSigner, (uint32 maxResourceLimit, uint8 elasticityMultiplier, uint8 baseFeeMaxChangeDenominator, uint32 minimumBaseFee, uint32 systemTxMaxGas, uint128 maximumBaseFee) _config, address _batchInbox, (address l1CrossDomainMessenger, address l1ERC721Bridge, address l1StandardBridge, address l2OutputOracle, address optimismPortal, address optimismMintableERC20Factory) _addresses)"`, `"function l1CrossDomainMessenger() view returns (address addr_)"`, `"function l1ERC721Bridge() view returns (address addr_)"`, `"function l1StandardBridge() view returns (address addr_)"`, `"function l2OutputOracle() view returns (address addr_)"`, `"function minimumGasLimit() view returns (uint64)"`, `"function optimismMintableERC20Factory() view returns (address addr_)"`, `"function optimismPortal() view returns (address addr_)"`, `"function overhead() view returns (uint256)"`, `"function owner() view returns (address)"`, `"function renounceOwnership()"`, `"function resourceConfig() view returns ((uint32 maxResourceLimit, uint8 elasticityMultiplier, uint8 baseFeeMaxChangeDenominator, uint32 minimumBaseFee, uint32 systemTxMaxGas, uint128 maximumBaseFee))"`, `"function scalar() view returns (uint256)"`, `"function setBatcherHash(bytes32 _batcherHash)"`, `"function setGasConfig(uint256 _overhead, uint256 _scalar)"`, `"function setGasLimit(uint64 _gasLimit)"`, `"function setResourceConfig((uint32 maxResourceLimit, uint8 elasticityMultiplier, uint8 baseFeeMaxChangeDenominator, uint32 minimumBaseFee, uint32 systemTxMaxGas, uint128 maximumBaseFee) _config)"`, `"function setUnsafeBlockSigner(address _unsafeBlockSigner)"`, `"function startBlock() view returns (uint256 startBlock_)"`, `"function transferOwnership(address newOwner)"`, `"function unsafeBlockSigner() view returns (address addr_)"`, `"function version() view returns (string)"`, `"event ConfigUpdate(uint256 indexed version, uint8 indexed updateType, bytes data)"`, `"event Initialized(uint8 version)"`, `"event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)"`]\>, `"address"` \| `"events"` \| `"read"` \| `"write"`\> & `object`
>
> #### Type declaration
>
> ##### address
>
> > **address**: `"0x229047fed2591dbec1eF1118d64F7aF3dB9EB290"`
>
> The deployed contract address
>
> ##### events
>
> > **events**: `EventActionCreator`\<readonly [`"constructor()"`, `"function BATCH_INBOX_SLOT() view returns (bytes32)"`, `"function L1_CROSS_DOMAIN_MESSENGER_SLOT() view returns (bytes32)"`, `"function L1_ERC_721_BRIDGE_SLOT() view returns (bytes32)"`, `"function L1_STANDARD_BRIDGE_SLOT() view returns (bytes32)"`, `"function L2_OUTPUT_ORACLE_SLOT() view returns (bytes32)"`, `"function OPTIMISM_MINTABLE_ERC20_FACTORY_SLOT() view returns (bytes32)"`, `"function OPTIMISM_PORTAL_SLOT() view returns (bytes32)"`, `"function START_BLOCK_SLOT() view returns (bytes32)"`, `"function UNSAFE_BLOCK_SIGNER_SLOT() view returns (bytes32)"`, `"function VERSION() view returns (uint256)"`, `"function batchInbox() view returns (address addr_)"`, `"function batcherHash() view returns (bytes32)"`, `"function gasLimit() view returns (uint64)"`, `"function initialize(address _owner, uint256 _overhead, uint256 _scalar, bytes32 _batcherHash, uint64 _gasLimit, address _unsafeBlockSigner, (uint32 maxResourceLimit, uint8 elasticityMultiplier, uint8 baseFeeMaxChangeDenominator, uint32 minimumBaseFee, uint32 systemTxMaxGas, uint128 maximumBaseFee) _config, address _batchInbox, (address l1CrossDomainMessenger, address l1ERC721Bridge, address l1StandardBridge, address l2OutputOracle, address optimismPortal, address optimismMintableERC20Factory) _addresses)"`, `"function l1CrossDomainMessenger() view returns (address addr_)"`, `"function l1ERC721Bridge() view returns (address addr_)"`, `"function l1StandardBridge() view returns (address addr_)"`, `"function l2OutputOracle() view returns (address addr_)"`, `"function minimumGasLimit() view returns (uint64)"`, `"function optimismMintableERC20Factory() view returns (address addr_)"`, `"function optimismPortal() view returns (address addr_)"`, `"function overhead() view returns (uint256)"`, `"function owner() view returns (address)"`, `"function renounceOwnership()"`, `"function resourceConfig() view returns ((uint32 maxResourceLimit, uint8 elasticityMultiplier, uint8 baseFeeMaxChangeDenominator, uint32 minimumBaseFee, uint32 systemTxMaxGas, uint128 maximumBaseFee))"`, `"function scalar() view returns (uint256)"`, `"function setBatcherHash(bytes32 _batcherHash)"`, `"function setGasConfig(uint256 _overhead, uint256 _scalar)"`, `"function setGasLimit(uint64 _gasLimit)"`, `"function setResourceConfig((uint32 maxResourceLimit, uint8 elasticityMultiplier, uint8 baseFeeMaxChangeDenominator, uint32 minimumBaseFee, uint32 systemTxMaxGas, uint128 maximumBaseFee) _config)"`, `"function setUnsafeBlockSigner(address _unsafeBlockSigner)"`, `"function startBlock() view returns (uint256 startBlock_)"`, `"function transferOwnership(address newOwner)"`, `"function unsafeBlockSigner() view returns (address addr_)"`, `"function version() view returns (string)"`, `"event ConfigUpdate(uint256 indexed version, uint8 indexed updateType, bytes data)"`, `"event Initialized(uint8 version)"`, `"event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)"`], \`0x${string}\`, \`0x${string}\`, `"0x229047fed2591dbec1eF1118d64F7aF3dB9EB290"`\>
>
> Action creators for events. Can be used to create event filters in a typesafe way
>
> ###### Example
>
> ```typescript
> tevm.eth.getLog(
> MyScript.withAddress('0x420...').events.Transfer({ from: '0x1234...' }),
> )
> ===
>
> ##### read
>
> > **read**: `ReadActionCreator`\<readonly [`"constructor()"`, `"function BATCH_INBOX_SLOT() view returns (bytes32)"`, `"function L1_CROSS_DOMAIN_MESSENGER_SLOT() view returns (bytes32)"`, `"function L1_ERC_721_BRIDGE_SLOT() view returns (bytes32)"`, `"function L1_STANDARD_BRIDGE_SLOT() view returns (bytes32)"`, `"function L2_OUTPUT_ORACLE_SLOT() view returns (bytes32)"`, `"function OPTIMISM_MINTABLE_ERC20_FACTORY_SLOT() view returns (bytes32)"`, `"function OPTIMISM_PORTAL_SLOT() view returns (bytes32)"`, `"function START_BLOCK_SLOT() view returns (bytes32)"`, `"function UNSAFE_BLOCK_SIGNER_SLOT() view returns (bytes32)"`, `"function VERSION() view returns (uint256)"`, `"function batchInbox() view returns (address addr_)"`, `"function batcherHash() view returns (bytes32)"`, `"function gasLimit() view returns (uint64)"`, `"function initialize(address _owner, uint256 _overhead, uint256 _scalar, bytes32 _batcherHash, uint64 _gasLimit, address _unsafeBlockSigner, (uint32 maxResourceLimit, uint8 elasticityMultiplier, uint8 baseFeeMaxChangeDenominator, uint32 minimumBaseFee, uint32 systemTxMaxGas, uint128 maximumBaseFee) _config, address _batchInbox, (address l1CrossDomainMessenger, address l1ERC721Bridge, address l1StandardBridge, address l2OutputOracle, address optimismPortal, address optimismMintableERC20Factory) _addresses)"`, `"function l1CrossDomainMessenger() view returns (address addr_)"`, `"function l1ERC721Bridge() view returns (address addr_)"`, `"function l1StandardBridge() view returns (address addr_)"`, `"function l2OutputOracle() view returns (address addr_)"`, `"function minimumGasLimit() view returns (uint64)"`, `"function optimismMintableERC20Factory() view returns (address addr_)"`, `"function optimismPortal() view returns (address addr_)"`, `"function overhead() view returns (uint256)"`, `"function owner() view returns (address)"`, `"function renounceOwnership()"`, `"function resourceConfig() view returns ((uint32 maxResourceLimit, uint8 elasticityMultiplier, uint8 baseFeeMaxChangeDenominator, uint32 minimumBaseFee, uint32 systemTxMaxGas, uint128 maximumBaseFee))"`, `"function scalar() view returns (uint256)"`, `"function setBatcherHash(bytes32 _batcherHash)"`, `"function setGasConfig(uint256 _overhead, uint256 _scalar)"`, `"function setGasLimit(uint64 _gasLimit)"`, `"function setResourceConfig((uint32 maxResourceLimit, uint8 elasticityMultiplier, uint8 baseFeeMaxChangeDenominator, uint32 minimumBaseFee, uint32 systemTxMaxGas, uint128 maximumBaseFee) _config)"`, `"function setUnsafeBlockSigner(address _unsafeBlockSigner)"`, `"function startBlock() view returns (uint256 startBlock_)"`, `"function transferOwnership(address newOwner)"`, `"function unsafeBlockSigner() view returns (address addr_)"`, `"function version() view returns (string)"`, `"event ConfigUpdate(uint256 indexed version, uint8 indexed updateType, bytes data)"`, `"event Initialized(uint8 version)"`, `"event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)"`], \`0x${string}\`, \`0x${string}\`, `"0x229047fed2591dbec1eF1118d64F7aF3dB9EB290"`\>
>
> Action creators for contract view and pure functions
>
> ###### Example
>
> ```typescript
> tevm.contract(
> MyScript.withAddress('0x420...').read.balanceOf('0x1234...'),
> )
> ```
>
> ##### write
>
> > **write**: `WriteActionCreator`\<readonly [`"constructor()"`, `"function BATCH_INBOX_SLOT() view returns (bytes32)"`, `"function L1_CROSS_DOMAIN_MESSENGER_SLOT() view returns (bytes32)"`, `"function L1_ERC_721_BRIDGE_SLOT() view returns (bytes32)"`, `"function L1_STANDARD_BRIDGE_SLOT() view returns (bytes32)"`, `"function L2_OUTPUT_ORACLE_SLOT() view returns (bytes32)"`, `"function OPTIMISM_MINTABLE_ERC20_FACTORY_SLOT() view returns (bytes32)"`, `"function OPTIMISM_PORTAL_SLOT() view returns (bytes32)"`, `"function START_BLOCK_SLOT() view returns (bytes32)"`, `"function UNSAFE_BLOCK_SIGNER_SLOT() view returns (bytes32)"`, `"function VERSION() view returns (uint256)"`, `"function batchInbox() view returns (address addr_)"`, `"function batcherHash() view returns (bytes32)"`, `"function gasLimit() view returns (uint64)"`, `"function initialize(address _owner, uint256 _overhead, uint256 _scalar, bytes32 _batcherHash, uint64 _gasLimit, address _unsafeBlockSigner, (uint32 maxResourceLimit, uint8 elasticityMultiplier, uint8 baseFeeMaxChangeDenominator, uint32 minimumBaseFee, uint32 systemTxMaxGas, uint128 maximumBaseFee) _config, address _batchInbox, (address l1CrossDomainMessenger, address l1ERC721Bridge, address l1StandardBridge, address l2OutputOracle, address optimismPortal, address optimismMintableERC20Factory) _addresses)"`, `"function l1CrossDomainMessenger() view returns (address addr_)"`, `"function l1ERC721Bridge() view returns (address addr_)"`, `"function l1StandardBridge() view returns (address addr_)"`, `"function l2OutputOracle() view returns (address addr_)"`, `"function minimumGasLimit() view returns (uint64)"`, `"function optimismMintableERC20Factory() view returns (address addr_)"`, `"function optimismPortal() view returns (address addr_)"`, `"function overhead() view returns (uint256)"`, `"function owner() view returns (address)"`, `"function renounceOwnership()"`, `"function resourceConfig() view returns ((uint32 maxResourceLimit, uint8 elasticityMultiplier, uint8 baseFeeMaxChangeDenominator, uint32 minimumBaseFee, uint32 systemTxMaxGas, uint128 maximumBaseFee))"`, `"function scalar() view returns (uint256)"`, `"function setBatcherHash(bytes32 _batcherHash)"`, `"function setGasConfig(uint256 _overhead, uint256 _scalar)"`, `"function setGasLimit(uint64 _gasLimit)"`, `"function setResourceConfig((uint32 maxResourceLimit, uint8 elasticityMultiplier, uint8 baseFeeMaxChangeDenominator, uint32 minimumBaseFee, uint32 systemTxMaxGas, uint128 maximumBaseFee) _config)"`, `"function setUnsafeBlockSigner(address _unsafeBlockSigner)"`, `"function startBlock() view returns (uint256 startBlock_)"`, `"function transferOwnership(address newOwner)"`, `"function unsafeBlockSigner() view returns (address addr_)"`, `"function version() view returns (string)"`, `"event ConfigUpdate(uint256 indexed version, uint8 indexed updateType, bytes data)"`, `"event Initialized(uint8 version)"`, `"event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)"`], \`0x${string}\`, \`0x${string}\`, `"0x229047fed2591dbec1eF1118d64F7aF3dB9EB290"`\>
>
> Action creators for contract payable and nonpayable functions
>
> ###### Example
>
> ```typescript
> tevm.contract(
> MyScript.withAddress('0x420...').read.balanceOf('0x1234...'),
> )
> ```
>
> ### op.UNSAFE\_BLOCK\_SIGNER
>
> > **op.UNSAFE\_BLOCK\_SIGNER**: `"0xAAAA45d9549EDA09E70937013520214382Ffc4A2"`
>
> ### ready
>
> > **ready**: () => `Promise`\<`true`\>
>
> ### request
>
> > **request**: `EIP1193RequestFn`\<[`object`, `object`, `object`]\>
>
> ### script
>
> > **script**: `ScriptHandler`
>
> Executes scripts against the Tevm EVM. By default the script is sandboxed
> and the state is reset after each execution unless the `persist` option is set
> to true.
>
> #### Example
>
> ```typescript
> const res = tevm.script({
> deployedBytecode: '0x6080604...',
> abi: [...],
> function: 'run',
> args: ['hello world']
> })
> ```
> Contract handlers provide a more ergonomic way to execute scripts
>
> #### Example
>
> ```typescript
> ipmort {MyScript} from './MyScript.s.sol'
>
> const res = tevm.script(
> MyScript.read.run('hello world')
> )
> ```
>
> ### send
>
> > **send**: `TevmJsonRpcRequestHandler`
>
> ### sendBulk
>
> > **sendBulk**: `TevmJsonRpcBulkRequestHandler`
>
> ### setAccount
>
> > **setAccount**: `SetAccountHandler`
>
> Sets the state of a specific ethereum address
>
> #### Example
>
> ```ts
> import {parseEther} from 'tevm'
>
> await tevm.setAccount({
> address: '0x123...',
> deployedBytecode: '0x6080604...',
> balance: parseEther('1.0')
> })
> ```
>
> ### emit()
>
> Emit an event.
>
> #### Parameters
>
> ▪ **eventName**: keyof `EIP1193EventMap`
>
> The event name.
>
> ▪ ...**args**: `any`[]
>
> Arguments to pass to the event listeners.
>
> #### Returns
>
> True if the event was emitted, false otherwise.
>
> ### on()
>
> #### Type parameters
>
> ▪ **TEvent** extends keyof `EIP1193EventMap`
>
> #### Parameters
>
> ▪ **event**: `TEvent`
>
> ▪ **listener**: `EIP1193EventMap`[`TEvent`]
>
> ### removeListener()
>
> #### Type parameters
>
> ▪ **TEvent** extends keyof `EIP1193EventMap`
>
> #### Parameters
>
> ▪ **event**: `TEvent`
>
> ▪ **listener**: `EIP1193EventMap`[`TEvent`]
>

## Source

[extensions/opstack/src/createL1Client.ts:22](https://github.com/evmts/tevm-monorepo/blob/main/extensions/opstack/src/createL1Client.ts#L22)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
