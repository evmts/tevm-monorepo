/**
 * Creates a Tevm client preloaded and initialized with L1 contracts. This corresponds to the 3.0 major version of Optimism
 * When possible it uses the values from mainnet. For some constants this
 * isn't possible as currently this protocol isn't deployed to a testnet or mainnet.
 *
 * All constants including vital OP stack addresses and owners are available and transactions may be sent mocking them using tevm `to` property.
 */
export declare const createL1Client: ({ chainId }?: {
    chainId?: 10;
}) => {
    op: {
        OVERHEAD: 188n;
        SCALAR: 684000n;
        BATCHER_HASH: "0x0000000000000000000000006887246668a3b87f54deb3b94ba47a6f63f32985";
        GAS_LIMIT: 30000000n;
        UNSAFE_BLOCK_SIGNER: "0xAAAA45d9549EDA09E70937013520214382Ffc4A2";
        BATCH_INBOX: "0xff00000000000000000000000000000011155420";
        DISPUTE_GAME_FACTORY_OWNER: `0x${string}`;
        RESOURCE_METERING_RESOURCE_CONFIG: {
            readonly maxResourceLimit: 20000000;
            readonly elasticityMultiplier: 10;
            readonly baseFeeMaxChangeDenominator: 8;
            readonly minimumBaseFee: 1000000000;
            readonly systemTxMaxGas: 1000000;
            readonly maximumBaseFee: 340282366920938463463374607431768211455n;
        };
        GUARDIAN: "0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A";
        SYSTEM_CONFIG_OWNER: "0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A";
        CHAIN_ID: 10;
        PUBLIC_RPC: "https://mainnet.optimism.io";
        SEQUENCER_RPC: "https://mainnet-sequencer.optimism.io";
        EXPLORER: "https://explorer.optimism.io";
        L1Erc721Bridge: Omit<import("@tevm/contract").Script<"L1ERC721Bridge", readonly ["constructor()", "function MESSENGER() view returns (address)", "function OTHER_BRIDGE() view returns (address)", "function bridgeERC721(address _localToken, address _remoteToken, uint256 _tokenId, uint32 _minGasLimit, bytes _extraData)", "function bridgeERC721To(address _localToken, address _remoteToken, address _to, uint256 _tokenId, uint32 _minGasLimit, bytes _extraData)", "function deposits(address, address, uint256) view returns (bool)", "function finalizeBridgeERC721(address _localToken, address _remoteToken, address _from, address _to, uint256 _tokenId, bytes _extraData)", "function initialize(address _messenger, address _superchainConfig)", "function messenger() view returns (address)", "function otherBridge() view returns (address)", "function paused() view returns (bool)", "function superchainConfig() view returns (address)", "function version() view returns (string)", "event ERC721BridgeFinalized(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 tokenId, bytes extraData)", "event ERC721BridgeInitiated(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 tokenId, bytes extraData)", "event Initialized(uint8 version)"]>, "address" | "events" | "read" | "write"> & {
            address: "0x5a7749f83b81B301cAb5f48EB8516B986DAef23D";
            events: import("@tevm/contract").EventActionCreator<readonly ["constructor()", "function MESSENGER() view returns (address)", "function OTHER_BRIDGE() view returns (address)", "function bridgeERC721(address _localToken, address _remoteToken, uint256 _tokenId, uint32 _minGasLimit, bytes _extraData)", "function bridgeERC721To(address _localToken, address _remoteToken, address _to, uint256 _tokenId, uint32 _minGasLimit, bytes _extraData)", "function deposits(address, address, uint256) view returns (bool)", "function finalizeBridgeERC721(address _localToken, address _remoteToken, address _from, address _to, uint256 _tokenId, bytes _extraData)", "function initialize(address _messenger, address _superchainConfig)", "function messenger() view returns (address)", "function otherBridge() view returns (address)", "function paused() view returns (bool)", "function superchainConfig() view returns (address)", "function version() view returns (string)", "event ERC721BridgeFinalized(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 tokenId, bytes extraData)", "event ERC721BridgeInitiated(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 tokenId, bytes extraData)", "event Initialized(uint8 version)"], `0x${string}`, `0x${string}`, "0x5a7749f83b81B301cAb5f48EB8516B986DAef23D">;
            read: import("@tevm/contract").ReadActionCreator<readonly ["constructor()", "function MESSENGER() view returns (address)", "function OTHER_BRIDGE() view returns (address)", "function bridgeERC721(address _localToken, address _remoteToken, uint256 _tokenId, uint32 _minGasLimit, bytes _extraData)", "function bridgeERC721To(address _localToken, address _remoteToken, address _to, uint256 _tokenId, uint32 _minGasLimit, bytes _extraData)", "function deposits(address, address, uint256) view returns (bool)", "function finalizeBridgeERC721(address _localToken, address _remoteToken, address _from, address _to, uint256 _tokenId, bytes _extraData)", "function initialize(address _messenger, address _superchainConfig)", "function messenger() view returns (address)", "function otherBridge() view returns (address)", "function paused() view returns (bool)", "function superchainConfig() view returns (address)", "function version() view returns (string)", "event ERC721BridgeFinalized(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 tokenId, bytes extraData)", "event ERC721BridgeInitiated(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 tokenId, bytes extraData)", "event Initialized(uint8 version)"], `0x${string}`, `0x${string}`, "0x5a7749f83b81B301cAb5f48EB8516B986DAef23D">;
            write: import("@tevm/contract").WriteActionCreator<readonly ["constructor()", "function MESSENGER() view returns (address)", "function OTHER_BRIDGE() view returns (address)", "function bridgeERC721(address _localToken, address _remoteToken, uint256 _tokenId, uint32 _minGasLimit, bytes _extraData)", "function bridgeERC721To(address _localToken, address _remoteToken, address _to, uint256 _tokenId, uint32 _minGasLimit, bytes _extraData)", "function deposits(address, address, uint256) view returns (bool)", "function finalizeBridgeERC721(address _localToken, address _remoteToken, address _from, address _to, uint256 _tokenId, bytes _extraData)", "function initialize(address _messenger, address _superchainConfig)", "function messenger() view returns (address)", "function otherBridge() view returns (address)", "function paused() view returns (bool)", "function superchainConfig() view returns (address)", "function version() view returns (string)", "event ERC721BridgeFinalized(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 tokenId, bytes extraData)", "event ERC721BridgeInitiated(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 tokenId, bytes extraData)", "event Initialized(uint8 version)"], `0x${string}`, `0x${string}`, "0x5a7749f83b81B301cAb5f48EB8516B986DAef23D">;
        };
        SuperchainConfig: Omit<import("@tevm/contract").Script<"SuperchainConfig", readonly ["constructor()", "function GUARDIAN_SLOT() view returns (bytes32)", "function PAUSED_SLOT() view returns (bytes32)", "function guardian() view returns (address guardian_)", "function initialize(address _guardian, bool _paused)", "function pause(string _identifier)", "function paused() view returns (bool paused_)", "function unpause()", "function version() view returns (string)", "event ConfigUpdate(uint8 indexed updateType, bytes data)", "event Initialized(uint8 version)", "event Paused(string identifier)", "event Unpaused()"]>, "address" | "events" | "read" | "write"> & {
            address: "0x6902690269026902690269026902690269026902";
            events: import("@tevm/contract").EventActionCreator<readonly ["constructor()", "function GUARDIAN_SLOT() view returns (bytes32)", "function PAUSED_SLOT() view returns (bytes32)", "function guardian() view returns (address guardian_)", "function initialize(address _guardian, bool _paused)", "function pause(string _identifier)", "function paused() view returns (bool paused_)", "function unpause()", "function version() view returns (string)", "event ConfigUpdate(uint8 indexed updateType, bytes data)", "event Initialized(uint8 version)", "event Paused(string identifier)", "event Unpaused()"], `0x${string}`, `0x${string}`, "0x6902690269026902690269026902690269026902">;
            read: import("@tevm/contract").ReadActionCreator<readonly ["constructor()", "function GUARDIAN_SLOT() view returns (bytes32)", "function PAUSED_SLOT() view returns (bytes32)", "function guardian() view returns (address guardian_)", "function initialize(address _guardian, bool _paused)", "function pause(string _identifier)", "function paused() view returns (bool paused_)", "function unpause()", "function version() view returns (string)", "event ConfigUpdate(uint8 indexed updateType, bytes data)", "event Initialized(uint8 version)", "event Paused(string identifier)", "event Unpaused()"], `0x${string}`, `0x${string}`, "0x6902690269026902690269026902690269026902">;
            write: import("@tevm/contract").WriteActionCreator<readonly ["constructor()", "function GUARDIAN_SLOT() view returns (bytes32)", "function PAUSED_SLOT() view returns (bytes32)", "function guardian() view returns (address guardian_)", "function initialize(address _guardian, bool _paused)", "function pause(string _identifier)", "function paused() view returns (bool paused_)", "function unpause()", "function version() view returns (string)", "event ConfigUpdate(uint8 indexed updateType, bytes data)", "event Initialized(uint8 version)", "event Paused(string identifier)", "event Unpaused()"], `0x${string}`, `0x${string}`, "0x6902690269026902690269026902690269026902">;
        };
        L1CrossDomainMessenger: Omit<import("@tevm/contract").Script<"L1CrossDomainMessenger", readonly ["constructor()", "function MESSAGE_VERSION() view returns (uint16)", "function MIN_GAS_CALLDATA_OVERHEAD() view returns (uint64)", "function MIN_GAS_DYNAMIC_OVERHEAD_DENOMINATOR() view returns (uint64)", "function MIN_GAS_DYNAMIC_OVERHEAD_NUMERATOR() view returns (uint64)", "function OTHER_MESSENGER() view returns (address)", "function PORTAL() view returns (address)", "function RELAY_CALL_OVERHEAD() view returns (uint64)", "function RELAY_CONSTANT_OVERHEAD() view returns (uint64)", "function RELAY_GAS_CHECK_BUFFER() view returns (uint64)", "function RELAY_RESERVED_GAS() view returns (uint64)", "function baseGas(bytes _message, uint32 _minGasLimit) pure returns (uint64)", "function failedMessages(bytes32) view returns (bool)", "function initialize(address _superchainConfig, address _portal)", "function messageNonce() view returns (uint256)", "function otherMessenger() view returns (address)", "function paused() view returns (bool)", "function portal() view returns (address)", "function relayMessage(uint256 _nonce, address _sender, address _target, uint256 _value, uint256 _minGasLimit, bytes _message) payable", "function sendMessage(address _target, bytes _message, uint32 _minGasLimit) payable", "function successfulMessages(bytes32) view returns (bool)", "function superchainConfig() view returns (address)", "function version() view returns (string)", "function xDomainMessageSender() view returns (address)", "event FailedRelayedMessage(bytes32 indexed msgHash)", "event Initialized(uint8 version)", "event RelayedMessage(bytes32 indexed msgHash)", "event SentMessage(address indexed target, address sender, bytes message, uint256 messageNonce, uint256 gasLimit)", "event SentMessageExtension1(address indexed sender, uint256 value)"]>, "address" | "events" | "read" | "write"> & {
            address: "0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1";
            events: import("@tevm/contract").EventActionCreator<readonly ["constructor()", "function MESSAGE_VERSION() view returns (uint16)", "function MIN_GAS_CALLDATA_OVERHEAD() view returns (uint64)", "function MIN_GAS_DYNAMIC_OVERHEAD_DENOMINATOR() view returns (uint64)", "function MIN_GAS_DYNAMIC_OVERHEAD_NUMERATOR() view returns (uint64)", "function OTHER_MESSENGER() view returns (address)", "function PORTAL() view returns (address)", "function RELAY_CALL_OVERHEAD() view returns (uint64)", "function RELAY_CONSTANT_OVERHEAD() view returns (uint64)", "function RELAY_GAS_CHECK_BUFFER() view returns (uint64)", "function RELAY_RESERVED_GAS() view returns (uint64)", "function baseGas(bytes _message, uint32 _minGasLimit) pure returns (uint64)", "function failedMessages(bytes32) view returns (bool)", "function initialize(address _superchainConfig, address _portal)", "function messageNonce() view returns (uint256)", "function otherMessenger() view returns (address)", "function paused() view returns (bool)", "function portal() view returns (address)", "function relayMessage(uint256 _nonce, address _sender, address _target, uint256 _value, uint256 _minGasLimit, bytes _message) payable", "function sendMessage(address _target, bytes _message, uint32 _minGasLimit) payable", "function successfulMessages(bytes32) view returns (bool)", "function superchainConfig() view returns (address)", "function version() view returns (string)", "function xDomainMessageSender() view returns (address)", "event FailedRelayedMessage(bytes32 indexed msgHash)", "event Initialized(uint8 version)", "event RelayedMessage(bytes32 indexed msgHash)", "event SentMessage(address indexed target, address sender, bytes message, uint256 messageNonce, uint256 gasLimit)", "event SentMessageExtension1(address indexed sender, uint256 value)"], `0x${string}`, `0x${string}`, "0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1">;
            read: import("@tevm/contract").ReadActionCreator<readonly ["constructor()", "function MESSAGE_VERSION() view returns (uint16)", "function MIN_GAS_CALLDATA_OVERHEAD() view returns (uint64)", "function MIN_GAS_DYNAMIC_OVERHEAD_DENOMINATOR() view returns (uint64)", "function MIN_GAS_DYNAMIC_OVERHEAD_NUMERATOR() view returns (uint64)", "function OTHER_MESSENGER() view returns (address)", "function PORTAL() view returns (address)", "function RELAY_CALL_OVERHEAD() view returns (uint64)", "function RELAY_CONSTANT_OVERHEAD() view returns (uint64)", "function RELAY_GAS_CHECK_BUFFER() view returns (uint64)", "function RELAY_RESERVED_GAS() view returns (uint64)", "function baseGas(bytes _message, uint32 _minGasLimit) pure returns (uint64)", "function failedMessages(bytes32) view returns (bool)", "function initialize(address _superchainConfig, address _portal)", "function messageNonce() view returns (uint256)", "function otherMessenger() view returns (address)", "function paused() view returns (bool)", "function portal() view returns (address)", "function relayMessage(uint256 _nonce, address _sender, address _target, uint256 _value, uint256 _minGasLimit, bytes _message) payable", "function sendMessage(address _target, bytes _message, uint32 _minGasLimit) payable", "function successfulMessages(bytes32) view returns (bool)", "function superchainConfig() view returns (address)", "function version() view returns (string)", "function xDomainMessageSender() view returns (address)", "event FailedRelayedMessage(bytes32 indexed msgHash)", "event Initialized(uint8 version)", "event RelayedMessage(bytes32 indexed msgHash)", "event SentMessage(address indexed target, address sender, bytes message, uint256 messageNonce, uint256 gasLimit)", "event SentMessageExtension1(address indexed sender, uint256 value)"], `0x${string}`, `0x${string}`, "0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1">;
            write: import("@tevm/contract").WriteActionCreator<readonly ["constructor()", "function MESSAGE_VERSION() view returns (uint16)", "function MIN_GAS_CALLDATA_OVERHEAD() view returns (uint64)", "function MIN_GAS_DYNAMIC_OVERHEAD_DENOMINATOR() view returns (uint64)", "function MIN_GAS_DYNAMIC_OVERHEAD_NUMERATOR() view returns (uint64)", "function OTHER_MESSENGER() view returns (address)", "function PORTAL() view returns (address)", "function RELAY_CALL_OVERHEAD() view returns (uint64)", "function RELAY_CONSTANT_OVERHEAD() view returns (uint64)", "function RELAY_GAS_CHECK_BUFFER() view returns (uint64)", "function RELAY_RESERVED_GAS() view returns (uint64)", "function baseGas(bytes _message, uint32 _minGasLimit) pure returns (uint64)", "function failedMessages(bytes32) view returns (bool)", "function initialize(address _superchainConfig, address _portal)", "function messageNonce() view returns (uint256)", "function otherMessenger() view returns (address)", "function paused() view returns (bool)", "function portal() view returns (address)", "function relayMessage(uint256 _nonce, address _sender, address _target, uint256 _value, uint256 _minGasLimit, bytes _message) payable", "function sendMessage(address _target, bytes _message, uint32 _minGasLimit) payable", "function successfulMessages(bytes32) view returns (bool)", "function superchainConfig() view returns (address)", "function version() view returns (string)", "function xDomainMessageSender() view returns (address)", "event FailedRelayedMessage(bytes32 indexed msgHash)", "event Initialized(uint8 version)", "event RelayedMessage(bytes32 indexed msgHash)", "event SentMessage(address indexed target, address sender, bytes message, uint256 messageNonce, uint256 gasLimit)", "event SentMessageExtension1(address indexed sender, uint256 value)"], `0x${string}`, `0x${string}`, "0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1">;
        };
        L1StandardBridge: Omit<import("@tevm/contract").Script<"L1StandardBridge", readonly ["constructor()", "receive() external payable", "function MESSENGER() view returns (address)", "function OTHER_BRIDGE() view returns (address)", "function bridgeERC20(address _localToken, address _remoteToken, uint256 _amount, uint32 _minGasLimit, bytes _extraData)", "function bridgeERC20To(address _localToken, address _remoteToken, address _to, uint256 _amount, uint32 _minGasLimit, bytes _extraData)", "function bridgeETH(uint32 _minGasLimit, bytes _extraData) payable", "function bridgeETHTo(address _to, uint32 _minGasLimit, bytes _extraData) payable", "function depositERC20(address _l1Token, address _l2Token, uint256 _amount, uint32 _minGasLimit, bytes _extraData)", "function depositERC20To(address _l1Token, address _l2Token, address _to, uint256 _amount, uint32 _minGasLimit, bytes _extraData)", "function depositETH(uint32 _minGasLimit, bytes _extraData) payable", "function depositETHTo(address _to, uint32 _minGasLimit, bytes _extraData) payable", "function deposits(address, address) view returns (uint256)", "function finalizeBridgeERC20(address _localToken, address _remoteToken, address _from, address _to, uint256 _amount, bytes _extraData)", "function finalizeBridgeETH(address _from, address _to, uint256 _amount, bytes _extraData) payable", "function finalizeERC20Withdrawal(address _l1Token, address _l2Token, address _from, address _to, uint256 _amount, bytes _extraData)", "function finalizeETHWithdrawal(address _from, address _to, uint256 _amount, bytes _extraData) payable", "function initialize(address _messenger, address _superchainConfig)", "function l2TokenBridge() view returns (address)", "function messenger() view returns (address)", "function otherBridge() view returns (address)", "function paused() view returns (bool)", "function superchainConfig() view returns (address)", "function version() view returns (string)", "event ERC20BridgeFinalized(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 amount, bytes extraData)", "event ERC20BridgeInitiated(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 amount, bytes extraData)", "event ERC20DepositInitiated(address indexed l1Token, address indexed l2Token, address indexed from, address to, uint256 amount, bytes extraData)", "event ERC20WithdrawalFinalized(address indexed l1Token, address indexed l2Token, address indexed from, address to, uint256 amount, bytes extraData)", "event ETHBridgeFinalized(address indexed from, address indexed to, uint256 amount, bytes extraData)", "event ETHBridgeInitiated(address indexed from, address indexed to, uint256 amount, bytes extraData)", "event ETHDepositInitiated(address indexed from, address indexed to, uint256 amount, bytes extraData)", "event ETHWithdrawalFinalized(address indexed from, address indexed to, uint256 amount, bytes extraData)", "event Initialized(uint8 version)"]>, "address" | "events" | "read" | "write"> & {
            address: "0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1";
            events: import("@tevm/contract").EventActionCreator<readonly ["constructor()", "receive() external payable", "function MESSENGER() view returns (address)", "function OTHER_BRIDGE() view returns (address)", "function bridgeERC20(address _localToken, address _remoteToken, uint256 _amount, uint32 _minGasLimit, bytes _extraData)", "function bridgeERC20To(address _localToken, address _remoteToken, address _to, uint256 _amount, uint32 _minGasLimit, bytes _extraData)", "function bridgeETH(uint32 _minGasLimit, bytes _extraData) payable", "function bridgeETHTo(address _to, uint32 _minGasLimit, bytes _extraData) payable", "function depositERC20(address _l1Token, address _l2Token, uint256 _amount, uint32 _minGasLimit, bytes _extraData)", "function depositERC20To(address _l1Token, address _l2Token, address _to, uint256 _amount, uint32 _minGasLimit, bytes _extraData)", "function depositETH(uint32 _minGasLimit, bytes _extraData) payable", "function depositETHTo(address _to, uint32 _minGasLimit, bytes _extraData) payable", "function deposits(address, address) view returns (uint256)", "function finalizeBridgeERC20(address _localToken, address _remoteToken, address _from, address _to, uint256 _amount, bytes _extraData)", "function finalizeBridgeETH(address _from, address _to, uint256 _amount, bytes _extraData) payable", "function finalizeERC20Withdrawal(address _l1Token, address _l2Token, address _from, address _to, uint256 _amount, bytes _extraData)", "function finalizeETHWithdrawal(address _from, address _to, uint256 _amount, bytes _extraData) payable", "function initialize(address _messenger, address _superchainConfig)", "function l2TokenBridge() view returns (address)", "function messenger() view returns (address)", "function otherBridge() view returns (address)", "function paused() view returns (bool)", "function superchainConfig() view returns (address)", "function version() view returns (string)", "event ERC20BridgeFinalized(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 amount, bytes extraData)", "event ERC20BridgeInitiated(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 amount, bytes extraData)", "event ERC20DepositInitiated(address indexed l1Token, address indexed l2Token, address indexed from, address to, uint256 amount, bytes extraData)", "event ERC20WithdrawalFinalized(address indexed l1Token, address indexed l2Token, address indexed from, address to, uint256 amount, bytes extraData)", "event ETHBridgeFinalized(address indexed from, address indexed to, uint256 amount, bytes extraData)", "event ETHBridgeInitiated(address indexed from, address indexed to, uint256 amount, bytes extraData)", "event ETHDepositInitiated(address indexed from, address indexed to, uint256 amount, bytes extraData)", "event ETHWithdrawalFinalized(address indexed from, address indexed to, uint256 amount, bytes extraData)", "event Initialized(uint8 version)"], `0x${string}`, `0x${string}`, "0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1">;
            read: import("@tevm/contract").ReadActionCreator<readonly ["constructor()", "receive() external payable", "function MESSENGER() view returns (address)", "function OTHER_BRIDGE() view returns (address)", "function bridgeERC20(address _localToken, address _remoteToken, uint256 _amount, uint32 _minGasLimit, bytes _extraData)", "function bridgeERC20To(address _localToken, address _remoteToken, address _to, uint256 _amount, uint32 _minGasLimit, bytes _extraData)", "function bridgeETH(uint32 _minGasLimit, bytes _extraData) payable", "function bridgeETHTo(address _to, uint32 _minGasLimit, bytes _extraData) payable", "function depositERC20(address _l1Token, address _l2Token, uint256 _amount, uint32 _minGasLimit, bytes _extraData)", "function depositERC20To(address _l1Token, address _l2Token, address _to, uint256 _amount, uint32 _minGasLimit, bytes _extraData)", "function depositETH(uint32 _minGasLimit, bytes _extraData) payable", "function depositETHTo(address _to, uint32 _minGasLimit, bytes _extraData) payable", "function deposits(address, address) view returns (uint256)", "function finalizeBridgeERC20(address _localToken, address _remoteToken, address _from, address _to, uint256 _amount, bytes _extraData)", "function finalizeBridgeETH(address _from, address _to, uint256 _amount, bytes _extraData) payable", "function finalizeERC20Withdrawal(address _l1Token, address _l2Token, address _from, address _to, uint256 _amount, bytes _extraData)", "function finalizeETHWithdrawal(address _from, address _to, uint256 _amount, bytes _extraData) payable", "function initialize(address _messenger, address _superchainConfig)", "function l2TokenBridge() view returns (address)", "function messenger() view returns (address)", "function otherBridge() view returns (address)", "function paused() view returns (bool)", "function superchainConfig() view returns (address)", "function version() view returns (string)", "event ERC20BridgeFinalized(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 amount, bytes extraData)", "event ERC20BridgeInitiated(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 amount, bytes extraData)", "event ERC20DepositInitiated(address indexed l1Token, address indexed l2Token, address indexed from, address to, uint256 amount, bytes extraData)", "event ERC20WithdrawalFinalized(address indexed l1Token, address indexed l2Token, address indexed from, address to, uint256 amount, bytes extraData)", "event ETHBridgeFinalized(address indexed from, address indexed to, uint256 amount, bytes extraData)", "event ETHBridgeInitiated(address indexed from, address indexed to, uint256 amount, bytes extraData)", "event ETHDepositInitiated(address indexed from, address indexed to, uint256 amount, bytes extraData)", "event ETHWithdrawalFinalized(address indexed from, address indexed to, uint256 amount, bytes extraData)", "event Initialized(uint8 version)"], `0x${string}`, `0x${string}`, "0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1">;
            write: import("@tevm/contract").WriteActionCreator<readonly ["constructor()", "receive() external payable", "function MESSENGER() view returns (address)", "function OTHER_BRIDGE() view returns (address)", "function bridgeERC20(address _localToken, address _remoteToken, uint256 _amount, uint32 _minGasLimit, bytes _extraData)", "function bridgeERC20To(address _localToken, address _remoteToken, address _to, uint256 _amount, uint32 _minGasLimit, bytes _extraData)", "function bridgeETH(uint32 _minGasLimit, bytes _extraData) payable", "function bridgeETHTo(address _to, uint32 _minGasLimit, bytes _extraData) payable", "function depositERC20(address _l1Token, address _l2Token, uint256 _amount, uint32 _minGasLimit, bytes _extraData)", "function depositERC20To(address _l1Token, address _l2Token, address _to, uint256 _amount, uint32 _minGasLimit, bytes _extraData)", "function depositETH(uint32 _minGasLimit, bytes _extraData) payable", "function depositETHTo(address _to, uint32 _minGasLimit, bytes _extraData) payable", "function deposits(address, address) view returns (uint256)", "function finalizeBridgeERC20(address _localToken, address _remoteToken, address _from, address _to, uint256 _amount, bytes _extraData)", "function finalizeBridgeETH(address _from, address _to, uint256 _amount, bytes _extraData) payable", "function finalizeERC20Withdrawal(address _l1Token, address _l2Token, address _from, address _to, uint256 _amount, bytes _extraData)", "function finalizeETHWithdrawal(address _from, address _to, uint256 _amount, bytes _extraData) payable", "function initialize(address _messenger, address _superchainConfig)", "function l2TokenBridge() view returns (address)", "function messenger() view returns (address)", "function otherBridge() view returns (address)", "function paused() view returns (bool)", "function superchainConfig() view returns (address)", "function version() view returns (string)", "event ERC20BridgeFinalized(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 amount, bytes extraData)", "event ERC20BridgeInitiated(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 amount, bytes extraData)", "event ERC20DepositInitiated(address indexed l1Token, address indexed l2Token, address indexed from, address to, uint256 amount, bytes extraData)", "event ERC20WithdrawalFinalized(address indexed l1Token, address indexed l2Token, address indexed from, address to, uint256 amount, bytes extraData)", "event ETHBridgeFinalized(address indexed from, address indexed to, uint256 amount, bytes extraData)", "event ETHBridgeInitiated(address indexed from, address indexed to, uint256 amount, bytes extraData)", "event ETHDepositInitiated(address indexed from, address indexed to, uint256 amount, bytes extraData)", "event ETHWithdrawalFinalized(address indexed from, address indexed to, uint256 amount, bytes extraData)", "event Initialized(uint8 version)"], `0x${string}`, `0x${string}`, "0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1">;
        };
        L2OutputOracle: Omit<import("@tevm/contract").Script<"L2OutputOracle", readonly ["constructor()", "function CHALLENGER() view returns (address)", "function FINALIZATION_PERIOD_SECONDS() view returns (uint256)", "function L2_BLOCK_TIME() view returns (uint256)", "function PROPOSER() view returns (address)", "function SUBMISSION_INTERVAL() view returns (uint256)", "function challenger() view returns (address)", "function computeL2Timestamp(uint256 _l2BlockNumber) view returns (uint256)", "function deleteL2Outputs(uint256 _l2OutputIndex)", "function finalizationPeriodSeconds() view returns (uint256)", "function getL2Output(uint256 _l2OutputIndex) view returns ((bytes32 outputRoot, uint128 timestamp, uint128 l2BlockNumber))", "function getL2OutputAfter(uint256 _l2BlockNumber) view returns ((bytes32 outputRoot, uint128 timestamp, uint128 l2BlockNumber))", "function getL2OutputIndexAfter(uint256 _l2BlockNumber) view returns (uint256)", "function initialize(uint256 _submissionInterval, uint256 _l2BlockTime, uint256 _startingBlockNumber, uint256 _startingTimestamp, address _proposer, address _challenger, uint256 _finalizationPeriodSeconds)", "function l2BlockTime() view returns (uint256)", "function latestBlockNumber() view returns (uint256)", "function latestOutputIndex() view returns (uint256)", "function nextBlockNumber() view returns (uint256)", "function nextOutputIndex() view returns (uint256)", "function proposeL2Output(bytes32 _outputRoot, uint256 _l2BlockNumber, bytes32 _l1BlockHash, uint256 _l1BlockNumber) payable", "function proposer() view returns (address)", "function startingBlockNumber() view returns (uint256)", "function startingTimestamp() view returns (uint256)", "function submissionInterval() view returns (uint256)", "function version() view returns (string)", "event Initialized(uint8 version)", "event OutputProposed(bytes32 indexed outputRoot, uint256 indexed l2OutputIndex, uint256 indexed l2BlockNumber, uint256 l1Timestamp)", "event OutputsDeleted(uint256 indexed prevNextOutputIndex, uint256 indexed newNextOutputIndex)"]>, "address" | "events" | "read" | "write"> & {
            address: "0xdfe97868233d1aa22e815a266982f2cf17685a27";
            events: import("@tevm/contract").EventActionCreator<readonly ["constructor()", "function CHALLENGER() view returns (address)", "function FINALIZATION_PERIOD_SECONDS() view returns (uint256)", "function L2_BLOCK_TIME() view returns (uint256)", "function PROPOSER() view returns (address)", "function SUBMISSION_INTERVAL() view returns (uint256)", "function challenger() view returns (address)", "function computeL2Timestamp(uint256 _l2BlockNumber) view returns (uint256)", "function deleteL2Outputs(uint256 _l2OutputIndex)", "function finalizationPeriodSeconds() view returns (uint256)", "function getL2Output(uint256 _l2OutputIndex) view returns ((bytes32 outputRoot, uint128 timestamp, uint128 l2BlockNumber))", "function getL2OutputAfter(uint256 _l2BlockNumber) view returns ((bytes32 outputRoot, uint128 timestamp, uint128 l2BlockNumber))", "function getL2OutputIndexAfter(uint256 _l2BlockNumber) view returns (uint256)", "function initialize(uint256 _submissionInterval, uint256 _l2BlockTime, uint256 _startingBlockNumber, uint256 _startingTimestamp, address _proposer, address _challenger, uint256 _finalizationPeriodSeconds)", "function l2BlockTime() view returns (uint256)", "function latestBlockNumber() view returns (uint256)", "function latestOutputIndex() view returns (uint256)", "function nextBlockNumber() view returns (uint256)", "function nextOutputIndex() view returns (uint256)", "function proposeL2Output(bytes32 _outputRoot, uint256 _l2BlockNumber, bytes32 _l1BlockHash, uint256 _l1BlockNumber) payable", "function proposer() view returns (address)", "function startingBlockNumber() view returns (uint256)", "function startingTimestamp() view returns (uint256)", "function submissionInterval() view returns (uint256)", "function version() view returns (string)", "event Initialized(uint8 version)", "event OutputProposed(bytes32 indexed outputRoot, uint256 indexed l2OutputIndex, uint256 indexed l2BlockNumber, uint256 l1Timestamp)", "event OutputsDeleted(uint256 indexed prevNextOutputIndex, uint256 indexed newNextOutputIndex)"], `0x${string}`, `0x${string}`, "0xdfe97868233d1aa22e815a266982f2cf17685a27">;
            read: import("@tevm/contract").ReadActionCreator<readonly ["constructor()", "function CHALLENGER() view returns (address)", "function FINALIZATION_PERIOD_SECONDS() view returns (uint256)", "function L2_BLOCK_TIME() view returns (uint256)", "function PROPOSER() view returns (address)", "function SUBMISSION_INTERVAL() view returns (uint256)", "function challenger() view returns (address)", "function computeL2Timestamp(uint256 _l2BlockNumber) view returns (uint256)", "function deleteL2Outputs(uint256 _l2OutputIndex)", "function finalizationPeriodSeconds() view returns (uint256)", "function getL2Output(uint256 _l2OutputIndex) view returns ((bytes32 outputRoot, uint128 timestamp, uint128 l2BlockNumber))", "function getL2OutputAfter(uint256 _l2BlockNumber) view returns ((bytes32 outputRoot, uint128 timestamp, uint128 l2BlockNumber))", "function getL2OutputIndexAfter(uint256 _l2BlockNumber) view returns (uint256)", "function initialize(uint256 _submissionInterval, uint256 _l2BlockTime, uint256 _startingBlockNumber, uint256 _startingTimestamp, address _proposer, address _challenger, uint256 _finalizationPeriodSeconds)", "function l2BlockTime() view returns (uint256)", "function latestBlockNumber() view returns (uint256)", "function latestOutputIndex() view returns (uint256)", "function nextBlockNumber() view returns (uint256)", "function nextOutputIndex() view returns (uint256)", "function proposeL2Output(bytes32 _outputRoot, uint256 _l2BlockNumber, bytes32 _l1BlockHash, uint256 _l1BlockNumber) payable", "function proposer() view returns (address)", "function startingBlockNumber() view returns (uint256)", "function startingTimestamp() view returns (uint256)", "function submissionInterval() view returns (uint256)", "function version() view returns (string)", "event Initialized(uint8 version)", "event OutputProposed(bytes32 indexed outputRoot, uint256 indexed l2OutputIndex, uint256 indexed l2BlockNumber, uint256 l1Timestamp)", "event OutputsDeleted(uint256 indexed prevNextOutputIndex, uint256 indexed newNextOutputIndex)"], `0x${string}`, `0x${string}`, "0xdfe97868233d1aa22e815a266982f2cf17685a27">;
            write: import("@tevm/contract").WriteActionCreator<readonly ["constructor()", "function CHALLENGER() view returns (address)", "function FINALIZATION_PERIOD_SECONDS() view returns (uint256)", "function L2_BLOCK_TIME() view returns (uint256)", "function PROPOSER() view returns (address)", "function SUBMISSION_INTERVAL() view returns (uint256)", "function challenger() view returns (address)", "function computeL2Timestamp(uint256 _l2BlockNumber) view returns (uint256)", "function deleteL2Outputs(uint256 _l2OutputIndex)", "function finalizationPeriodSeconds() view returns (uint256)", "function getL2Output(uint256 _l2OutputIndex) view returns ((bytes32 outputRoot, uint128 timestamp, uint128 l2BlockNumber))", "function getL2OutputAfter(uint256 _l2BlockNumber) view returns ((bytes32 outputRoot, uint128 timestamp, uint128 l2BlockNumber))", "function getL2OutputIndexAfter(uint256 _l2BlockNumber) view returns (uint256)", "function initialize(uint256 _submissionInterval, uint256 _l2BlockTime, uint256 _startingBlockNumber, uint256 _startingTimestamp, address _proposer, address _challenger, uint256 _finalizationPeriodSeconds)", "function l2BlockTime() view returns (uint256)", "function latestBlockNumber() view returns (uint256)", "function latestOutputIndex() view returns (uint256)", "function nextBlockNumber() view returns (uint256)", "function nextOutputIndex() view returns (uint256)", "function proposeL2Output(bytes32 _outputRoot, uint256 _l2BlockNumber, bytes32 _l1BlockHash, uint256 _l1BlockNumber) payable", "function proposer() view returns (address)", "function startingBlockNumber() view returns (uint256)", "function startingTimestamp() view returns (uint256)", "function submissionInterval() view returns (uint256)", "function version() view returns (string)", "event Initialized(uint8 version)", "event OutputProposed(bytes32 indexed outputRoot, uint256 indexed l2OutputIndex, uint256 indexed l2BlockNumber, uint256 l1Timestamp)", "event OutputsDeleted(uint256 indexed prevNextOutputIndex, uint256 indexed newNextOutputIndex)"], `0x${string}`, `0x${string}`, "0xdfe97868233d1aa22e815a266982f2cf17685a27">;
        };
        OptimismPortal2: Omit<import("@tevm/contract").Script<"OptimismPortal2", readonly ["constructor(uint256 _proofMaturityDelaySeconds, uint256 _disputeGameFinalityDelaySeconds, uint32 _initialRespectedGameType)", "receive() external payable", "function GUARDIAN() view returns (address)", "function SYSTEM_CONFIG() view returns (address)", "function blacklistDisputeGame(address _disputeGame)", "function checkWithdrawal(bytes32 _withdrawalHash) view", "function deleteProvenWithdrawal(bytes32 _withdrawalHash)", "function depositTransaction(address _to, uint256 _value, uint64 _gasLimit, bool _isCreation, bytes _data) payable", "function disputeGameBlacklist(address) view returns (bool)", "function disputeGameFactory() view returns (address)", "function donateETH() payable", "function finalizeWithdrawalTransaction((uint256 nonce, address sender, address target, uint256 value, uint256 gasLimit, bytes data) _tx)", "function finalizedWithdrawals(bytes32) view returns (bool)", "function guardian() view returns (address)", "function initialize(address _disputeGameFactory, address _systemConfig, address _superchainConfig)", "function l2Sender() view returns (address)", "function minimumGasLimit(uint64 _byteCount) pure returns (uint64)", "function params() view returns (uint128 prevBaseFee, uint64 prevBoughtGas, uint64 prevBlockNum)", "function paused() view returns (bool paused_)", "function proveWithdrawalTransaction((uint256 nonce, address sender, address target, uint256 value, uint256 gasLimit, bytes data) _tx, uint256 _disputeGameIndex, (bytes32 version, bytes32 stateRoot, bytes32 messagePasserStorageRoot, bytes32 latestBlockhash) _outputRootProof, bytes[] _withdrawalProof)", "function provenWithdrawals(bytes32) view returns (address disputeGameProxy, uint64 timestamp)", "function respectedGameType() view returns (uint32)", "function setRespectedGameType(uint32 _gameType)", "function superchainConfig() view returns (address)", "function systemConfig() view returns (address)", "function version() view returns (string)", "event Initialized(uint8 version)", "event TransactionDeposited(address indexed from, address indexed to, uint256 indexed version, bytes opaqueData)", "event WithdrawalFinalized(bytes32 indexed withdrawalHash, bool success)", "event WithdrawalProven(bytes32 indexed withdrawalHash, address indexed from, address indexed to)"]>, "address" | "events" | "read" | "write"> & {
            address: "0xbEb5Fc579115071764c7423A4f12eDde41f106Ed";
            events: import("@tevm/contract").EventActionCreator<readonly ["constructor(uint256 _proofMaturityDelaySeconds, uint256 _disputeGameFinalityDelaySeconds, uint32 _initialRespectedGameType)", "receive() external payable", "function GUARDIAN() view returns (address)", "function SYSTEM_CONFIG() view returns (address)", "function blacklistDisputeGame(address _disputeGame)", "function checkWithdrawal(bytes32 _withdrawalHash) view", "function deleteProvenWithdrawal(bytes32 _withdrawalHash)", "function depositTransaction(address _to, uint256 _value, uint64 _gasLimit, bool _isCreation, bytes _data) payable", "function disputeGameBlacklist(address) view returns (bool)", "function disputeGameFactory() view returns (address)", "function donateETH() payable", "function finalizeWithdrawalTransaction((uint256 nonce, address sender, address target, uint256 value, uint256 gasLimit, bytes data) _tx)", "function finalizedWithdrawals(bytes32) view returns (bool)", "function guardian() view returns (address)", "function initialize(address _disputeGameFactory, address _systemConfig, address _superchainConfig)", "function l2Sender() view returns (address)", "function minimumGasLimit(uint64 _byteCount) pure returns (uint64)", "function params() view returns (uint128 prevBaseFee, uint64 prevBoughtGas, uint64 prevBlockNum)", "function paused() view returns (bool paused_)", "function proveWithdrawalTransaction((uint256 nonce, address sender, address target, uint256 value, uint256 gasLimit, bytes data) _tx, uint256 _disputeGameIndex, (bytes32 version, bytes32 stateRoot, bytes32 messagePasserStorageRoot, bytes32 latestBlockhash) _outputRootProof, bytes[] _withdrawalProof)", "function provenWithdrawals(bytes32) view returns (address disputeGameProxy, uint64 timestamp)", "function respectedGameType() view returns (uint32)", "function setRespectedGameType(uint32 _gameType)", "function superchainConfig() view returns (address)", "function systemConfig() view returns (address)", "function version() view returns (string)", "event Initialized(uint8 version)", "event TransactionDeposited(address indexed from, address indexed to, uint256 indexed version, bytes opaqueData)", "event WithdrawalFinalized(bytes32 indexed withdrawalHash, bool success)", "event WithdrawalProven(bytes32 indexed withdrawalHash, address indexed from, address indexed to)"], `0x${string}`, `0x${string}`, "0xbEb5Fc579115071764c7423A4f12eDde41f106Ed">;
            read: import("@tevm/contract").ReadActionCreator<readonly ["constructor(uint256 _proofMaturityDelaySeconds, uint256 _disputeGameFinalityDelaySeconds, uint32 _initialRespectedGameType)", "receive() external payable", "function GUARDIAN() view returns (address)", "function SYSTEM_CONFIG() view returns (address)", "function blacklistDisputeGame(address _disputeGame)", "function checkWithdrawal(bytes32 _withdrawalHash) view", "function deleteProvenWithdrawal(bytes32 _withdrawalHash)", "function depositTransaction(address _to, uint256 _value, uint64 _gasLimit, bool _isCreation, bytes _data) payable", "function disputeGameBlacklist(address) view returns (bool)", "function disputeGameFactory() view returns (address)", "function donateETH() payable", "function finalizeWithdrawalTransaction((uint256 nonce, address sender, address target, uint256 value, uint256 gasLimit, bytes data) _tx)", "function finalizedWithdrawals(bytes32) view returns (bool)", "function guardian() view returns (address)", "function initialize(address _disputeGameFactory, address _systemConfig, address _superchainConfig)", "function l2Sender() view returns (address)", "function minimumGasLimit(uint64 _byteCount) pure returns (uint64)", "function params() view returns (uint128 prevBaseFee, uint64 prevBoughtGas, uint64 prevBlockNum)", "function paused() view returns (bool paused_)", "function proveWithdrawalTransaction((uint256 nonce, address sender, address target, uint256 value, uint256 gasLimit, bytes data) _tx, uint256 _disputeGameIndex, (bytes32 version, bytes32 stateRoot, bytes32 messagePasserStorageRoot, bytes32 latestBlockhash) _outputRootProof, bytes[] _withdrawalProof)", "function provenWithdrawals(bytes32) view returns (address disputeGameProxy, uint64 timestamp)", "function respectedGameType() view returns (uint32)", "function setRespectedGameType(uint32 _gameType)", "function superchainConfig() view returns (address)", "function systemConfig() view returns (address)", "function version() view returns (string)", "event Initialized(uint8 version)", "event TransactionDeposited(address indexed from, address indexed to, uint256 indexed version, bytes opaqueData)", "event WithdrawalFinalized(bytes32 indexed withdrawalHash, bool success)", "event WithdrawalProven(bytes32 indexed withdrawalHash, address indexed from, address indexed to)"], `0x${string}`, `0x${string}`, "0xbEb5Fc579115071764c7423A4f12eDde41f106Ed">;
            write: import("@tevm/contract").WriteActionCreator<readonly ["constructor(uint256 _proofMaturityDelaySeconds, uint256 _disputeGameFinalityDelaySeconds, uint32 _initialRespectedGameType)", "receive() external payable", "function GUARDIAN() view returns (address)", "function SYSTEM_CONFIG() view returns (address)", "function blacklistDisputeGame(address _disputeGame)", "function checkWithdrawal(bytes32 _withdrawalHash) view", "function deleteProvenWithdrawal(bytes32 _withdrawalHash)", "function depositTransaction(address _to, uint256 _value, uint64 _gasLimit, bool _isCreation, bytes _data) payable", "function disputeGameBlacklist(address) view returns (bool)", "function disputeGameFactory() view returns (address)", "function donateETH() payable", "function finalizeWithdrawalTransaction((uint256 nonce, address sender, address target, uint256 value, uint256 gasLimit, bytes data) _tx)", "function finalizedWithdrawals(bytes32) view returns (bool)", "function guardian() view returns (address)", "function initialize(address _disputeGameFactory, address _systemConfig, address _superchainConfig)", "function l2Sender() view returns (address)", "function minimumGasLimit(uint64 _byteCount) pure returns (uint64)", "function params() view returns (uint128 prevBaseFee, uint64 prevBoughtGas, uint64 prevBlockNum)", "function paused() view returns (bool paused_)", "function proveWithdrawalTransaction((uint256 nonce, address sender, address target, uint256 value, uint256 gasLimit, bytes data) _tx, uint256 _disputeGameIndex, (bytes32 version, bytes32 stateRoot, bytes32 messagePasserStorageRoot, bytes32 latestBlockhash) _outputRootProof, bytes[] _withdrawalProof)", "function provenWithdrawals(bytes32) view returns (address disputeGameProxy, uint64 timestamp)", "function respectedGameType() view returns (uint32)", "function setRespectedGameType(uint32 _gameType)", "function superchainConfig() view returns (address)", "function systemConfig() view returns (address)", "function version() view returns (string)", "event Initialized(uint8 version)", "event TransactionDeposited(address indexed from, address indexed to, uint256 indexed version, bytes opaqueData)", "event WithdrawalFinalized(bytes32 indexed withdrawalHash, bool success)", "event WithdrawalProven(bytes32 indexed withdrawalHash, address indexed from, address indexed to)"], `0x${string}`, `0x${string}`, "0xbEb5Fc579115071764c7423A4f12eDde41f106Ed">;
        };
        DisputeGameFactory: Omit<import("@tevm/contract").Script<"DisputeGameFactory", readonly ["constructor()", "function create(uint32 _gameType, bytes32 _rootClaim, bytes _extraData) payable returns (address proxy_)", "function findLatestGames(uint32 _gameType, uint256 _start, uint256 _n) view returns ((uint256 index, bytes32 metadata, uint64 timestamp, bytes32 rootClaim, bytes extraData)[] games_)", "function gameAtIndex(uint256 _index) view returns (uint32 gameType_, uint64 timestamp_, address proxy_)", "function gameCount() view returns (uint256 gameCount_)", "function gameImpls(uint32) view returns (address)", "function games(uint32 _gameType, bytes32 _rootClaim, bytes _extraData) view returns (address proxy_, uint64 timestamp_)", "function getGameUUID(uint32 _gameType, bytes32 _rootClaim, bytes _extraData) pure returns (bytes32 uuid_)", "function initBonds(uint32) view returns (uint256)", "function initialize(address _owner)", "function owner() view returns (address)", "function renounceOwnership()", "function setImplementation(uint32 _gameType, address _impl)", "function setInitBond(uint32 _gameType, uint256 _initBond)", "function transferOwnership(address newOwner)", "function version() view returns (string)", "event DisputeGameCreated(address indexed disputeProxy, uint32 indexed gameType, bytes32 indexed rootClaim)", "event ImplementationSet(address indexed impl, uint32 indexed gameType)", "event InitBondUpdated(uint32 indexed gameType, uint256 indexed newBond)", "event Initialized(uint8 version)", "event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)", "error GameAlreadyExists(bytes32 uuid)", "error InsufficientBond()", "error NoImplementation(uint32 gameType)"]>, "address" | "events" | "read" | "write"> & {
            address: "0x6901690169016901690169016901690169016901";
            events: import("@tevm/contract").EventActionCreator<readonly ["constructor()", "function create(uint32 _gameType, bytes32 _rootClaim, bytes _extraData) payable returns (address proxy_)", "function findLatestGames(uint32 _gameType, uint256 _start, uint256 _n) view returns ((uint256 index, bytes32 metadata, uint64 timestamp, bytes32 rootClaim, bytes extraData)[] games_)", "function gameAtIndex(uint256 _index) view returns (uint32 gameType_, uint64 timestamp_, address proxy_)", "function gameCount() view returns (uint256 gameCount_)", "function gameImpls(uint32) view returns (address)", "function games(uint32 _gameType, bytes32 _rootClaim, bytes _extraData) view returns (address proxy_, uint64 timestamp_)", "function getGameUUID(uint32 _gameType, bytes32 _rootClaim, bytes _extraData) pure returns (bytes32 uuid_)", "function initBonds(uint32) view returns (uint256)", "function initialize(address _owner)", "function owner() view returns (address)", "function renounceOwnership()", "function setImplementation(uint32 _gameType, address _impl)", "function setInitBond(uint32 _gameType, uint256 _initBond)", "function transferOwnership(address newOwner)", "function version() view returns (string)", "event DisputeGameCreated(address indexed disputeProxy, uint32 indexed gameType, bytes32 indexed rootClaim)", "event ImplementationSet(address indexed impl, uint32 indexed gameType)", "event InitBondUpdated(uint32 indexed gameType, uint256 indexed newBond)", "event Initialized(uint8 version)", "event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)", "error GameAlreadyExists(bytes32 uuid)", "error InsufficientBond()", "error NoImplementation(uint32 gameType)"], `0x${string}`, `0x${string}`, "0x6901690169016901690169016901690169016901">;
            read: import("@tevm/contract").ReadActionCreator<readonly ["constructor()", "function create(uint32 _gameType, bytes32 _rootClaim, bytes _extraData) payable returns (address proxy_)", "function findLatestGames(uint32 _gameType, uint256 _start, uint256 _n) view returns ((uint256 index, bytes32 metadata, uint64 timestamp, bytes32 rootClaim, bytes extraData)[] games_)", "function gameAtIndex(uint256 _index) view returns (uint32 gameType_, uint64 timestamp_, address proxy_)", "function gameCount() view returns (uint256 gameCount_)", "function gameImpls(uint32) view returns (address)", "function games(uint32 _gameType, bytes32 _rootClaim, bytes _extraData) view returns (address proxy_, uint64 timestamp_)", "function getGameUUID(uint32 _gameType, bytes32 _rootClaim, bytes _extraData) pure returns (bytes32 uuid_)", "function initBonds(uint32) view returns (uint256)", "function initialize(address _owner)", "function owner() view returns (address)", "function renounceOwnership()", "function setImplementation(uint32 _gameType, address _impl)", "function setInitBond(uint32 _gameType, uint256 _initBond)", "function transferOwnership(address newOwner)", "function version() view returns (string)", "event DisputeGameCreated(address indexed disputeProxy, uint32 indexed gameType, bytes32 indexed rootClaim)", "event ImplementationSet(address indexed impl, uint32 indexed gameType)", "event InitBondUpdated(uint32 indexed gameType, uint256 indexed newBond)", "event Initialized(uint8 version)", "event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)", "error GameAlreadyExists(bytes32 uuid)", "error InsufficientBond()", "error NoImplementation(uint32 gameType)"], `0x${string}`, `0x${string}`, "0x6901690169016901690169016901690169016901">;
            write: import("@tevm/contract").WriteActionCreator<readonly ["constructor()", "function create(uint32 _gameType, bytes32 _rootClaim, bytes _extraData) payable returns (address proxy_)", "function findLatestGames(uint32 _gameType, uint256 _start, uint256 _n) view returns ((uint256 index, bytes32 metadata, uint64 timestamp, bytes32 rootClaim, bytes extraData)[] games_)", "function gameAtIndex(uint256 _index) view returns (uint32 gameType_, uint64 timestamp_, address proxy_)", "function gameCount() view returns (uint256 gameCount_)", "function gameImpls(uint32) view returns (address)", "function games(uint32 _gameType, bytes32 _rootClaim, bytes _extraData) view returns (address proxy_, uint64 timestamp_)", "function getGameUUID(uint32 _gameType, bytes32 _rootClaim, bytes _extraData) pure returns (bytes32 uuid_)", "function initBonds(uint32) view returns (uint256)", "function initialize(address _owner)", "function owner() view returns (address)", "function renounceOwnership()", "function setImplementation(uint32 _gameType, address _impl)", "function setInitBond(uint32 _gameType, uint256 _initBond)", "function transferOwnership(address newOwner)", "function version() view returns (string)", "event DisputeGameCreated(address indexed disputeProxy, uint32 indexed gameType, bytes32 indexed rootClaim)", "event ImplementationSet(address indexed impl, uint32 indexed gameType)", "event InitBondUpdated(uint32 indexed gameType, uint256 indexed newBond)", "event Initialized(uint8 version)", "event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)", "error GameAlreadyExists(bytes32 uuid)", "error InsufficientBond()", "error NoImplementation(uint32 gameType)"], `0x${string}`, `0x${string}`, "0x6901690169016901690169016901690169016901">;
        };
        SystemConfig: Omit<import("@tevm/contract").Script<"SystemConfig", readonly ["constructor()", "function BATCH_INBOX_SLOT() view returns (bytes32)", "function L1_CROSS_DOMAIN_MESSENGER_SLOT() view returns (bytes32)", "function L1_ERC_721_BRIDGE_SLOT() view returns (bytes32)", "function L1_STANDARD_BRIDGE_SLOT() view returns (bytes32)", "function L2_OUTPUT_ORACLE_SLOT() view returns (bytes32)", "function OPTIMISM_MINTABLE_ERC20_FACTORY_SLOT() view returns (bytes32)", "function OPTIMISM_PORTAL_SLOT() view returns (bytes32)", "function START_BLOCK_SLOT() view returns (bytes32)", "function UNSAFE_BLOCK_SIGNER_SLOT() view returns (bytes32)", "function VERSION() view returns (uint256)", "function batchInbox() view returns (address addr_)", "function batcherHash() view returns (bytes32)", "function gasLimit() view returns (uint64)", "function initialize(address _owner, uint256 _overhead, uint256 _scalar, bytes32 _batcherHash, uint64 _gasLimit, address _unsafeBlockSigner, (uint32 maxResourceLimit, uint8 elasticityMultiplier, uint8 baseFeeMaxChangeDenominator, uint32 minimumBaseFee, uint32 systemTxMaxGas, uint128 maximumBaseFee) _config, address _batchInbox, (address l1CrossDomainMessenger, address l1ERC721Bridge, address l1StandardBridge, address l2OutputOracle, address optimismPortal, address optimismMintableERC20Factory) _addresses)", "function l1CrossDomainMessenger() view returns (address addr_)", "function l1ERC721Bridge() view returns (address addr_)", "function l1StandardBridge() view returns (address addr_)", "function l2OutputOracle() view returns (address addr_)", "function minimumGasLimit() view returns (uint64)", "function optimismMintableERC20Factory() view returns (address addr_)", "function optimismPortal() view returns (address addr_)", "function overhead() view returns (uint256)", "function owner() view returns (address)", "function renounceOwnership()", "function resourceConfig() view returns ((uint32 maxResourceLimit, uint8 elasticityMultiplier, uint8 baseFeeMaxChangeDenominator, uint32 minimumBaseFee, uint32 systemTxMaxGas, uint128 maximumBaseFee))", "function scalar() view returns (uint256)", "function setBatcherHash(bytes32 _batcherHash)", "function setGasConfig(uint256 _overhead, uint256 _scalar)", "function setGasLimit(uint64 _gasLimit)", "function setResourceConfig((uint32 maxResourceLimit, uint8 elasticityMultiplier, uint8 baseFeeMaxChangeDenominator, uint32 minimumBaseFee, uint32 systemTxMaxGas, uint128 maximumBaseFee) _config)", "function setUnsafeBlockSigner(address _unsafeBlockSigner)", "function startBlock() view returns (uint256 startBlock_)", "function transferOwnership(address newOwner)", "function unsafeBlockSigner() view returns (address addr_)", "function version() view returns (string)", "event ConfigUpdate(uint256 indexed version, uint8 indexed updateType, bytes data)", "event Initialized(uint8 version)", "event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)"]>, "address" | "events" | "read" | "write"> & {
            address: "0x229047fed2591dbec1eF1118d64F7aF3dB9EB290";
            events: import("@tevm/contract").EventActionCreator<readonly ["constructor()", "function BATCH_INBOX_SLOT() view returns (bytes32)", "function L1_CROSS_DOMAIN_MESSENGER_SLOT() view returns (bytes32)", "function L1_ERC_721_BRIDGE_SLOT() view returns (bytes32)", "function L1_STANDARD_BRIDGE_SLOT() view returns (bytes32)", "function L2_OUTPUT_ORACLE_SLOT() view returns (bytes32)", "function OPTIMISM_MINTABLE_ERC20_FACTORY_SLOT() view returns (bytes32)", "function OPTIMISM_PORTAL_SLOT() view returns (bytes32)", "function START_BLOCK_SLOT() view returns (bytes32)", "function UNSAFE_BLOCK_SIGNER_SLOT() view returns (bytes32)", "function VERSION() view returns (uint256)", "function batchInbox() view returns (address addr_)", "function batcherHash() view returns (bytes32)", "function gasLimit() view returns (uint64)", "function initialize(address _owner, uint256 _overhead, uint256 _scalar, bytes32 _batcherHash, uint64 _gasLimit, address _unsafeBlockSigner, (uint32 maxResourceLimit, uint8 elasticityMultiplier, uint8 baseFeeMaxChangeDenominator, uint32 minimumBaseFee, uint32 systemTxMaxGas, uint128 maximumBaseFee) _config, address _batchInbox, (address l1CrossDomainMessenger, address l1ERC721Bridge, address l1StandardBridge, address l2OutputOracle, address optimismPortal, address optimismMintableERC20Factory) _addresses)", "function l1CrossDomainMessenger() view returns (address addr_)", "function l1ERC721Bridge() view returns (address addr_)", "function l1StandardBridge() view returns (address addr_)", "function l2OutputOracle() view returns (address addr_)", "function minimumGasLimit() view returns (uint64)", "function optimismMintableERC20Factory() view returns (address addr_)", "function optimismPortal() view returns (address addr_)", "function overhead() view returns (uint256)", "function owner() view returns (address)", "function renounceOwnership()", "function resourceConfig() view returns ((uint32 maxResourceLimit, uint8 elasticityMultiplier, uint8 baseFeeMaxChangeDenominator, uint32 minimumBaseFee, uint32 systemTxMaxGas, uint128 maximumBaseFee))", "function scalar() view returns (uint256)", "function setBatcherHash(bytes32 _batcherHash)", "function setGasConfig(uint256 _overhead, uint256 _scalar)", "function setGasLimit(uint64 _gasLimit)", "function setResourceConfig((uint32 maxResourceLimit, uint8 elasticityMultiplier, uint8 baseFeeMaxChangeDenominator, uint32 minimumBaseFee, uint32 systemTxMaxGas, uint128 maximumBaseFee) _config)", "function setUnsafeBlockSigner(address _unsafeBlockSigner)", "function startBlock() view returns (uint256 startBlock_)", "function transferOwnership(address newOwner)", "function unsafeBlockSigner() view returns (address addr_)", "function version() view returns (string)", "event ConfigUpdate(uint256 indexed version, uint8 indexed updateType, bytes data)", "event Initialized(uint8 version)", "event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)"], `0x${string}`, `0x${string}`, "0x229047fed2591dbec1eF1118d64F7aF3dB9EB290">;
            read: import("@tevm/contract").ReadActionCreator<readonly ["constructor()", "function BATCH_INBOX_SLOT() view returns (bytes32)", "function L1_CROSS_DOMAIN_MESSENGER_SLOT() view returns (bytes32)", "function L1_ERC_721_BRIDGE_SLOT() view returns (bytes32)", "function L1_STANDARD_BRIDGE_SLOT() view returns (bytes32)", "function L2_OUTPUT_ORACLE_SLOT() view returns (bytes32)", "function OPTIMISM_MINTABLE_ERC20_FACTORY_SLOT() view returns (bytes32)", "function OPTIMISM_PORTAL_SLOT() view returns (bytes32)", "function START_BLOCK_SLOT() view returns (bytes32)", "function UNSAFE_BLOCK_SIGNER_SLOT() view returns (bytes32)", "function VERSION() view returns (uint256)", "function batchInbox() view returns (address addr_)", "function batcherHash() view returns (bytes32)", "function gasLimit() view returns (uint64)", "function initialize(address _owner, uint256 _overhead, uint256 _scalar, bytes32 _batcherHash, uint64 _gasLimit, address _unsafeBlockSigner, (uint32 maxResourceLimit, uint8 elasticityMultiplier, uint8 baseFeeMaxChangeDenominator, uint32 minimumBaseFee, uint32 systemTxMaxGas, uint128 maximumBaseFee) _config, address _batchInbox, (address l1CrossDomainMessenger, address l1ERC721Bridge, address l1StandardBridge, address l2OutputOracle, address optimismPortal, address optimismMintableERC20Factory) _addresses)", "function l1CrossDomainMessenger() view returns (address addr_)", "function l1ERC721Bridge() view returns (address addr_)", "function l1StandardBridge() view returns (address addr_)", "function l2OutputOracle() view returns (address addr_)", "function minimumGasLimit() view returns (uint64)", "function optimismMintableERC20Factory() view returns (address addr_)", "function optimismPortal() view returns (address addr_)", "function overhead() view returns (uint256)", "function owner() view returns (address)", "function renounceOwnership()", "function resourceConfig() view returns ((uint32 maxResourceLimit, uint8 elasticityMultiplier, uint8 baseFeeMaxChangeDenominator, uint32 minimumBaseFee, uint32 systemTxMaxGas, uint128 maximumBaseFee))", "function scalar() view returns (uint256)", "function setBatcherHash(bytes32 _batcherHash)", "function setGasConfig(uint256 _overhead, uint256 _scalar)", "function setGasLimit(uint64 _gasLimit)", "function setResourceConfig((uint32 maxResourceLimit, uint8 elasticityMultiplier, uint8 baseFeeMaxChangeDenominator, uint32 minimumBaseFee, uint32 systemTxMaxGas, uint128 maximumBaseFee) _config)", "function setUnsafeBlockSigner(address _unsafeBlockSigner)", "function startBlock() view returns (uint256 startBlock_)", "function transferOwnership(address newOwner)", "function unsafeBlockSigner() view returns (address addr_)", "function version() view returns (string)", "event ConfigUpdate(uint256 indexed version, uint8 indexed updateType, bytes data)", "event Initialized(uint8 version)", "event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)"], `0x${string}`, `0x${string}`, "0x229047fed2591dbec1eF1118d64F7aF3dB9EB290">;
            write: import("@tevm/contract").WriteActionCreator<readonly ["constructor()", "function BATCH_INBOX_SLOT() view returns (bytes32)", "function L1_CROSS_DOMAIN_MESSENGER_SLOT() view returns (bytes32)", "function L1_ERC_721_BRIDGE_SLOT() view returns (bytes32)", "function L1_STANDARD_BRIDGE_SLOT() view returns (bytes32)", "function L2_OUTPUT_ORACLE_SLOT() view returns (bytes32)", "function OPTIMISM_MINTABLE_ERC20_FACTORY_SLOT() view returns (bytes32)", "function OPTIMISM_PORTAL_SLOT() view returns (bytes32)", "function START_BLOCK_SLOT() view returns (bytes32)", "function UNSAFE_BLOCK_SIGNER_SLOT() view returns (bytes32)", "function VERSION() view returns (uint256)", "function batchInbox() view returns (address addr_)", "function batcherHash() view returns (bytes32)", "function gasLimit() view returns (uint64)", "function initialize(address _owner, uint256 _overhead, uint256 _scalar, bytes32 _batcherHash, uint64 _gasLimit, address _unsafeBlockSigner, (uint32 maxResourceLimit, uint8 elasticityMultiplier, uint8 baseFeeMaxChangeDenominator, uint32 minimumBaseFee, uint32 systemTxMaxGas, uint128 maximumBaseFee) _config, address _batchInbox, (address l1CrossDomainMessenger, address l1ERC721Bridge, address l1StandardBridge, address l2OutputOracle, address optimismPortal, address optimismMintableERC20Factory) _addresses)", "function l1CrossDomainMessenger() view returns (address addr_)", "function l1ERC721Bridge() view returns (address addr_)", "function l1StandardBridge() view returns (address addr_)", "function l2OutputOracle() view returns (address addr_)", "function minimumGasLimit() view returns (uint64)", "function optimismMintableERC20Factory() view returns (address addr_)", "function optimismPortal() view returns (address addr_)", "function overhead() view returns (uint256)", "function owner() view returns (address)", "function renounceOwnership()", "function resourceConfig() view returns ((uint32 maxResourceLimit, uint8 elasticityMultiplier, uint8 baseFeeMaxChangeDenominator, uint32 minimumBaseFee, uint32 systemTxMaxGas, uint128 maximumBaseFee))", "function scalar() view returns (uint256)", "function setBatcherHash(bytes32 _batcherHash)", "function setGasConfig(uint256 _overhead, uint256 _scalar)", "function setGasLimit(uint64 _gasLimit)", "function setResourceConfig((uint32 maxResourceLimit, uint8 elasticityMultiplier, uint8 baseFeeMaxChangeDenominator, uint32 minimumBaseFee, uint32 systemTxMaxGas, uint128 maximumBaseFee) _config)", "function setUnsafeBlockSigner(address _unsafeBlockSigner)", "function startBlock() view returns (uint256 startBlock_)", "function transferOwnership(address newOwner)", "function unsafeBlockSigner() view returns (address addr_)", "function version() view returns (string)", "event ConfigUpdate(uint256 indexed version, uint8 indexed updateType, bytes data)", "event Initialized(uint8 version)", "event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)"], `0x${string}`, `0x${string}`, "0x229047fed2591dbec1eF1118d64F7aF3dB9EB290">;
        };
        OptimismMintableERC20Factory: Omit<import("@tevm/contract").Script<"OptimismMintableERC20Factory", readonly ["constructor()", "function BRIDGE() view returns (address)", "function bridge() view returns (address)", "function createOptimismMintableERC20(address _remoteToken, string _name, string _symbol) returns (address)", "function createOptimismMintableERC20WithDecimals(address _remoteToken, string _name, string _symbol, uint8 _decimals) returns (address)", "function createStandardL2Token(address _remoteToken, string _name, string _symbol) returns (address)", "function initialize(address _bridge)", "function version() view returns (string)", "event Initialized(uint8 version)", "event OptimismMintableERC20Created(address indexed localToken, address indexed remoteToken, address deployer)", "event StandardL2TokenCreated(address indexed remoteToken, address indexed localToken)"]>, "address" | "events" | "read" | "write"> & {
            address: "0x75505a97BD334E7BD3C476893285569C4136Fa0F";
            events: import("@tevm/contract").EventActionCreator<readonly ["constructor()", "function BRIDGE() view returns (address)", "function bridge() view returns (address)", "function createOptimismMintableERC20(address _remoteToken, string _name, string _symbol) returns (address)", "function createOptimismMintableERC20WithDecimals(address _remoteToken, string _name, string _symbol, uint8 _decimals) returns (address)", "function createStandardL2Token(address _remoteToken, string _name, string _symbol) returns (address)", "function initialize(address _bridge)", "function version() view returns (string)", "event Initialized(uint8 version)", "event OptimismMintableERC20Created(address indexed localToken, address indexed remoteToken, address deployer)", "event StandardL2TokenCreated(address indexed remoteToken, address indexed localToken)"], `0x${string}`, `0x${string}`, "0x75505a97BD334E7BD3C476893285569C4136Fa0F">;
            read: import("@tevm/contract").ReadActionCreator<readonly ["constructor()", "function BRIDGE() view returns (address)", "function bridge() view returns (address)", "function createOptimismMintableERC20(address _remoteToken, string _name, string _symbol) returns (address)", "function createOptimismMintableERC20WithDecimals(address _remoteToken, string _name, string _symbol, uint8 _decimals) returns (address)", "function createStandardL2Token(address _remoteToken, string _name, string _symbol) returns (address)", "function initialize(address _bridge)", "function version() view returns (string)", "event Initialized(uint8 version)", "event OptimismMintableERC20Created(address indexed localToken, address indexed remoteToken, address deployer)", "event StandardL2TokenCreated(address indexed remoteToken, address indexed localToken)"], `0x${string}`, `0x${string}`, "0x75505a97BD334E7BD3C476893285569C4136Fa0F">;
            write: import("@tevm/contract").WriteActionCreator<readonly ["constructor()", "function BRIDGE() view returns (address)", "function bridge() view returns (address)", "function createOptimismMintableERC20(address _remoteToken, string _name, string _symbol) returns (address)", "function createOptimismMintableERC20WithDecimals(address _remoteToken, string _name, string _symbol, uint8 _decimals) returns (address)", "function createStandardL2Token(address _remoteToken, string _name, string _symbol) returns (address)", "function initialize(address _bridge)", "function version() view returns (string)", "event Initialized(uint8 version)", "event OptimismMintableERC20Created(address indexed localToken, address indexed remoteToken, address deployer)", "event StandardL2TokenCreated(address indexed remoteToken, address indexed localToken)"], `0x${string}`, `0x${string}`, "0x75505a97BD334E7BD3C476893285569C4136Fa0F">;
        };
    };
    tevmReady: () => Promise<true>;
    account: undefined;
    batch?: {
        multicall?: boolean | {
            batchSize?: number | undefined;
            wait?: number | undefined;
        } | undefined;
    } | undefined;
    cacheTime: number;
    ccipRead?: false | {
        request?: (parameters: import("viem").CcipRequestParameters) => Promise<`0x${string}`>;
    } | undefined;
    chain: undefined;
    key: string;
    name: string;
    pollingInterval: number;
    request: import("viem").EIP1193RequestFn<[{
        Method: "web3_clientVersion";
        Parameters?: undefined;
        ReturnType: string;
    }, {
        Method: "web3_sha3";
        Parameters: [data: `0x${string}`];
        ReturnType: string;
    }, {
        Method: "net_listening";
        Parameters?: undefined;
        ReturnType: boolean;
    }, {
        Method: "net_peerCount";
        Parameters?: undefined;
        ReturnType: `0x${string}`;
    }, {
        Method: "net_version";
        Parameters?: undefined;
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_blobBaseFee";
        Parameters?: undefined;
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_blockNumber";
        Parameters?: undefined;
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_call";
        Parameters: [transaction: import("viem").ExactPartial<import("viem").RpcTransactionRequest>] | [transaction: import("viem").ExactPartial<import("viem").RpcTransactionRequest>, block: `0x${string}` | import("viem").BlockTag | import("viem").RpcBlockIdentifier] | [transaction: import("viem").ExactPartial<import("viem").RpcTransactionRequest>, block: `0x${string}` | import("viem").BlockTag | import("viem").RpcBlockIdentifier, stateOverrideSet: import("viem").RpcStateOverride];
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_chainId";
        Parameters?: undefined;
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_coinbase";
        Parameters?: undefined;
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_estimateGas";
        Parameters: [transaction: import("viem").RpcTransactionRequest] | [transaction: import("viem").RpcTransactionRequest, block: `0x${string}` | import("viem").BlockTag] | [transaction: import("viem").RpcTransactionRequest, block: `0x${string}` | import("viem").BlockTag, import("viem").RpcStateOverride];
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_feeHistory";
        Parameters: [blockCount: `0x${string}`, newestBlock: `0x${string}` | import("viem").BlockTag, rewardPercentiles: number[] | undefined];
        ReturnType: import("viem").RpcFeeHistory;
    }, {
        Method: "eth_gasPrice";
        Parameters?: undefined;
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_getBalance";
        Parameters: [address: `0x${string}`, block: `0x${string}` | import("viem").BlockTag | import("viem").RpcBlockIdentifier];
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_getBlockByHash";
        Parameters: [hash: `0x${string}`, includeTransactionObjects: boolean];
        ReturnType: import("viem").RpcBlock | null;
    }, {
        Method: "eth_getBlockByNumber";
        Parameters: [block: `0x${string}` | import("viem").BlockTag, includeTransactionObjects: boolean];
        ReturnType: import("viem").RpcBlock | null;
    }, {
        Method: "eth_getBlockTransactionCountByHash";
        Parameters: [hash: `0x${string}`];
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_getBlockTransactionCountByNumber";
        Parameters: [block: `0x${string}` | import("viem").BlockTag];
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_getCode";
        Parameters: [address: `0x${string}`, block: `0x${string}` | import("viem").BlockTag | import("viem").RpcBlockIdentifier];
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_getFilterChanges";
        Parameters: [filterId: `0x${string}`];
        ReturnType: `0x${string}`[] | import("viem").RpcLog[];
    }, {
        Method: "eth_getFilterLogs";
        Parameters: [filterId: `0x${string}`];
        ReturnType: import("viem").RpcLog[];
    }, {
        Method: "eth_getLogs";
        Parameters: [{
            address?: `0x${string}` | `0x${string}`[] | undefined;
            topics?: import("viem").LogTopic[] | undefined;
        } & ({
            fromBlock?: `0x${string}` | import("viem").BlockTag | undefined;
            toBlock?: `0x${string}` | import("viem").BlockTag | undefined;
            blockHash?: undefined;
        } | {
            fromBlock?: undefined;
            toBlock?: undefined;
            blockHash?: `0x${string}` | undefined;
        })];
        ReturnType: import("viem").RpcLog[];
    }, {
        Method: "eth_getProof";
        Parameters: [address: `0x${string}`, storageKeys: `0x${string}`[], block: `0x${string}` | import("viem").BlockTag];
        ReturnType: import("viem").RpcProof;
    }, {
        Method: "eth_getStorageAt";
        Parameters: [address: `0x${string}`, index: `0x${string}`, block: `0x${string}` | import("viem").BlockTag | import("viem").RpcBlockIdentifier];
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_getTransactionByBlockHashAndIndex";
        Parameters: [hash: `0x${string}`, index: `0x${string}`];
        ReturnType: import("viem").RpcTransaction | null;
    }, {
        Method: "eth_getTransactionByBlockNumberAndIndex";
        Parameters: [block: `0x${string}` | import("viem").BlockTag, index: `0x${string}`];
        ReturnType: import("viem").RpcTransaction | null;
    }, {
        Method: "eth_getTransactionByHash";
        Parameters: [hash: `0x${string}`];
        ReturnType: import("viem").RpcTransaction | null;
    }, {
        Method: "eth_getTransactionCount";
        Parameters: [address: `0x${string}`, block: `0x${string}` | import("viem").BlockTag | import("viem").RpcBlockIdentifier];
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_getTransactionReceipt";
        Parameters: [hash: `0x${string}`];
        ReturnType: import("viem").RpcTransactionReceipt | null;
    }, {
        Method: "eth_getUncleByBlockHashAndIndex";
        Parameters: [hash: `0x${string}`, index: `0x${string}`];
        ReturnType: import("viem").RpcUncle | null;
    }, {
        Method: "eth_getUncleByBlockNumberAndIndex";
        Parameters: [block: `0x${string}` | import("viem").BlockTag, index: `0x${string}`];
        ReturnType: import("viem").RpcUncle | null;
    }, {
        Method: "eth_getUncleCountByBlockHash";
        Parameters: [hash: `0x${string}`];
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_getUncleCountByBlockNumber";
        Parameters: [block: `0x${string}` | import("viem").BlockTag];
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_maxPriorityFeePerGas";
        Parameters?: undefined;
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_newBlockFilter";
        Parameters?: undefined;
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_newFilter";
        Parameters: [filter: {
            fromBlock?: `0x${string}` | import("viem").BlockTag | undefined;
            toBlock?: `0x${string}` | import("viem").BlockTag | undefined;
            address?: `0x${string}` | `0x${string}`[] | undefined;
            topics?: import("viem").LogTopic[] | undefined;
        }];
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_newPendingTransactionFilter";
        Parameters?: undefined;
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_protocolVersion";
        Parameters?: undefined;
        ReturnType: string;
    }, {
        Method: "eth_sendRawTransaction";
        Parameters: [signedTransaction: `0x${string}`];
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_uninstallFilter";
        Parameters: [filterId: `0x${string}`];
        ReturnType: boolean;
    }, {
        Method: "anvil_addCompilationResult" | "ganache_addCompilationResult" | "hardhat_addCompilationResult";
        Parameters: any[];
        ReturnType: any;
    }, {
        Method: "anvil_dropTransaction" | "ganache_dropTransaction" | "hardhat_dropTransaction";
        Parameters: [hash: `0x${string}`];
        ReturnType: void;
    }, {
        Method: "anvil_dumpState" | "ganache_dumpState" | "hardhat_dumpState";
        Parameters?: undefined;
        ReturnType: `0x${string}`;
    }, {
        Method: "anvil_enableTraces" | "ganache_enableTraces" | "hardhat_enableTraces";
        Parameters?: undefined;
        ReturnType: void;
    }, {
        Method: "anvil_impersonateAccount" | "ganache_impersonateAccount" | "hardhat_impersonateAccount";
        Parameters: [address: `0x${string}`];
        ReturnType: void;
    }, {
        Method: "anvil_getAutomine" | "ganache_getAutomine" | "hardhat_getAutomine";
        Parameters?: undefined;
        ReturnType: boolean;
    }, {
        Method: "anvil_loadState" | "ganache_loadState" | "hardhat_loadState";
        Parameters?: [`0x${string}`] | undefined;
        ReturnType: void;
    }, {
        Method: "anvil_mine" | "ganache_mine" | "hardhat_mine";
        Parameters: [count: `0x${string}`, interval: `0x${string}` | undefined];
        ReturnType: void;
    }, {
        Method: "anvil_reset" | "ganache_reset" | "hardhat_reset";
        Parameters: any[];
        ReturnType: void;
    }, {
        Method: "anvil_setBalance" | "ganache_setBalance" | "hardhat_setBalance";
        Parameters: [address: `0x${string}`, balance: `0x${string}`];
        ReturnType: void;
    }, {
        Method: "anvil_setCode" | "ganache_setCode" | "hardhat_setCode";
        Parameters: [address: `0x${string}`, data: string];
        ReturnType: void;
    }, {
        Method: "anvil_setCoinbase" | "ganache_setCoinbase" | "hardhat_setCoinbase";
        Parameters: [address: `0x${string}`];
        ReturnType: void;
    }, {
        Method: "anvil_setLoggingEnabled" | "ganache_setLoggingEnabled" | "hardhat_setLoggingEnabled";
        Parameters: [enabled: boolean];
        ReturnType: void;
    }, {
        Method: "anvil_setMinGasPrice" | "ganache_setMinGasPrice" | "hardhat_setMinGasPrice";
        Parameters: [gasPrice: `0x${string}`];
        ReturnType: void;
    }, {
        Method: "anvil_setNextBlockBaseFeePerGas" | "ganache_setNextBlockBaseFeePerGas" | "hardhat_setNextBlockBaseFeePerGas";
        Parameters: [baseFeePerGas: `0x${string}`];
        ReturnType: void;
    }, {
        Method: "anvil_setNonce" | "ganache_setNonce" | "hardhat_setNonce";
        Parameters: [address: `0x${string}`, nonce: `0x${string}`];
        ReturnType: void;
    }, {
        Method: "anvil_setRpcUrl" | "ganache_setRpcUrl" | "hardhat_setRpcUrl";
        Parameters: [url: string];
        ReturnType: void;
    }, {
        Method: "anvil_setStorageAt" | "ganache_setStorageAt" | "hardhat_setStorageAt";
        Parameters: [address: `0x${string}`, index: `0x${string}`, value: `0x${string}`];
        ReturnType: void;
    }, {
        Method: "anvil_stopImpersonatingAccount" | "ganache_stopImpersonatingAccount" | "hardhat_stopImpersonatingAccount";
        Parameters: [address: `0x${string}`];
        ReturnType: void;
    }, {
        Method: "anvil_increaseTime" | "ganache_increaseTime" | "hardhat_increaseTime";
        Parameters: [seconds: number];
        ReturnType: `0x${string}`;
    }, {
        Method: "evm_setAccountBalance";
        Parameters: [address: `0x${string}`, value: `0x${string}`];
        ReturnType: void;
    }, {
        Method: "evm_setAutomine";
        Parameters: [boolean];
        ReturnType: void;
    }, {
        Method: "evm_setBlockGasLimit";
        Parameters: [gasLimit: `0x${string}`];
        ReturnType: void;
    }, {
        Method: "evm_increaseTime";
        Parameters: [seconds: `0x${string}`];
        ReturnType: `0x${string}`;
    }, {
        Method: "anvil_setBlockTimestampInterval" | "ganache_setBlockTimestampInterval" | "hardhat_setBlockTimestampInterval";
        Parameters: [seconds: number];
        ReturnType: void;
    }, {
        Method: "anvil_removeBlockTimestampInterval" | "ganache_removeBlockTimestampInterval" | "hardhat_removeBlockTimestampInterval";
        Parameters?: undefined;
        ReturnType: void;
    }, {
        Method: "evm_setIntervalMining";
        Parameters: [number];
        ReturnType: void;
    }, {
        Method: "evm_setNextBlockTimestamp";
        Parameters: [`0x${string}`];
        ReturnType: void;
    }, {
        Method: "evm_snapshot";
        Parameters?: undefined;
        ReturnType: `0x${string}`;
    }, {
        Method: "evm_revert";
        Parameters?: [id: `0x${string}`] | undefined;
        ReturnType: void;
    }, {
        Method: "miner_start";
        Parameters?: undefined;
        ReturnType: void;
    }, {
        Method: "miner_stop";
        Parameters?: undefined;
        ReturnType: void;
    }, {
        Method: "txpool_content";
        Parameters?: undefined;
        ReturnType: {
            pending: Record<`0x${string}`, Record<string, import("viem").RpcTransaction>>;
            queued: Record<`0x${string}`, Record<string, import("viem").RpcTransaction>>;
        };
    }, {
        Method: "txpool_inspect";
        Parameters?: undefined;
        ReturnType: {
            pending: Record<`0x${string}`, Record<string, string>>;
            queued: Record<`0x${string}`, Record<string, string>>;
        };
    }, {
        Method: "txpool_status";
        Parameters?: undefined;
        ReturnType: {
            pending: `0x${string}`;
            queued: `0x${string}`;
        };
    }, {
        Method: "eth_mining";
        Parameters?: undefined;
        ReturnType: boolean;
    }, {
        Method: "evm_mine";
        Parameters?: [{
            blocks: `0x${string}`;
        }] | undefined;
        ReturnType: void;
    }, {
        Method: "eth_sendUnsignedTransaction";
        Parameters: [transaction: import("viem").RpcTransactionRequest];
        ReturnType: `0x${string}`;
    }, {
        Method: "tevm_call";
        Parameters: [params: {
            data?: `0x${string}`;
            deployedBytecode?: `0x${string}`;
            value?: `0x${string}`;
            from?: `0x${string}`;
            to?: `0x${string}`;
            gasPrice?: `0x${string}`;
            gas?: `0x${string}`;
            blobVersionedHashes?: `0x${string}`[];
            blockTag?: `0x${string}` | import("@tevm/actions-types").BlockTag;
            gasRefund?: `0x${string}`;
            selfdestruct?: readonly `0x${string}`[];
            throwOnFail?: boolean;
            createTrace?: boolean;
            createAccessList?: boolean;
            createTransaction?: boolean | "on-success" | "always" | "never";
            skipBalance?: boolean;
            origin?: `0x${string}`;
            caller?: `0x${string}`;
            depth?: number;
            salt?: `0x${string}`;
        }, stateOverrideSet?: {
            [x: `0x${string}`]: {
                balance?: `0x${string}`;
                nonce?: `0x${string}`;
                code?: `0x${string}`;
                state?: {
                    [x: `0x${string}`]: `0x${string}`;
                };
                stateDiff?: {
                    [x: `0x${string}`]: `0x${string}`;
                };
            };
        } | undefined, blockOverrideSet?: {
            number?: `0x${string}`;
            time?: `0x${string}`;
            gasLimit?: `0x${string}`;
            coinbase?: `0x${string}`;
            baseFee?: `0x${string}`;
            blobBaseFee?: `0x${string}`;
        } | undefined];
        ReturnType: {
            trace?: {
                readonly failed: boolean;
                readonly gas: `0x${string}`;
                readonly returnValue: `0x${string}`;
                readonly structLogs: {
                    readonly depth: number;
                    readonly gas: `0x${string}`;
                    readonly gasCost: `0x${string}`;
                    readonly op: string;
                    readonly pc: number;
                    readonly stack: `0x${string}`[];
                    readonly error?: {
                        error: string;
                        errorType: string;
                    };
                }[];
            };
            accessList?: {
                [x: `0x${string}`]: readonly `0x${string}`[];
            };
            txHash?: `0x${string}`;
            gas?: `0x${string}`;
            executionGasUsed: `0x${string}`;
            logs?: {
                readonly address: `0x${string}`;
                readonly topics: `0x${string}`[];
                readonly data: `0x${string}`;
            }[];
            gasRefund?: `0x${string}`;
            blobGasUsed?: `0x${string}`;
            createdAddress?: `0x${string}`;
            selfdestruct?: readonly `0x${string}`[];
            createdAddresses?: readonly `0x${string}`[];
            rawData: `0x${string}`;
            errors?: never[];
        };
    }, {
        Method: "tevm_script";
        Parameters: [params: {
            value?: `0x${string}`;
            from?: `0x${string}`;
            to?: `0x${string}`;
            gasPrice?: `0x${string}`;
            gas?: `0x${string}`;
            blobVersionedHashes?: `0x${string}`[];
            blockTag?: `0x${string}` | import("@tevm/actions-types").BlockTag;
            gasRefund?: `0x${string}`;
            selfdestruct?: readonly `0x${string}`[];
            throwOnFail?: boolean;
            createTrace?: boolean;
            createAccessList?: boolean;
            createTransaction?: boolean | "on-success" | "always" | "never";
            skipBalance?: boolean;
            origin?: `0x${string}`;
            caller?: `0x${string}`;
            depth?: number;
        } & {
            data: `0x${string}`;
            deployedBytecode: `0x${string}`;
        }, stateOverrideSet?: {
            [x: `0x${string}`]: {
                balance?: `0x${string}`;
                nonce?: `0x${string}`;
                code?: `0x${string}`;
                state?: {
                    [x: `0x${string}`]: `0x${string}`;
                };
                stateDiff?: {
                    [x: `0x${string}`]: `0x${string}`;
                };
            };
        } | undefined, blockOverrideSet?: {
            number?: `0x${string}`;
            time?: `0x${string}`;
            gasLimit?: `0x${string}`;
            coinbase?: `0x${string}`;
            baseFee?: `0x${string}`;
            blobBaseFee?: `0x${string}`;
        } | undefined];
        ReturnType: {
            trace?: {
                readonly failed: boolean;
                readonly gas: `0x${string}`;
                readonly returnValue: `0x${string}`;
                readonly structLogs: {
                    readonly depth: number;
                    readonly gas: `0x${string}`;
                    readonly gasCost: `0x${string}`;
                    readonly op: string;
                    readonly pc: number;
                    readonly stack: `0x${string}`[];
                    readonly error?: {
                        error: string;
                        errorType: string;
                    };
                }[];
            };
            accessList?: {
                [x: `0x${string}`]: readonly `0x${string}`[];
            };
            txHash?: `0x${string}`;
            gas?: `0x${string}`;
            executionGasUsed: `0x${string}`;
            logs?: {
                readonly address: `0x${string}`;
                readonly topics: `0x${string}`[];
                readonly data: `0x${string}`;
            }[];
            gasRefund?: `0x${string}`;
            blobGasUsed?: `0x${string}`;
            createdAddress?: `0x${string}`;
            selfdestruct?: readonly `0x${string}`[];
            createdAddresses?: readonly `0x${string}`[];
            rawData: `0x${string}`;
            errors?: never[];
        };
    }, {
        Method: "tevm_dumpState";
        Parameters?: [] | undefined;
        ReturnType: import("@tevm/actions-types").DumpStateResult<never>;
    }, {
        Method: "tevm_loadState";
        Parameters: [import("@tevm/procedures-types").SerializedParams];
        ReturnType: {
            errors?: never[];
        };
    }, {
        Method: "tevm_getAccount";
        Parameters: [{
            throwOnFail?: boolean;
            address: `0x${string}`;
            returnStorage?: boolean;
        }];
        ReturnType: {
            errors?: never[];
            address: `0x${string}`;
            nonce: `0x${string}`;
            balance: `0x${string}`;
            deployedBytecode: `0x${string}`;
            storageRoot: `0x${string}`;
            codeHash: `0x${string}`;
            isContract: boolean;
            isEmpty: boolean;
            storage?: {
                [x: `0x${string}`]: `0x${string}`;
            };
        };
    }, {
        Method: "tevm_setAccount";
        Parameters: [{
            throwOnFail?: boolean;
            address: `0x${string}`;
            nonce?: `0x${string}`;
            balance?: `0x${string}`;
            deployedBytecode?: `0x${string}`;
            storageRoot?: `0x${string}`;
            state?: {
                [x: `0x${string}`]: `0x${string}`;
            };
            stateDiff?: {
                [x: `0x${string}`]: `0x${string}`;
            };
        }];
        ReturnType: {
            errors?: never[];
        };
    }]>;
    transport: import("viem").TransportConfig<string, import("viem").EIP1193RequestFn> & Record<string, any>;
    type: string;
    uid: string;
    call: (parameters: import("viem").CallParameters<import("viem").Chain | undefined>) => Promise<import("viem").CallReturnType>;
    createBlockFilter: () => Promise<{
        id: `0x${string}`;
        request: import("viem").EIP1193RequestFn<readonly [{
            Method: "eth_getFilterChanges";
            Parameters: [filterId: `0x${string}`];
            ReturnType: `0x${string}`[] | import("viem").RpcLog[];
        }, {
            Method: "eth_getFilterLogs";
            Parameters: [filterId: `0x${string}`];
            ReturnType: import("viem").RpcLog[];
        }, {
            Method: "eth_uninstallFilter";
            Parameters: [filterId: `0x${string}`];
            ReturnType: boolean;
        }]>;
        type: "block";
    }>;
    createContractEventFilter: <const TAbi extends import("viem").Abi | readonly unknown[], TEventName extends import("viem").ContractEventName<TAbi> | undefined, TArgs extends import("viem").MaybeExtractEventArgsFromAbi<TAbi, TEventName> | undefined, TStrict extends boolean | undefined = undefined, TFromBlock extends bigint | import("viem").BlockTag | undefined = undefined, TToBlock extends bigint | import("viem").BlockTag | undefined = undefined>(args: import("viem").CreateContractEventFilterParameters<TAbi, TEventName, TArgs, TStrict, TFromBlock, TToBlock>) => Promise<import("viem").CreateContractEventFilterReturnType<TAbi, TEventName, TArgs, TStrict, TFromBlock, TToBlock>>;
    createEventFilter: <const TAbiEvent extends import("viem").AbiEvent | undefined = undefined, const TAbiEvents extends readonly unknown[] | readonly import("viem").AbiEvent[] | undefined = TAbiEvent extends import("viem").AbiEvent ? [TAbiEvent] : undefined, TStrict_1 extends boolean | undefined = undefined, TFromBlock_1 extends bigint | import("viem").BlockTag | undefined = undefined, TToBlock_1 extends bigint | import("viem").BlockTag | undefined = undefined, _EventName extends string | undefined = import("viem").MaybeAbiEventName<TAbiEvent>, _Args extends import("viem").MaybeExtractEventArgsFromAbi<TAbiEvents, _EventName> | undefined = undefined>(args?: import("viem").CreateEventFilterParameters<TAbiEvent, TAbiEvents, TStrict_1, TFromBlock_1, TToBlock_1, _EventName, _Args> | undefined) => Promise<import("viem").Filter<"event", TAbiEvents, _EventName, _Args, TStrict_1, TFromBlock_1, TToBlock_1> extends infer T ? { [K in keyof T]: import("viem").Filter<"event", TAbiEvents, _EventName, _Args, TStrict_1, TFromBlock_1, TToBlock_1>[K]; } : never>;
    createPendingTransactionFilter: () => Promise<{
        id: `0x${string}`;
        request: import("viem").EIP1193RequestFn<readonly [{
            Method: "eth_getFilterChanges";
            Parameters: [filterId: `0x${string}`];
            ReturnType: `0x${string}`[] | import("viem").RpcLog[];
        }, {
            Method: "eth_getFilterLogs";
            Parameters: [filterId: `0x${string}`];
            ReturnType: import("viem").RpcLog[];
        }, {
            Method: "eth_uninstallFilter";
            Parameters: [filterId: `0x${string}`];
            ReturnType: boolean;
        }]>;
        type: "transaction";
    }>;
    estimateContractGas: <TChain extends import("viem").Chain | undefined, const abi extends import("viem").Abi | readonly unknown[], functionName extends import("viem").ContractFunctionName<abi, "nonpayable" | "payable">, args extends import("viem").ContractFunctionArgs<abi, "nonpayable" | "payable", functionName>>(args: import("viem").EstimateContractGasParameters<abi, functionName, args, TChain>) => Promise<bigint>;
    estimateGas: (args: import("viem").EstimateGasParameters<import("viem").Chain | undefined>) => Promise<bigint>;
    getBalance: (args: import("viem").GetBalanceParameters) => Promise<bigint>;
    getBlobBaseFee: () => Promise<bigint>;
    getBlock: <TIncludeTransactions extends boolean = false, TBlockTag extends import("viem").BlockTag = "latest">(args?: import("viem").GetBlockParameters<TIncludeTransactions, TBlockTag> | undefined) => Promise<{
        number: TBlockTag extends "pending" ? null : bigint;
        gasLimit: bigint;
        extraData: `0x${string}`;
        timestamp: bigint;
        nonce: TBlockTag extends "pending" ? null : `0x${string}`;
        stateRoot: `0x${string}`;
        hash: TBlockTag extends "pending" ? null : `0x${string}`;
        blobGasUsed: bigint;
        logsBloom: TBlockTag extends "pending" ? null : `0x${string}`;
        baseFeePerGas: bigint | null;
        difficulty: bigint;
        excessBlobGas: bigint;
        gasUsed: bigint;
        miner: `0x${string}`;
        mixHash: `0x${string}`;
        parentHash: `0x${string}`;
        receiptsRoot: `0x${string}`;
        sealFields: `0x${string}`[];
        sha3Uncles: `0x${string}`;
        size: bigint;
        totalDifficulty: bigint | null;
        transactionsRoot: `0x${string}`;
        uncles: `0x${string}`[];
        withdrawals?: import("viem").Withdrawal[] | undefined;
        withdrawalsRoot?: `0x${string}` | undefined;
        transactions: TIncludeTransactions extends true ? ({
            value: bigint;
            from: `0x${string}`;
            to: `0x${string}` | null;
            nonce: number;
            gasPrice: bigint;
            hash: `0x${string}`;
            chainId?: number | undefined;
            type: "legacy";
            yParity?: undefined;
            gas: bigint;
            input: `0x${string}`;
            r: `0x${string}`;
            s: `0x${string}`;
            typeHex: `0x${string}` | null;
            v: bigint;
            maxFeePerBlobGas?: undefined;
            maxFeePerGas?: undefined;
            maxPriorityFeePerGas?: undefined;
            accessList?: undefined;
            blobVersionedHashes?: undefined;
            blockHash: (TBlockTag extends "pending" ? true : false) extends infer T_1 ? T_1 extends (TBlockTag extends "pending" ? true : false) ? T_1 extends true ? null : `0x${string}` : never : never;
            blockNumber: (TBlockTag extends "pending" ? true : false) extends infer T_2 ? T_2 extends (TBlockTag extends "pending" ? true : false) ? T_2 extends true ? null : bigint : never : never;
            transactionIndex: (TBlockTag extends "pending" ? true : false) extends infer T_3 ? T_3 extends (TBlockTag extends "pending" ? true : false) ? T_3 extends true ? null : number : never : never;
        } | {
            value: bigint;
            from: `0x${string}`;
            to: `0x${string}` | null;
            nonce: number;
            gasPrice: bigint;
            hash: `0x${string}`;
            chainId: number;
            type: "eip2930";
            yParity: number;
            gas: bigint;
            input: `0x${string}`;
            r: `0x${string}`;
            s: `0x${string}`;
            typeHex: `0x${string}` | null;
            v: bigint;
            maxFeePerBlobGas?: undefined;
            maxFeePerGas?: undefined;
            maxPriorityFeePerGas?: undefined;
            accessList: import("viem").AccessList;
            blobVersionedHashes?: undefined;
            blockHash: (TBlockTag extends "pending" ? true : false) extends infer T_4 ? T_4 extends (TBlockTag extends "pending" ? true : false) ? T_4 extends true ? null : `0x${string}` : never : never;
            blockNumber: (TBlockTag extends "pending" ? true : false) extends infer T_5 ? T_5 extends (TBlockTag extends "pending" ? true : false) ? T_5 extends true ? null : bigint : never : never;
            transactionIndex: (TBlockTag extends "pending" ? true : false) extends infer T_6 ? T_6 extends (TBlockTag extends "pending" ? true : false) ? T_6 extends true ? null : number : never : never;
        } | {
            value: bigint;
            from: `0x${string}`;
            to: `0x${string}` | null;
            nonce: number;
            gasPrice?: undefined;
            hash: `0x${string}`;
            chainId: number;
            type: "eip1559";
            yParity: number;
            gas: bigint;
            input: `0x${string}`;
            r: `0x${string}`;
            s: `0x${string}`;
            typeHex: `0x${string}` | null;
            v: bigint;
            maxFeePerBlobGas?: undefined;
            maxFeePerGas: bigint;
            maxPriorityFeePerGas: bigint;
            accessList: import("viem").AccessList;
            blobVersionedHashes?: undefined;
            blockHash: (TBlockTag extends "pending" ? true : false) extends infer T_7 ? T_7 extends (TBlockTag extends "pending" ? true : false) ? T_7 extends true ? null : `0x${string}` : never : never;
            blockNumber: (TBlockTag extends "pending" ? true : false) extends infer T_8 ? T_8 extends (TBlockTag extends "pending" ? true : false) ? T_8 extends true ? null : bigint : never : never;
            transactionIndex: (TBlockTag extends "pending" ? true : false) extends infer T_9 ? T_9 extends (TBlockTag extends "pending" ? true : false) ? T_9 extends true ? null : number : never : never;
        } | {
            value: bigint;
            from: `0x${string}`;
            to: `0x${string}` | null;
            nonce: number;
            gasPrice?: undefined;
            hash: `0x${string}`;
            chainId: number;
            type: "eip4844";
            yParity: number;
            gas: bigint;
            input: `0x${string}`;
            r: `0x${string}`;
            s: `0x${string}`;
            typeHex: `0x${string}` | null;
            v: bigint;
            maxFeePerBlobGas: bigint;
            maxFeePerGas: bigint;
            maxPriorityFeePerGas: bigint;
            accessList: import("viem").AccessList;
            blobVersionedHashes: readonly `0x${string}`[];
            blockHash: (TBlockTag extends "pending" ? true : false) extends infer T_10 ? T_10 extends (TBlockTag extends "pending" ? true : false) ? T_10 extends true ? null : `0x${string}` : never : never;
            blockNumber: (TBlockTag extends "pending" ? true : false) extends infer T_11 ? T_11 extends (TBlockTag extends "pending" ? true : false) ? T_11 extends true ? null : bigint : never : never;
            transactionIndex: (TBlockTag extends "pending" ? true : false) extends infer T_12 ? T_12 extends (TBlockTag extends "pending" ? true : false) ? T_12 extends true ? null : number : never : never;
        })[] : `0x${string}`[];
    }>;
    getBlockNumber: (args?: import("viem").GetBlockNumberParameters | undefined) => Promise<bigint>;
    getBlockTransactionCount: (args?: import("viem").GetBlockTransactionCountParameters | undefined) => Promise<number>;
    getBytecode: (args: import("viem").GetBytecodeParameters) => Promise<import("viem").GetBytecodeReturnType>;
    getChainId: () => Promise<number>;
    getContractEvents: <const abi_1 extends import("viem").Abi | readonly unknown[], eventName extends import("viem").ContractEventName<abi_1> | undefined = undefined, strict extends boolean | undefined = undefined, fromBlock extends bigint | import("viem").BlockTag | undefined = undefined, toBlock extends bigint | import("viem").BlockTag | undefined = undefined>(args: import("viem").GetContractEventsParameters<abi_1, eventName, strict, fromBlock, toBlock>) => Promise<import("viem").GetContractEventsReturnType<abi_1, eventName, strict, fromBlock, toBlock>>;
    getEnsAddress: (args: {
        blockNumber?: bigint | undefined;
        blockTag?: import("viem").BlockTag | undefined;
        coinType?: number | undefined;
        gatewayUrls?: string[] | undefined;
        name: string;
        strict?: boolean | undefined;
        universalResolverAddress?: `0x${string}` | undefined;
    }) => Promise<import("viem").GetEnsAddressReturnType>;
    getEnsAvatar: (args: {
        name: string;
        blockNumber?: bigint | undefined;
        blockTag?: import("viem").BlockTag | undefined;
        gatewayUrls?: string[] | undefined;
        strict?: boolean | undefined;
        universalResolverAddress?: `0x${string}` | undefined;
        assetGatewayUrls?: import("viem").AssetGatewayUrls | undefined;
    }) => Promise<import("viem").GetEnsAvatarReturnType>;
    getEnsName: (args: {
        blockNumber?: bigint | undefined;
        blockTag?: import("viem").BlockTag | undefined;
        address: `0x${string}`;
        gatewayUrls?: string[] | undefined;
        strict?: boolean | undefined;
        universalResolverAddress?: `0x${string}` | undefined;
    }) => Promise<import("viem").GetEnsNameReturnType>;
    getEnsResolver: (args: {
        blockNumber?: bigint | undefined;
        blockTag?: import("viem").BlockTag | undefined;
        name: string;
        universalResolverAddress?: `0x${string}` | undefined;
    }) => Promise<`0x${string}`>;
    getEnsText: (args: {
        blockNumber?: bigint | undefined;
        blockTag?: import("viem").BlockTag | undefined;
        name: string;
        gatewayUrls?: string[] | undefined;
        key: string;
        strict?: boolean | undefined;
        universalResolverAddress?: `0x${string}` | undefined;
    }) => Promise<import("viem").GetEnsTextReturnType>;
    getFeeHistory: (args: import("viem").GetFeeHistoryParameters) => Promise<import("viem").GetFeeHistoryReturnType>;
    estimateFeesPerGas: <TChainOverride extends import("viem").Chain | undefined = undefined, TType extends import("viem").FeeValuesType = "eip1559">(args?: import("viem").EstimateFeesPerGasParameters<import("viem").Chain | undefined, TChainOverride, TType> | undefined) => Promise<import("viem").EstimateFeesPerGasReturnType>;
    getFilterChanges: <TFilterType extends import("viem").FilterType, const TAbi_1 extends import("viem").Abi | readonly unknown[] | undefined, TEventName_1 extends string | undefined, TStrict_2 extends boolean | undefined = undefined, TFromBlock_2 extends bigint | import("viem").BlockTag | undefined = undefined, TToBlock_2 extends bigint | import("viem").BlockTag | undefined = undefined>(args: import("viem").GetFilterChangesParameters<TFilterType, TAbi_1, TEventName_1, TStrict_2, TFromBlock_2, TToBlock_2>) => Promise<import("viem").GetFilterChangesReturnType<TFilterType, TAbi_1, TEventName_1, TStrict_2, TFromBlock_2, TToBlock_2>>;
    getFilterLogs: <const TAbi_2 extends import("viem").Abi | readonly unknown[] | undefined, TEventName_2 extends string | undefined, TStrict_3 extends boolean | undefined = undefined, TFromBlock_3 extends bigint | import("viem").BlockTag | undefined = undefined, TToBlock_3 extends bigint | import("viem").BlockTag | undefined = undefined>(args: import("viem").GetFilterLogsParameters<TAbi_2, TEventName_2, TStrict_3, TFromBlock_3, TToBlock_3>) => Promise<import("viem").GetFilterLogsReturnType<TAbi_2, TEventName_2, TStrict_3, TFromBlock_3, TToBlock_3>>;
    getGasPrice: () => Promise<bigint>;
    getLogs: <const TAbiEvent_1 extends import("viem").AbiEvent | undefined = undefined, const TAbiEvents_1 extends readonly unknown[] | readonly import("viem").AbiEvent[] | undefined = TAbiEvent_1 extends import("viem").AbiEvent ? [TAbiEvent_1] : undefined, TStrict_4 extends boolean | undefined = undefined, TFromBlock_4 extends bigint | import("viem").BlockTag | undefined = undefined, TToBlock_4 extends bigint | import("viem").BlockTag | undefined = undefined>(args?: import("viem").GetLogsParameters<TAbiEvent_1, TAbiEvents_1, TStrict_4, TFromBlock_4, TToBlock_4> | undefined) => Promise<import("viem").GetLogsReturnType<TAbiEvent_1, TAbiEvents_1, TStrict_4, TFromBlock_4, TToBlock_4>>;
    getProof: (args: import("viem").GetProofParameters) => Promise<import("viem").GetProofReturnType>;
    estimateMaxPriorityFeePerGas: <TChainOverride_1 extends import("viem").Chain | undefined = undefined>(args?: {
        chain: TChainOverride_1 | null;
    } | undefined) => Promise<bigint>;
    getStorageAt: (args: import("viem").GetStorageAtParameters) => Promise<import("viem").GetStorageAtReturnType>;
    getTransaction: <TBlockTag_1 extends import("viem").BlockTag = "latest">(args: import("viem").GetTransactionParameters<TBlockTag_1>) => Promise<{
        value: bigint;
        from: `0x${string}`;
        to: `0x${string}` | null;
        nonce: number;
        gasPrice: bigint;
        hash: `0x${string}`;
        chainId?: number | undefined;
        type: "legacy";
        yParity?: undefined;
        gas: bigint;
        input: `0x${string}`;
        r: `0x${string}`;
        s: `0x${string}`;
        typeHex: `0x${string}` | null;
        v: bigint;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: undefined;
        maxPriorityFeePerGas?: undefined;
        accessList?: undefined;
        blobVersionedHashes?: undefined;
        blockHash: (TBlockTag_1 extends "pending" ? true : false) extends infer T_13 ? T_13 extends (TBlockTag_1 extends "pending" ? true : false) ? T_13 extends true ? null : `0x${string}` : never : never;
        blockNumber: (TBlockTag_1 extends "pending" ? true : false) extends infer T_14 ? T_14 extends (TBlockTag_1 extends "pending" ? true : false) ? T_14 extends true ? null : bigint : never : never;
        transactionIndex: (TBlockTag_1 extends "pending" ? true : false) extends infer T_15 ? T_15 extends (TBlockTag_1 extends "pending" ? true : false) ? T_15 extends true ? null : number : never : never;
    } | {
        value: bigint;
        from: `0x${string}`;
        to: `0x${string}` | null;
        nonce: number;
        gasPrice: bigint;
        hash: `0x${string}`;
        chainId: number;
        type: "eip2930";
        yParity: number;
        gas: bigint;
        input: `0x${string}`;
        r: `0x${string}`;
        s: `0x${string}`;
        typeHex: `0x${string}` | null;
        v: bigint;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: undefined;
        maxPriorityFeePerGas?: undefined;
        accessList: import("viem").AccessList;
        blobVersionedHashes?: undefined;
        blockHash: (TBlockTag_1 extends "pending" ? true : false) extends infer T_16 ? T_16 extends (TBlockTag_1 extends "pending" ? true : false) ? T_16 extends true ? null : `0x${string}` : never : never;
        blockNumber: (TBlockTag_1 extends "pending" ? true : false) extends infer T_17 ? T_17 extends (TBlockTag_1 extends "pending" ? true : false) ? T_17 extends true ? null : bigint : never : never;
        transactionIndex: (TBlockTag_1 extends "pending" ? true : false) extends infer T_18 ? T_18 extends (TBlockTag_1 extends "pending" ? true : false) ? T_18 extends true ? null : number : never : never;
    } | {
        value: bigint;
        from: `0x${string}`;
        to: `0x${string}` | null;
        nonce: number;
        gasPrice?: undefined;
        hash: `0x${string}`;
        chainId: number;
        type: "eip1559";
        yParity: number;
        gas: bigint;
        input: `0x${string}`;
        r: `0x${string}`;
        s: `0x${string}`;
        typeHex: `0x${string}` | null;
        v: bigint;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas: bigint;
        maxPriorityFeePerGas: bigint;
        accessList: import("viem").AccessList;
        blobVersionedHashes?: undefined;
        blockHash: (TBlockTag_1 extends "pending" ? true : false) extends infer T_19 ? T_19 extends (TBlockTag_1 extends "pending" ? true : false) ? T_19 extends true ? null : `0x${string}` : never : never;
        blockNumber: (TBlockTag_1 extends "pending" ? true : false) extends infer T_20 ? T_20 extends (TBlockTag_1 extends "pending" ? true : false) ? T_20 extends true ? null : bigint : never : never;
        transactionIndex: (TBlockTag_1 extends "pending" ? true : false) extends infer T_21 ? T_21 extends (TBlockTag_1 extends "pending" ? true : false) ? T_21 extends true ? null : number : never : never;
    } | {
        value: bigint;
        from: `0x${string}`;
        to: `0x${string}` | null;
        nonce: number;
        gasPrice?: undefined;
        hash: `0x${string}`;
        chainId: number;
        type: "eip4844";
        yParity: number;
        gas: bigint;
        input: `0x${string}`;
        r: `0x${string}`;
        s: `0x${string}`;
        typeHex: `0x${string}` | null;
        v: bigint;
        maxFeePerBlobGas: bigint;
        maxFeePerGas: bigint;
        maxPriorityFeePerGas: bigint;
        accessList: import("viem").AccessList;
        blobVersionedHashes: readonly `0x${string}`[];
        blockHash: (TBlockTag_1 extends "pending" ? true : false) extends infer T_22 ? T_22 extends (TBlockTag_1 extends "pending" ? true : false) ? T_22 extends true ? null : `0x${string}` : never : never;
        blockNumber: (TBlockTag_1 extends "pending" ? true : false) extends infer T_23 ? T_23 extends (TBlockTag_1 extends "pending" ? true : false) ? T_23 extends true ? null : bigint : never : never;
        transactionIndex: (TBlockTag_1 extends "pending" ? true : false) extends infer T_24 ? T_24 extends (TBlockTag_1 extends "pending" ? true : false) ? T_24 extends true ? null : number : never : never;
    }>;
    getTransactionConfirmations: (args: import("viem").GetTransactionConfirmationsParameters<import("viem").Chain | undefined>) => Promise<bigint>;
    getTransactionCount: (args: import("viem").GetTransactionCountParameters) => Promise<number>;
    getTransactionReceipt: (args: import("viem").GetTransactionReceiptParameters) => Promise<import("viem").TransactionReceipt>;
    multicall: <const contracts extends readonly unknown[], allowFailure extends boolean = true>(args: import("viem").MulticallParameters<contracts, allowFailure>) => Promise<import("viem").MulticallReturnType<contracts, allowFailure>>;
    prepareTransactionRequest: <const TRequest extends import("viem").PrepareTransactionRequestRequest<import("viem").Chain | undefined, TChainOverride_2>, TChainOverride_2 extends import("viem").Chain | undefined = undefined, TAccountOverride extends `0x${string}` | import("viem").Account | undefined = undefined>(args: import("viem").PrepareTransactionRequestParameters<import("viem").Chain | undefined, import("viem").Account | undefined, TChainOverride_2, TAccountOverride, TRequest>) => Promise<import("viem").UnionRequiredBy<Extract<import("viem").UnionOmit<import("viem").ExtractChainFormatterParameters<import("viem").DeriveChain<import("viem").Chain, TChainOverride_2>, "transactionRequest", import("viem").TransactionRequest>, "from"> & (import("viem").DeriveChain<import("viem").Chain, TChainOverride_2> extends infer T_37 ? T_37 extends import("viem").DeriveChain<import("viem").Chain, TChainOverride_2> ? T_37 extends import("viem").Chain ? {
        chain: T_37;
    } : {
        chain?: undefined;
    } : never : never) & (import("viem").DeriveAccount<import("viem").Account | undefined, TAccountOverride> extends infer T_38 ? T_38 extends import("viem").DeriveAccount<import("viem").Account | undefined, TAccountOverride> ? T_38 extends import("viem").Account ? {
        account: T_38;
        from: `0x${string}`;
    } : {
        account?: undefined;
        from?: undefined;
    } : never : never), import("viem").IsNever<((TRequest["type"] extends string | undefined ? TRequest["type"] : import("viem").GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, TRequest> | import("viem").Opaque<import("viem").TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, TRequest> | import("viem").Opaque<import("viem").TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)>) extends infer T_39 ? T_39 extends (TRequest["type"] extends string | undefined ? TRequest["type"] : import("viem").GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, TRequest> | import("viem").Opaque<import("viem").TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, TRequest> | import("viem").Opaque<import("viem").TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)>) ? T_39 extends "legacy" ? import("viem").TransactionRequestLegacy : never : never : never) | ((TRequest["type"] extends string | undefined ? TRequest["type"] : import("viem").GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, TRequest> | import("viem").Opaque<import("viem").TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, TRequest> | import("viem").Opaque<import("viem").TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)>) extends infer T_40 ? T_40 extends (TRequest["type"] extends string | undefined ? TRequest["type"] : import("viem").GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, TRequest> | import("viem").Opaque<import("viem").TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, TRequest> | import("viem").Opaque<import("viem").TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)>) ? T_40 extends "eip1559" ? import("viem").TransactionRequestEIP1559 : never : never : never) | ((TRequest["type"] extends string | undefined ? TRequest["type"] : import("viem").GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, TRequest> | import("viem").Opaque<import("viem").TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, TRequest> | import("viem").Opaque<import("viem").TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)>) extends infer T_41 ? T_41 extends (TRequest["type"] extends string | undefined ? TRequest["type"] : import("viem").GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, TRequest> | import("viem").Opaque<import("viem").TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, TRequest> | import("viem").Opaque<import("viem").TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)>) ? T_41 extends "eip2930" ? import("viem").TransactionRequestEIP2930 : never : never : never) | ((TRequest["type"] extends string | undefined ? TRequest["type"] : import("viem").GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, TRequest> | import("viem").Opaque<import("viem").TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, TRequest> | import("viem").Opaque<import("viem").TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)>) extends infer T_42 ? T_42 extends (TRequest["type"] extends string | undefined ? TRequest["type"] : import("viem").GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, TRequest> | import("viem").Opaque<import("viem").TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, TRequest> | import("viem").Opaque<import("viem").TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)>) ? T_42 extends "eip4844" ? import("viem").TransactionRequestEIP4844 : never : never : never)> extends true ? unknown : import("viem").ExactPartial<((TRequest["type"] extends string | undefined ? TRequest["type"] : import("viem").GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, TRequest> | import("viem").Opaque<import("viem").TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, TRequest> | import("viem").Opaque<import("viem").TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)>) extends infer T_43 ? T_43 extends (TRequest["type"] extends string | undefined ? TRequest["type"] : import("viem").GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, TRequest> | import("viem").Opaque<import("viem").TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, TRequest> | import("viem").Opaque<import("viem").TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)>) ? T_43 extends "legacy" ? import("viem").TransactionRequestLegacy : never : never : never) | ((TRequest["type"] extends string | undefined ? TRequest["type"] : import("viem").GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, TRequest> | import("viem").Opaque<import("viem").TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, TRequest> | import("viem").Opaque<import("viem").TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)>) extends infer T_44 ? T_44 extends (TRequest["type"] extends string | undefined ? TRequest["type"] : import("viem").GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, TRequest> | import("viem").Opaque<import("viem").TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, TRequest> | import("viem").Opaque<import("viem").TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)>) ? T_44 extends "eip1559" ? import("viem").TransactionRequestEIP1559 : never : never : never) | ((TRequest["type"] extends string | undefined ? TRequest["type"] : import("viem").GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, TRequest> | import("viem").Opaque<import("viem").TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, TRequest> | import("viem").Opaque<import("viem").TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)>) extends infer T_45 ? T_45 extends (TRequest["type"] extends string | undefined ? TRequest["type"] : import("viem").GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, TRequest> | import("viem").Opaque<import("viem").TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, TRequest> | import("viem").Opaque<import("viem").TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)>) ? T_45 extends "eip2930" ? import("viem").TransactionRequestEIP2930 : never : never : never) | ((TRequest["type"] extends string | undefined ? TRequest["type"] : import("viem").GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, TRequest> | import("viem").Opaque<import("viem").TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, TRequest> | import("viem").Opaque<import("viem").TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)>) extends infer T_46 ? T_46 extends (TRequest["type"] extends string | undefined ? TRequest["type"] : import("viem").GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, TRequest> | import("viem").Opaque<import("viem").TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, TRequest> | import("viem").Opaque<import("viem").TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)>) ? T_46 extends "eip4844" ? import("viem").TransactionRequestEIP4844 : never : never : never)>> & {
        chainId?: number | undefined;
    }, (TRequest["parameters"] extends readonly import("viem").PrepareTransactionRequestParameterType[] ? TRequest["parameters"][number] : "nonce" | "chainId" | "type" | "gas" | "blobVersionedHashes" | "fees") extends infer T_47 ? T_47 extends (TRequest["parameters"] extends readonly import("viem").PrepareTransactionRequestParameterType[] ? TRequest["parameters"][number] : "nonce" | "chainId" | "type" | "gas" | "blobVersionedHashes" | "fees") ? T_47 extends "fees" ? "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" : T_47 : never : never> & (unknown extends TRequest["kzg"] ? {} : Pick<TRequest, "kzg">) extends infer T_25 ? { [K_1 in keyof T_25]: (import("viem").UnionRequiredBy<Extract<import("viem").UnionOmit<import("viem").ExtractChainFormatterParameters<import("viem").DeriveChain<import("viem").Chain, TChainOverride_2>, "transactionRequest", import("viem").TransactionRequest>, "from"> & (import("viem").DeriveChain<import("viem").Chain, TChainOverride_2> extends infer T_26 ? T_26 extends import("viem").DeriveChain<import("viem").Chain, TChainOverride_2> ? T_26 extends import("viem").Chain ? {
        chain: T_26;
    } : {
        chain?: undefined;
    } : never : never) & (import("viem").DeriveAccount<import("viem").Account | undefined, TAccountOverride> extends infer T_27 ? T_27 extends import("viem").DeriveAccount<import("viem").Account | undefined, TAccountOverride> ? T_27 extends import("viem").Account ? {
        account: T_27;
        from: `0x${string}`;
    } : {
        account?: undefined;
        from?: undefined;
    } : never : never), import("viem").IsNever<((TRequest["type"] extends string | undefined ? TRequest["type"] : import("viem").GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, TRequest> | import("viem").Opaque<import("viem").TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, TRequest> | import("viem").Opaque<import("viem").TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)>) extends infer T_28 ? T_28 extends (TRequest["type"] extends string | undefined ? TRequest["type"] : import("viem").GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, TRequest> | import("viem").Opaque<import("viem").TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, TRequest> | import("viem").Opaque<import("viem").TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)>) ? T_28 extends "legacy" ? import("viem").TransactionRequestLegacy : never : never : never) | ((TRequest["type"] extends string | undefined ? TRequest["type"] : import("viem").GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, TRequest> | import("viem").Opaque<import("viem").TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, TRequest> | import("viem").Opaque<import("viem").TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)>) extends infer T_29 ? T_29 extends (TRequest["type"] extends string | undefined ? TRequest["type"] : import("viem").GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, TRequest> | import("viem").Opaque<import("viem").TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, TRequest> | import("viem").Opaque<import("viem").TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)>) ? T_29 extends "eip1559" ? import("viem").TransactionRequestEIP1559 : never : never : never) | ((TRequest["type"] extends string | undefined ? TRequest["type"] : import("viem").GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, TRequest> | import("viem").Opaque<import("viem").TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, TRequest> | import("viem").Opaque<import("viem").TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)>) extends infer T_30 ? T_30 extends (TRequest["type"] extends string | undefined ? TRequest["type"] : import("viem").GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, TRequest> | import("viem").Opaque<import("viem").TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, TRequest> | import("viem").Opaque<import("viem").TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)>) ? T_30 extends "eip2930" ? import("viem").TransactionRequestEIP2930 : never : never : never) | ((TRequest["type"] extends string | undefined ? TRequest["type"] : import("viem").GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, TRequest> | import("viem").Opaque<import("viem").TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, TRequest> | import("viem").Opaque<import("viem").TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)>) extends infer T_31 ? T_31 extends (TRequest["type"] extends string | undefined ? TRequest["type"] : import("viem").GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, TRequest> | import("viem").Opaque<import("viem").TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, TRequest> | import("viem").Opaque<import("viem").TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)>) ? T_31 extends "eip4844" ? import("viem").TransactionRequestEIP4844 : never : never : never)> extends true ? unknown : import("viem").ExactPartial<((TRequest["type"] extends string | undefined ? TRequest["type"] : import("viem").GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, TRequest> | import("viem").Opaque<import("viem").TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, TRequest> | import("viem").Opaque<import("viem").TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)>) extends infer T_32 ? T_32 extends (TRequest["type"] extends string | undefined ? TRequest["type"] : import("viem").GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, TRequest> | import("viem").Opaque<import("viem").TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, TRequest> | import("viem").Opaque<import("viem").TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)>) ? T_32 extends "legacy" ? import("viem").TransactionRequestLegacy : never : never : never) | ((TRequest["type"] extends string | undefined ? TRequest["type"] : import("viem").GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, TRequest> | import("viem").Opaque<import("viem").TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, TRequest> | import("viem").Opaque<import("viem").TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)>) extends infer T_33 ? T_33 extends (TRequest["type"] extends string | undefined ? TRequest["type"] : import("viem").GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, TRequest> | import("viem").Opaque<import("viem").TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, TRequest> | import("viem").Opaque<import("viem").TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)>) ? T_33 extends "eip1559" ? import("viem").TransactionRequestEIP1559 : never : never : never) | ((TRequest["type"] extends string | undefined ? TRequest["type"] : import("viem").GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, TRequest> | import("viem").Opaque<import("viem").TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, TRequest> | import("viem").Opaque<import("viem").TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)>) extends infer T_34 ? T_34 extends (TRequest["type"] extends string | undefined ? TRequest["type"] : import("viem").GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, TRequest> | import("viem").Opaque<import("viem").TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, TRequest> | import("viem").Opaque<import("viem").TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)>) ? T_34 extends "eip2930" ? import("viem").TransactionRequestEIP2930 : never : never : never) | ((TRequest["type"] extends string | undefined ? TRequest["type"] : import("viem").GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, TRequest> | import("viem").Opaque<import("viem").TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, TRequest> | import("viem").Opaque<import("viem").TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)>) extends infer T_35 ? T_35 extends (TRequest["type"] extends string | undefined ? TRequest["type"] : import("viem").GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, TRequest> | import("viem").Opaque<import("viem").TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, TRequest> | import("viem").Opaque<import("viem").TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)>) ? T_35 extends "eip4844" ? import("viem").TransactionRequestEIP4844 : never : never : never)>> & {
        chainId?: number | undefined;
    }, (TRequest["parameters"] extends readonly import("viem").PrepareTransactionRequestParameterType[] ? TRequest["parameters"][number] : "nonce" | "chainId" | "type" | "gas" | "blobVersionedHashes" | "fees") extends infer T_36 ? T_36 extends (TRequest["parameters"] extends readonly import("viem").PrepareTransactionRequestParameterType[] ? TRequest["parameters"][number] : "nonce" | "chainId" | "type" | "gas" | "blobVersionedHashes" | "fees") ? T_36 extends "fees" ? "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" : T_36 : never : never> & (unknown extends TRequest["kzg"] ? {} : Pick<TRequest, "kzg">))[K_1]; } : never>;
    readContract: <const abi_2 extends import("viem").Abi | readonly unknown[], functionName_1 extends import("viem").ContractFunctionName<abi_2, "view" | "pure">, args_1 extends import("viem").ContractFunctionArgs<abi_2, "view" | "pure", functionName_1>>(args: import("viem").ReadContractParameters<abi_2, functionName_1, args_1>) => Promise<import("viem").ReadContractReturnType<abi_2, functionName_1, args_1>>;
    sendRawTransaction: (args: import("viem").SendRawTransactionParameters) => Promise<`0x${string}`>;
    simulateContract: <const abi_3 extends import("viem").Abi | readonly unknown[], functionName_2 extends import("viem").ContractFunctionName<abi_3, "nonpayable" | "payable">, args_2 extends import("viem").ContractFunctionArgs<abi_3, "nonpayable" | "payable", functionName_2>, chainOverride extends import("viem").Chain | undefined, accountOverride extends `0x${string}` | import("viem").Account | undefined = undefined>(args: import("viem").SimulateContractParameters<abi_3, functionName_2, args_2, import("viem").Chain | undefined, chainOverride, accountOverride>) => Promise<import("viem").SimulateContractReturnType<abi_3, functionName_2, args_2, import("viem").Chain | undefined, import("viem").Account | undefined, chainOverride, accountOverride>>;
    verifyMessage: (args: {
        address: `0x${string}`;
        blockNumber?: bigint | undefined;
        blockTag?: import("viem").BlockTag | undefined;
        signature: `0x${string}` | Uint8Array | import("viem").Signature;
        message: import("viem").SignableMessage;
    }) => Promise<boolean>;
    verifySiweMessage: (args: {
        blockNumber?: bigint | undefined;
        blockTag?: import("viem").BlockTag | undefined;
        address?: `0x${string}` | undefined;
        nonce?: string | undefined;
        domain?: string | undefined;
        scheme?: string | undefined;
        time?: Date | undefined;
        message: string;
        signature: `0x${string}`;
    }) => Promise<boolean>;
    verifyTypedData: (args: import("viem").VerifyTypedDataActionParameters) => Promise<boolean>;
    uninstallFilter: (args: import("viem").UninstallFilterParameters) => Promise<boolean>;
    waitForTransactionReceipt: (args: import("viem").WaitForTransactionReceiptParameters<import("viem").Chain | undefined>) => Promise<import("viem").TransactionReceipt>;
    watchBlockNumber: (args: import("viem").WatchBlockNumberParameters) => import("viem").WatchBlockNumberReturnType;
    watchBlocks: <TIncludeTransactions_1 extends boolean = false, TBlockTag_2 extends import("viem").BlockTag = "latest">(args: import("viem").WatchBlocksParameters<import("viem").Transport, import("viem").Chain | undefined, TIncludeTransactions_1, TBlockTag_2>) => import("viem").WatchBlocksReturnType;
    watchContractEvent: <const TAbi_3 extends import("viem").Abi | readonly unknown[], TEventName_3 extends import("viem").ContractEventName<TAbi_3>, TStrict_5 extends boolean | undefined = undefined>(args: import("viem").WatchContractEventParameters<TAbi_3, TEventName_3, TStrict_5, import("viem").Transport>) => import("viem").WatchContractEventReturnType;
    watchEvent: <const TAbiEvent_2 extends import("viem").AbiEvent | undefined = undefined, const TAbiEvents_2 extends readonly unknown[] | readonly import("viem").AbiEvent[] | undefined = TAbiEvent_2 extends import("viem").AbiEvent ? [TAbiEvent_2] : undefined, TStrict_6 extends boolean | undefined = undefined>(args: import("viem").WatchEventParameters<TAbiEvent_2, TAbiEvents_2, TStrict_6, import("viem").Transport>) => import("viem").WatchEventReturnType;
    watchPendingTransactions: (args: import("viem").WatchPendingTransactionsParameters<import("viem").Transport>) => import("viem").WatchPendingTransactionsReturnType;
    _tevm: {
        readonly logger: import("@tevm/logger").Logger;
        readonly getReceiptsManager: () => Promise<import("@tevm/receipt-manager").ReceiptsManager>;
        readonly miningConfig: import("@tevm/base-client").MiningConfig;
        readonly forkTransport?: {
            request: import("viem").EIP1193RequestFn;
        };
        readonly mode: "fork" | "normal";
        readonly ready: () => Promise<true>;
        readonly getVm: () => Promise<import("@tevm/vm").Vm>;
        readonly getTxPool: () => Promise<import("@tevm/txpool").TxPool>;
        readonly impersonatedAccount: `0x${string}` | undefined;
        readonly setImpersonatedAccount: (address: `0x${string}` | undefined) => void;
        readonly extend: <TExtension extends Record<string, any>>(decorator: (client: import("@tevm/base-client").BaseClient<"fork" | "normal", {}>) => TExtension) => import("@tevm/base-client").BaseClient<"fork" | "normal", {} & TExtension>;
        readonly setFilter: (filter: import("@tevm/base-client").Filter) => void;
        readonly getFilters: () => Map<`0x${string}`, import("@tevm/base-client").Filter>;
        readonly removeFilter: (id: `0x${string}`) => void;
    } & import("@tevm/base-client").EIP1193Events & {
        emit(eventName: keyof import("@tevm/base-client").EIP1193EventMap, ...args: any[]): boolean;
    } & import("@tevm/decorators").Eip1193RequestProvider & import("@tevm/decorators").TevmActionsApi & {
        send: import("@tevm/procedures-types").TevmJsonRpcRequestHandler;
        sendBulk: import("@tevm/procedures-types").TevmJsonRpcBulkRequestHandler;
        request: import("@tevm/decorators").EIP1193RequestFn;
    };
    tevmForkUrl?: string;
    tevmCall: import("@tevm/actions-types").CallHandler;
    tevmContract: import("@tevm/actions-types").ContractHandler;
    tevmScript: import("@tevm/actions-types").ScriptHandler;
    tevmDeploy: import("@tevm/actions-types").DeployHandler;
    tevmMine: import("@tevm/actions-types").MineHandler;
    tevmLoadState: import("@tevm/actions-types").LoadStateHandler;
    tevmDumpState: import("@tevm/actions-types").DumpStateHandler;
    tevmSetAccount: import("@tevm/actions-types").SetAccountHandler;
    tevmGetAccount: import("@tevm/actions-types").GetAccountHandler;
    extend: <const client extends {
        [x: string]: unknown;
        account?: undefined;
        batch?: undefined;
        cacheTime?: undefined;
        ccipRead?: undefined;
        chain?: undefined;
        key?: undefined;
        name?: undefined;
        pollingInterval?: undefined;
        request?: undefined;
        transport?: undefined;
        type?: undefined;
        uid?: undefined;
    } & import("viem").ExactPartial<Pick<import("viem").PublicActions<import("viem").Transport, undefined, undefined>, "call" | "createContractEventFilter" | "createEventFilter" | "estimateContractGas" | "estimateGas" | "getBlock" | "getBlockNumber" | "getChainId" | "getContractEvents" | "getEnsText" | "getFilterChanges" | "getGasPrice" | "getLogs" | "getTransaction" | "getTransactionCount" | "getTransactionReceipt" | "prepareTransactionRequest" | "readContract" | "sendRawTransaction" | "simulateContract" | "uninstallFilter" | "watchBlockNumber" | "watchContractEvent"> & Pick<import("viem").WalletActions<undefined, undefined>, "sendTransaction" | "writeContract">>>(fn: (client: import("viem").Client<import("viem").Transport, undefined, undefined, [{
        Method: "web3_clientVersion";
        Parameters?: undefined;
        ReturnType: string;
    }, {
        Method: "web3_sha3";
        Parameters: [data: `0x${string}`];
        ReturnType: string;
    }, {
        Method: "net_listening";
        Parameters?: undefined;
        ReturnType: boolean;
    }, {
        Method: "net_peerCount";
        Parameters?: undefined;
        ReturnType: `0x${string}`;
    }, {
        Method: "net_version";
        Parameters?: undefined;
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_blobBaseFee";
        Parameters?: undefined;
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_blockNumber";
        Parameters?: undefined;
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_call";
        Parameters: [transaction: import("viem").ExactPartial<import("viem").RpcTransactionRequest>] | [transaction: import("viem").ExactPartial<import("viem").RpcTransactionRequest>, block: `0x${string}` | import("viem").BlockTag | import("viem").RpcBlockIdentifier] | [transaction: import("viem").ExactPartial<import("viem").RpcTransactionRequest>, block: `0x${string}` | import("viem").BlockTag | import("viem").RpcBlockIdentifier, stateOverrideSet: import("viem").RpcStateOverride];
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_chainId";
        Parameters?: undefined;
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_coinbase";
        Parameters?: undefined;
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_estimateGas";
        Parameters: [transaction: import("viem").RpcTransactionRequest] | [transaction: import("viem").RpcTransactionRequest, block: `0x${string}` | import("viem").BlockTag] | [transaction: import("viem").RpcTransactionRequest, block: `0x${string}` | import("viem").BlockTag, import("viem").RpcStateOverride];
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_feeHistory";
        Parameters: [blockCount: `0x${string}`, newestBlock: `0x${string}` | import("viem").BlockTag, rewardPercentiles: number[] | undefined];
        ReturnType: import("viem").RpcFeeHistory;
    }, {
        Method: "eth_gasPrice";
        Parameters?: undefined;
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_getBalance";
        Parameters: [address: `0x${string}`, block: `0x${string}` | import("viem").BlockTag | import("viem").RpcBlockIdentifier];
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_getBlockByHash";
        Parameters: [hash: `0x${string}`, includeTransactionObjects: boolean];
        ReturnType: import("viem").RpcBlock | null;
    }, {
        Method: "eth_getBlockByNumber";
        Parameters: [block: `0x${string}` | import("viem").BlockTag, includeTransactionObjects: boolean];
        ReturnType: import("viem").RpcBlock | null;
    }, {
        Method: "eth_getBlockTransactionCountByHash";
        Parameters: [hash: `0x${string}`];
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_getBlockTransactionCountByNumber";
        Parameters: [block: `0x${string}` | import("viem").BlockTag];
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_getCode";
        Parameters: [address: `0x${string}`, block: `0x${string}` | import("viem").BlockTag | import("viem").RpcBlockIdentifier];
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_getFilterChanges";
        Parameters: [filterId: `0x${string}`];
        ReturnType: `0x${string}`[] | import("viem").RpcLog[];
    }, {
        Method: "eth_getFilterLogs";
        Parameters: [filterId: `0x${string}`];
        ReturnType: import("viem").RpcLog[];
    }, {
        Method: "eth_getLogs";
        Parameters: [{
            address?: `0x${string}` | `0x${string}`[] | undefined;
            topics?: import("viem").LogTopic[] | undefined;
        } & ({
            fromBlock?: `0x${string}` | import("viem").BlockTag | undefined;
            toBlock?: `0x${string}` | import("viem").BlockTag | undefined;
            blockHash?: undefined;
        } | {
            fromBlock?: undefined;
            toBlock?: undefined;
            blockHash?: `0x${string}` | undefined;
        })];
        ReturnType: import("viem").RpcLog[];
    }, {
        Method: "eth_getProof";
        Parameters: [address: `0x${string}`, storageKeys: `0x${string}`[], block: `0x${string}` | import("viem").BlockTag];
        ReturnType: import("viem").RpcProof;
    }, {
        Method: "eth_getStorageAt";
        Parameters: [address: `0x${string}`, index: `0x${string}`, block: `0x${string}` | import("viem").BlockTag | import("viem").RpcBlockIdentifier];
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_getTransactionByBlockHashAndIndex";
        Parameters: [hash: `0x${string}`, index: `0x${string}`];
        ReturnType: import("viem").RpcTransaction | null;
    }, {
        Method: "eth_getTransactionByBlockNumberAndIndex";
        Parameters: [block: `0x${string}` | import("viem").BlockTag, index: `0x${string}`];
        ReturnType: import("viem").RpcTransaction | null;
    }, {
        Method: "eth_getTransactionByHash";
        Parameters: [hash: `0x${string}`];
        ReturnType: import("viem").RpcTransaction | null;
    }, {
        Method: "eth_getTransactionCount";
        Parameters: [address: `0x${string}`, block: `0x${string}` | import("viem").BlockTag | import("viem").RpcBlockIdentifier];
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_getTransactionReceipt";
        Parameters: [hash: `0x${string}`];
        ReturnType: import("viem").RpcTransactionReceipt | null;
    }, {
        Method: "eth_getUncleByBlockHashAndIndex";
        Parameters: [hash: `0x${string}`, index: `0x${string}`];
        ReturnType: import("viem").RpcUncle | null;
    }, {
        Method: "eth_getUncleByBlockNumberAndIndex";
        Parameters: [block: `0x${string}` | import("viem").BlockTag, index: `0x${string}`];
        ReturnType: import("viem").RpcUncle | null;
    }, {
        Method: "eth_getUncleCountByBlockHash";
        Parameters: [hash: `0x${string}`];
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_getUncleCountByBlockNumber";
        Parameters: [block: `0x${string}` | import("viem").BlockTag];
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_maxPriorityFeePerGas";
        Parameters?: undefined;
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_newBlockFilter";
        Parameters?: undefined;
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_newFilter";
        Parameters: [filter: {
            fromBlock?: `0x${string}` | import("viem").BlockTag | undefined;
            toBlock?: `0x${string}` | import("viem").BlockTag | undefined;
            address?: `0x${string}` | `0x${string}`[] | undefined;
            topics?: import("viem").LogTopic[] | undefined;
        }];
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_newPendingTransactionFilter";
        Parameters?: undefined;
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_protocolVersion";
        Parameters?: undefined;
        ReturnType: string;
    }, {
        Method: "eth_sendRawTransaction";
        Parameters: [signedTransaction: `0x${string}`];
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_uninstallFilter";
        Parameters: [filterId: `0x${string}`];
        ReturnType: boolean;
    }, {
        Method: "anvil_addCompilationResult" | "ganache_addCompilationResult" | "hardhat_addCompilationResult";
        Parameters: any[];
        ReturnType: any;
    }, {
        Method: "anvil_dropTransaction" | "ganache_dropTransaction" | "hardhat_dropTransaction";
        Parameters: [hash: `0x${string}`];
        ReturnType: void;
    }, {
        Method: "anvil_dumpState" | "ganache_dumpState" | "hardhat_dumpState";
        Parameters?: undefined;
        ReturnType: `0x${string}`;
    }, {
        Method: "anvil_enableTraces" | "ganache_enableTraces" | "hardhat_enableTraces";
        Parameters?: undefined;
        ReturnType: void;
    }, {
        Method: "anvil_impersonateAccount" | "ganache_impersonateAccount" | "hardhat_impersonateAccount";
        Parameters: [address: `0x${string}`];
        ReturnType: void;
    }, {
        Method: "anvil_getAutomine" | "ganache_getAutomine" | "hardhat_getAutomine";
        Parameters?: undefined;
        ReturnType: boolean;
    }, {
        Method: "anvil_loadState" | "ganache_loadState" | "hardhat_loadState";
        Parameters?: [`0x${string}`] | undefined;
        ReturnType: void;
    }, {
        Method: "anvil_mine" | "ganache_mine" | "hardhat_mine";
        Parameters: [count: `0x${string}`, interval: `0x${string}` | undefined];
        ReturnType: void;
    }, {
        Method: "anvil_reset" | "ganache_reset" | "hardhat_reset";
        Parameters: any[];
        ReturnType: void;
    }, {
        Method: "anvil_setBalance" | "ganache_setBalance" | "hardhat_setBalance";
        Parameters: [address: `0x${string}`, balance: `0x${string}`];
        ReturnType: void;
    }, {
        Method: "anvil_setCode" | "ganache_setCode" | "hardhat_setCode";
        Parameters: [address: `0x${string}`, data: string];
        ReturnType: void;
    }, {
        Method: "anvil_setCoinbase" | "ganache_setCoinbase" | "hardhat_setCoinbase";
        Parameters: [address: `0x${string}`];
        ReturnType: void;
    }, {
        Method: "anvil_setLoggingEnabled" | "ganache_setLoggingEnabled" | "hardhat_setLoggingEnabled";
        Parameters: [enabled: boolean];
        ReturnType: void;
    }, {
        Method: "anvil_setMinGasPrice" | "ganache_setMinGasPrice" | "hardhat_setMinGasPrice";
        Parameters: [gasPrice: `0x${string}`];
        ReturnType: void;
    }, {
        Method: "anvil_setNextBlockBaseFeePerGas" | "ganache_setNextBlockBaseFeePerGas" | "hardhat_setNextBlockBaseFeePerGas";
        Parameters: [baseFeePerGas: `0x${string}`];
        ReturnType: void;
    }, {
        Method: "anvil_setNonce" | "ganache_setNonce" | "hardhat_setNonce";
        Parameters: [address: `0x${string}`, nonce: `0x${string}`];
        ReturnType: void;
    }, {
        Method: "anvil_setRpcUrl" | "ganache_setRpcUrl" | "hardhat_setRpcUrl";
        Parameters: [url: string];
        ReturnType: void;
    }, {
        Method: "anvil_setStorageAt" | "ganache_setStorageAt" | "hardhat_setStorageAt";
        Parameters: [address: `0x${string}`, index: `0x${string}`, value: `0x${string}`];
        ReturnType: void;
    }, {
        Method: "anvil_stopImpersonatingAccount" | "ganache_stopImpersonatingAccount" | "hardhat_stopImpersonatingAccount";
        Parameters: [address: `0x${string}`];
        ReturnType: void;
    }, {
        Method: "anvil_increaseTime" | "ganache_increaseTime" | "hardhat_increaseTime";
        Parameters: [seconds: number];
        ReturnType: `0x${string}`;
    }, {
        Method: "evm_setAccountBalance";
        Parameters: [address: `0x${string}`, value: `0x${string}`];
        ReturnType: void;
    }, {
        Method: "evm_setAutomine";
        Parameters: [boolean];
        ReturnType: void;
    }, {
        Method: "evm_setBlockGasLimit";
        Parameters: [gasLimit: `0x${string}`];
        ReturnType: void;
    }, {
        Method: "evm_increaseTime";
        Parameters: [seconds: `0x${string}`];
        ReturnType: `0x${string}`;
    }, {
        Method: "anvil_setBlockTimestampInterval" | "ganache_setBlockTimestampInterval" | "hardhat_setBlockTimestampInterval";
        Parameters: [seconds: number];
        ReturnType: void;
    }, {
        Method: "anvil_removeBlockTimestampInterval" | "ganache_removeBlockTimestampInterval" | "hardhat_removeBlockTimestampInterval";
        Parameters?: undefined;
        ReturnType: void;
    }, {
        Method: "evm_setIntervalMining";
        Parameters: [number];
        ReturnType: void;
    }, {
        Method: "evm_setNextBlockTimestamp";
        Parameters: [`0x${string}`];
        ReturnType: void;
    }, {
        Method: "evm_snapshot";
        Parameters?: undefined;
        ReturnType: `0x${string}`;
    }, {
        Method: "evm_revert";
        Parameters?: [id: `0x${string}`] | undefined;
        ReturnType: void;
    }, {
        Method: "miner_start";
        Parameters?: undefined;
        ReturnType: void;
    }, {
        Method: "miner_stop";
        Parameters?: undefined;
        ReturnType: void;
    }, {
        Method: "txpool_content";
        Parameters?: undefined;
        ReturnType: {
            pending: Record<`0x${string}`, Record<string, import("viem").RpcTransaction>>;
            queued: Record<`0x${string}`, Record<string, import("viem").RpcTransaction>>;
        };
    }, {
        Method: "txpool_inspect";
        Parameters?: undefined;
        ReturnType: {
            pending: Record<`0x${string}`, Record<string, string>>;
            queued: Record<`0x${string}`, Record<string, string>>;
        };
    }, {
        Method: "txpool_status";
        Parameters?: undefined;
        ReturnType: {
            pending: `0x${string}`;
            queued: `0x${string}`;
        };
    }, {
        Method: "eth_mining";
        Parameters?: undefined;
        ReturnType: boolean;
    }, {
        Method: "evm_mine";
        Parameters?: [{
            blocks: `0x${string}`;
        }] | undefined;
        ReturnType: void;
    }, {
        Method: "eth_sendUnsignedTransaction";
        Parameters: [transaction: import("viem").RpcTransactionRequest];
        ReturnType: `0x${string}`;
    }, {
        Method: "tevm_call";
        Parameters: [params: {
            data?: `0x${string}`;
            deployedBytecode?: `0x${string}`;
            value?: `0x${string}`;
            from?: `0x${string}`;
            to?: `0x${string}`;
            gasPrice?: `0x${string}`;
            gas?: `0x${string}`;
            blobVersionedHashes?: `0x${string}`[];
            blockTag?: `0x${string}` | import("@tevm/actions-types").BlockTag;
            gasRefund?: `0x${string}`;
            selfdestruct?: readonly `0x${string}`[];
            throwOnFail?: boolean;
            createTrace?: boolean;
            createAccessList?: boolean;
            createTransaction?: boolean | "on-success" | "always" | "never";
            skipBalance?: boolean;
            origin?: `0x${string}`;
            caller?: `0x${string}`;
            depth?: number;
            salt?: `0x${string}`;
        }, stateOverrideSet?: {
            [x: `0x${string}`]: {
                balance?: `0x${string}`;
                nonce?: `0x${string}`;
                code?: `0x${string}`;
                state?: {
                    [x: `0x${string}`]: `0x${string}`;
                };
                stateDiff?: {
                    [x: `0x${string}`]: `0x${string}`;
                };
            };
        } | undefined, blockOverrideSet?: {
            number?: `0x${string}`;
            time?: `0x${string}`;
            gasLimit?: `0x${string}`;
            coinbase?: `0x${string}`;
            baseFee?: `0x${string}`;
            blobBaseFee?: `0x${string}`;
        } | undefined];
        ReturnType: {
            trace?: {
                readonly failed: boolean;
                readonly gas: `0x${string}`;
                readonly returnValue: `0x${string}`;
                readonly structLogs: {
                    readonly depth: number;
                    readonly gas: `0x${string}`;
                    readonly gasCost: `0x${string}`;
                    readonly op: string;
                    readonly pc: number;
                    readonly stack: `0x${string}`[];
                    readonly error?: {
                        error: string;
                        errorType: string;
                    };
                }[];
            };
            accessList?: {
                [x: `0x${string}`]: readonly `0x${string}`[];
            };
            txHash?: `0x${string}`;
            gas?: `0x${string}`;
            executionGasUsed: `0x${string}`;
            logs?: {
                readonly address: `0x${string}`;
                readonly topics: `0x${string}`[];
                readonly data: `0x${string}`;
            }[];
            gasRefund?: `0x${string}`;
            blobGasUsed?: `0x${string}`;
            createdAddress?: `0x${string}`;
            selfdestruct?: readonly `0x${string}`[];
            createdAddresses?: readonly `0x${string}`[];
            rawData: `0x${string}`;
            errors?: never[];
        };
    }, {
        Method: "tevm_script";
        Parameters: [params: {
            value?: `0x${string}`;
            from?: `0x${string}`;
            to?: `0x${string}`;
            gasPrice?: `0x${string}`;
            gas?: `0x${string}`;
            blobVersionedHashes?: `0x${string}`[];
            blockTag?: `0x${string}` | import("@tevm/actions-types").BlockTag;
            gasRefund?: `0x${string}`;
            selfdestruct?: readonly `0x${string}`[];
            throwOnFail?: boolean;
            createTrace?: boolean;
            createAccessList?: boolean;
            createTransaction?: boolean | "on-success" | "always" | "never";
            skipBalance?: boolean;
            origin?: `0x${string}`;
            caller?: `0x${string}`;
            depth?: number;
        } & {
            data: `0x${string}`;
            deployedBytecode: `0x${string}`;
        }, stateOverrideSet?: {
            [x: `0x${string}`]: {
                balance?: `0x${string}`;
                nonce?: `0x${string}`;
                code?: `0x${string}`;
                state?: {
                    [x: `0x${string}`]: `0x${string}`;
                };
                stateDiff?: {
                    [x: `0x${string}`]: `0x${string}`;
                };
            };
        } | undefined, blockOverrideSet?: {
            number?: `0x${string}`;
            time?: `0x${string}`;
            gasLimit?: `0x${string}`;
            coinbase?: `0x${string}`;
            baseFee?: `0x${string}`;
            blobBaseFee?: `0x${string}`;
        } | undefined];
        ReturnType: {
            trace?: {
                readonly failed: boolean;
                readonly gas: `0x${string}`;
                readonly returnValue: `0x${string}`;
                readonly structLogs: {
                    readonly depth: number;
                    readonly gas: `0x${string}`;
                    readonly gasCost: `0x${string}`;
                    readonly op: string;
                    readonly pc: number;
                    readonly stack: `0x${string}`[];
                    readonly error?: {
                        error: string;
                        errorType: string;
                    };
                }[];
            };
            accessList?: {
                [x: `0x${string}`]: readonly `0x${string}`[];
            };
            txHash?: `0x${string}`;
            gas?: `0x${string}`;
            executionGasUsed: `0x${string}`;
            logs?: {
                readonly address: `0x${string}`;
                readonly topics: `0x${string}`[];
                readonly data: `0x${string}`;
            }[];
            gasRefund?: `0x${string}`;
            blobGasUsed?: `0x${string}`;
            createdAddress?: `0x${string}`;
            selfdestruct?: readonly `0x${string}`[];
            createdAddresses?: readonly `0x${string}`[];
            rawData: `0x${string}`;
            errors?: never[];
        };
    }, {
        Method: "tevm_dumpState";
        Parameters?: [] | undefined;
        ReturnType: import("@tevm/actions-types").DumpStateResult<never>;
    }, {
        Method: "tevm_loadState";
        Parameters: [import("@tevm/procedures-types").SerializedParams];
        ReturnType: {
            errors?: never[];
        };
    }, {
        Method: "tevm_getAccount";
        Parameters: [{
            throwOnFail?: boolean;
            address: `0x${string}`;
            returnStorage?: boolean;
        }];
        ReturnType: {
            errors?: never[];
            address: `0x${string}`;
            nonce: `0x${string}`;
            balance: `0x${string}`;
            deployedBytecode: `0x${string}`;
            storageRoot: `0x${string}`;
            codeHash: `0x${string}`;
            isContract: boolean;
            isEmpty: boolean;
            storage?: {
                [x: `0x${string}`]: `0x${string}`;
            };
        };
    }, {
        Method: "tevm_setAccount";
        Parameters: [{
            throwOnFail?: boolean;
            address: `0x${string}`;
            nonce?: `0x${string}`;
            balance?: `0x${string}`;
            deployedBytecode?: `0x${string}`;
            storageRoot?: `0x${string}`;
            state?: {
                [x: `0x${string}`]: `0x${string}`;
            };
            stateDiff?: {
                [x: `0x${string}`]: `0x${string}`;
            };
        }];
        ReturnType: {
            errors?: never[];
        };
    }], import("viem").PublicActions & import("@tevm/memory-client").TevmActions>) => client) => import("viem").Client<import("viem").Transport, undefined, undefined, [{
        Method: "web3_clientVersion";
        Parameters?: undefined;
        ReturnType: string;
    }, {
        Method: "web3_sha3";
        Parameters: [data: `0x${string}`];
        ReturnType: string;
    }, {
        Method: "net_listening";
        Parameters?: undefined;
        ReturnType: boolean;
    }, {
        Method: "net_peerCount";
        Parameters?: undefined;
        ReturnType: `0x${string}`;
    }, {
        Method: "net_version";
        Parameters?: undefined;
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_blobBaseFee";
        Parameters?: undefined;
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_blockNumber";
        Parameters?: undefined;
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_call";
        Parameters: [transaction: import("viem").ExactPartial<import("viem").RpcTransactionRequest>] | [transaction: import("viem").ExactPartial<import("viem").RpcTransactionRequest>, block: `0x${string}` | import("viem").BlockTag | import("viem").RpcBlockIdentifier] | [transaction: import("viem").ExactPartial<import("viem").RpcTransactionRequest>, block: `0x${string}` | import("viem").BlockTag | import("viem").RpcBlockIdentifier, stateOverrideSet: import("viem").RpcStateOverride];
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_chainId";
        Parameters?: undefined;
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_coinbase";
        Parameters?: undefined;
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_estimateGas";
        Parameters: [transaction: import("viem").RpcTransactionRequest] | [transaction: import("viem").RpcTransactionRequest, block: `0x${string}` | import("viem").BlockTag] | [transaction: import("viem").RpcTransactionRequest, block: `0x${string}` | import("viem").BlockTag, import("viem").RpcStateOverride];
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_feeHistory";
        Parameters: [blockCount: `0x${string}`, newestBlock: `0x${string}` | import("viem").BlockTag, rewardPercentiles: number[] | undefined];
        ReturnType: import("viem").RpcFeeHistory;
    }, {
        Method: "eth_gasPrice";
        Parameters?: undefined;
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_getBalance";
        Parameters: [address: `0x${string}`, block: `0x${string}` | import("viem").BlockTag | import("viem").RpcBlockIdentifier];
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_getBlockByHash";
        Parameters: [hash: `0x${string}`, includeTransactionObjects: boolean];
        ReturnType: import("viem").RpcBlock | null;
    }, {
        Method: "eth_getBlockByNumber";
        Parameters: [block: `0x${string}` | import("viem").BlockTag, includeTransactionObjects: boolean];
        ReturnType: import("viem").RpcBlock | null;
    }, {
        Method: "eth_getBlockTransactionCountByHash";
        Parameters: [hash: `0x${string}`];
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_getBlockTransactionCountByNumber";
        Parameters: [block: `0x${string}` | import("viem").BlockTag];
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_getCode";
        Parameters: [address: `0x${string}`, block: `0x${string}` | import("viem").BlockTag | import("viem").RpcBlockIdentifier];
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_getFilterChanges";
        Parameters: [filterId: `0x${string}`];
        ReturnType: `0x${string}`[] | import("viem").RpcLog[];
    }, {
        Method: "eth_getFilterLogs";
        Parameters: [filterId: `0x${string}`];
        ReturnType: import("viem").RpcLog[];
    }, {
        Method: "eth_getLogs";
        Parameters: [{
            address?: `0x${string}` | `0x${string}`[] | undefined;
            topics?: import("viem").LogTopic[] | undefined;
        } & ({
            fromBlock?: `0x${string}` | import("viem").BlockTag | undefined;
            toBlock?: `0x${string}` | import("viem").BlockTag | undefined;
            blockHash?: undefined;
        } | {
            fromBlock?: undefined;
            toBlock?: undefined;
            blockHash?: `0x${string}` | undefined;
        })];
        ReturnType: import("viem").RpcLog[];
    }, {
        Method: "eth_getProof";
        Parameters: [address: `0x${string}`, storageKeys: `0x${string}`[], block: `0x${string}` | import("viem").BlockTag];
        ReturnType: import("viem").RpcProof;
    }, {
        Method: "eth_getStorageAt";
        Parameters: [address: `0x${string}`, index: `0x${string}`, block: `0x${string}` | import("viem").BlockTag | import("viem").RpcBlockIdentifier];
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_getTransactionByBlockHashAndIndex";
        Parameters: [hash: `0x${string}`, index: `0x${string}`];
        ReturnType: import("viem").RpcTransaction | null;
    }, {
        Method: "eth_getTransactionByBlockNumberAndIndex";
        Parameters: [block: `0x${string}` | import("viem").BlockTag, index: `0x${string}`];
        ReturnType: import("viem").RpcTransaction | null;
    }, {
        Method: "eth_getTransactionByHash";
        Parameters: [hash: `0x${string}`];
        ReturnType: import("viem").RpcTransaction | null;
    }, {
        Method: "eth_getTransactionCount";
        Parameters: [address: `0x${string}`, block: `0x${string}` | import("viem").BlockTag | import("viem").RpcBlockIdentifier];
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_getTransactionReceipt";
        Parameters: [hash: `0x${string}`];
        ReturnType: import("viem").RpcTransactionReceipt | null;
    }, {
        Method: "eth_getUncleByBlockHashAndIndex";
        Parameters: [hash: `0x${string}`, index: `0x${string}`];
        ReturnType: import("viem").RpcUncle | null;
    }, {
        Method: "eth_getUncleByBlockNumberAndIndex";
        Parameters: [block: `0x${string}` | import("viem").BlockTag, index: `0x${string}`];
        ReturnType: import("viem").RpcUncle | null;
    }, {
        Method: "eth_getUncleCountByBlockHash";
        Parameters: [hash: `0x${string}`];
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_getUncleCountByBlockNumber";
        Parameters: [block: `0x${string}` | import("viem").BlockTag];
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_maxPriorityFeePerGas";
        Parameters?: undefined;
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_newBlockFilter";
        Parameters?: undefined;
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_newFilter";
        Parameters: [filter: {
            fromBlock?: `0x${string}` | import("viem").BlockTag | undefined;
            toBlock?: `0x${string}` | import("viem").BlockTag | undefined;
            address?: `0x${string}` | `0x${string}`[] | undefined;
            topics?: import("viem").LogTopic[] | undefined;
        }];
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_newPendingTransactionFilter";
        Parameters?: undefined;
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_protocolVersion";
        Parameters?: undefined;
        ReturnType: string;
    }, {
        Method: "eth_sendRawTransaction";
        Parameters: [signedTransaction: `0x${string}`];
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_uninstallFilter";
        Parameters: [filterId: `0x${string}`];
        ReturnType: boolean;
    }, {
        Method: "anvil_addCompilationResult" | "ganache_addCompilationResult" | "hardhat_addCompilationResult";
        Parameters: any[];
        ReturnType: any;
    }, {
        Method: "anvil_dropTransaction" | "ganache_dropTransaction" | "hardhat_dropTransaction";
        Parameters: [hash: `0x${string}`];
        ReturnType: void;
    }, {
        Method: "anvil_dumpState" | "ganache_dumpState" | "hardhat_dumpState";
        Parameters?: undefined;
        ReturnType: `0x${string}`;
    }, {
        Method: "anvil_enableTraces" | "ganache_enableTraces" | "hardhat_enableTraces";
        Parameters?: undefined;
        ReturnType: void;
    }, {
        Method: "anvil_impersonateAccount" | "ganache_impersonateAccount" | "hardhat_impersonateAccount";
        Parameters: [address: `0x${string}`];
        ReturnType: void;
    }, {
        Method: "anvil_getAutomine" | "ganache_getAutomine" | "hardhat_getAutomine";
        Parameters?: undefined;
        ReturnType: boolean;
    }, {
        Method: "anvil_loadState" | "ganache_loadState" | "hardhat_loadState";
        Parameters?: [`0x${string}`] | undefined;
        ReturnType: void;
    }, {
        Method: "anvil_mine" | "ganache_mine" | "hardhat_mine";
        Parameters: [count: `0x${string}`, interval: `0x${string}` | undefined];
        ReturnType: void;
    }, {
        Method: "anvil_reset" | "ganache_reset" | "hardhat_reset";
        Parameters: any[];
        ReturnType: void;
    }, {
        Method: "anvil_setBalance" | "ganache_setBalance" | "hardhat_setBalance";
        Parameters: [address: `0x${string}`, balance: `0x${string}`];
        ReturnType: void;
    }, {
        Method: "anvil_setCode" | "ganache_setCode" | "hardhat_setCode";
        Parameters: [address: `0x${string}`, data: string];
        ReturnType: void;
    }, {
        Method: "anvil_setCoinbase" | "ganache_setCoinbase" | "hardhat_setCoinbase";
        Parameters: [address: `0x${string}`];
        ReturnType: void;
    }, {
        Method: "anvil_setLoggingEnabled" | "ganache_setLoggingEnabled" | "hardhat_setLoggingEnabled";
        Parameters: [enabled: boolean];
        ReturnType: void;
    }, {
        Method: "anvil_setMinGasPrice" | "ganache_setMinGasPrice" | "hardhat_setMinGasPrice";
        Parameters: [gasPrice: `0x${string}`];
        ReturnType: void;
    }, {
        Method: "anvil_setNextBlockBaseFeePerGas" | "ganache_setNextBlockBaseFeePerGas" | "hardhat_setNextBlockBaseFeePerGas";
        Parameters: [baseFeePerGas: `0x${string}`];
        ReturnType: void;
    }, {
        Method: "anvil_setNonce" | "ganache_setNonce" | "hardhat_setNonce";
        Parameters: [address: `0x${string}`, nonce: `0x${string}`];
        ReturnType: void;
    }, {
        Method: "anvil_setRpcUrl" | "ganache_setRpcUrl" | "hardhat_setRpcUrl";
        Parameters: [url: string];
        ReturnType: void;
    }, {
        Method: "anvil_setStorageAt" | "ganache_setStorageAt" | "hardhat_setStorageAt";
        Parameters: [address: `0x${string}`, index: `0x${string}`, value: `0x${string}`];
        ReturnType: void;
    }, {
        Method: "anvil_stopImpersonatingAccount" | "ganache_stopImpersonatingAccount" | "hardhat_stopImpersonatingAccount";
        Parameters: [address: `0x${string}`];
        ReturnType: void;
    }, {
        Method: "anvil_increaseTime" | "ganache_increaseTime" | "hardhat_increaseTime";
        Parameters: [seconds: number];
        ReturnType: `0x${string}`;
    }, {
        Method: "evm_setAccountBalance";
        Parameters: [address: `0x${string}`, value: `0x${string}`];
        ReturnType: void;
    }, {
        Method: "evm_setAutomine";
        Parameters: [boolean];
        ReturnType: void;
    }, {
        Method: "evm_setBlockGasLimit";
        Parameters: [gasLimit: `0x${string}`];
        ReturnType: void;
    }, {
        Method: "evm_increaseTime";
        Parameters: [seconds: `0x${string}`];
        ReturnType: `0x${string}`;
    }, {
        Method: "anvil_setBlockTimestampInterval" | "ganache_setBlockTimestampInterval" | "hardhat_setBlockTimestampInterval";
        Parameters: [seconds: number];
        ReturnType: void;
    }, {
        Method: "anvil_removeBlockTimestampInterval" | "ganache_removeBlockTimestampInterval" | "hardhat_removeBlockTimestampInterval";
        Parameters?: undefined;
        ReturnType: void;
    }, {
        Method: "evm_setIntervalMining";
        Parameters: [number];
        ReturnType: void;
    }, {
        Method: "evm_setNextBlockTimestamp";
        Parameters: [`0x${string}`];
        ReturnType: void;
    }, {
        Method: "evm_snapshot";
        Parameters?: undefined;
        ReturnType: `0x${string}`;
    }, {
        Method: "evm_revert";
        Parameters?: [id: `0x${string}`] | undefined;
        ReturnType: void;
    }, {
        Method: "miner_start";
        Parameters?: undefined;
        ReturnType: void;
    }, {
        Method: "miner_stop";
        Parameters?: undefined;
        ReturnType: void;
    }, {
        Method: "txpool_content";
        Parameters?: undefined;
        ReturnType: {
            pending: Record<`0x${string}`, Record<string, import("viem").RpcTransaction>>;
            queued: Record<`0x${string}`, Record<string, import("viem").RpcTransaction>>;
        };
    }, {
        Method: "txpool_inspect";
        Parameters?: undefined;
        ReturnType: {
            pending: Record<`0x${string}`, Record<string, string>>;
            queued: Record<`0x${string}`, Record<string, string>>;
        };
    }, {
        Method: "txpool_status";
        Parameters?: undefined;
        ReturnType: {
            pending: `0x${string}`;
            queued: `0x${string}`;
        };
    }, {
        Method: "eth_mining";
        Parameters?: undefined;
        ReturnType: boolean;
    }, {
        Method: "evm_mine";
        Parameters?: [{
            blocks: `0x${string}`;
        }] | undefined;
        ReturnType: void;
    }, {
        Method: "eth_sendUnsignedTransaction";
        Parameters: [transaction: import("viem").RpcTransactionRequest];
        ReturnType: `0x${string}`;
    }, {
        Method: "tevm_call";
        Parameters: [params: {
            data?: `0x${string}`;
            deployedBytecode?: `0x${string}`;
            value?: `0x${string}`;
            from?: `0x${string}`;
            to?: `0x${string}`;
            gasPrice?: `0x${string}`;
            gas?: `0x${string}`;
            blobVersionedHashes?: `0x${string}`[];
            blockTag?: `0x${string}` | import("@tevm/actions-types").BlockTag;
            gasRefund?: `0x${string}`;
            selfdestruct?: readonly `0x${string}`[];
            throwOnFail?: boolean;
            createTrace?: boolean;
            createAccessList?: boolean;
            createTransaction?: boolean | "on-success" | "always" | "never";
            skipBalance?: boolean;
            origin?: `0x${string}`;
            caller?: `0x${string}`;
            depth?: number;
            salt?: `0x${string}`;
        }, stateOverrideSet?: {
            [x: `0x${string}`]: {
                balance?: `0x${string}`;
                nonce?: `0x${string}`;
                code?: `0x${string}`;
                state?: {
                    [x: `0x${string}`]: `0x${string}`;
                };
                stateDiff?: {
                    [x: `0x${string}`]: `0x${string}`;
                };
            };
        } | undefined, blockOverrideSet?: {
            number?: `0x${string}`;
            time?: `0x${string}`;
            gasLimit?: `0x${string}`;
            coinbase?: `0x${string}`;
            baseFee?: `0x${string}`;
            blobBaseFee?: `0x${string}`;
        } | undefined];
        ReturnType: {
            trace?: {
                readonly failed: boolean;
                readonly gas: `0x${string}`;
                readonly returnValue: `0x${string}`;
                readonly structLogs: {
                    readonly depth: number;
                    readonly gas: `0x${string}`;
                    readonly gasCost: `0x${string}`;
                    readonly op: string;
                    readonly pc: number;
                    readonly stack: `0x${string}`[];
                    readonly error?: {
                        error: string;
                        errorType: string;
                    };
                }[];
            };
            accessList?: {
                [x: `0x${string}`]: readonly `0x${string}`[];
            };
            txHash?: `0x${string}`;
            gas?: `0x${string}`;
            executionGasUsed: `0x${string}`;
            logs?: {
                readonly address: `0x${string}`;
                readonly topics: `0x${string}`[];
                readonly data: `0x${string}`;
            }[];
            gasRefund?: `0x${string}`;
            blobGasUsed?: `0x${string}`;
            createdAddress?: `0x${string}`;
            selfdestruct?: readonly `0x${string}`[];
            createdAddresses?: readonly `0x${string}`[];
            rawData: `0x${string}`;
            errors?: never[];
        };
    }, {
        Method: "tevm_script";
        Parameters: [params: {
            value?: `0x${string}`;
            from?: `0x${string}`;
            to?: `0x${string}`;
            gasPrice?: `0x${string}`;
            gas?: `0x${string}`;
            blobVersionedHashes?: `0x${string}`[];
            blockTag?: `0x${string}` | import("@tevm/actions-types").BlockTag;
            gasRefund?: `0x${string}`;
            selfdestruct?: readonly `0x${string}`[];
            throwOnFail?: boolean;
            createTrace?: boolean;
            createAccessList?: boolean;
            createTransaction?: boolean | "on-success" | "always" | "never";
            skipBalance?: boolean;
            origin?: `0x${string}`;
            caller?: `0x${string}`;
            depth?: number;
        } & {
            data: `0x${string}`;
            deployedBytecode: `0x${string}`;
        }, stateOverrideSet?: {
            [x: `0x${string}`]: {
                balance?: `0x${string}`;
                nonce?: `0x${string}`;
                code?: `0x${string}`;
                state?: {
                    [x: `0x${string}`]: `0x${string}`;
                };
                stateDiff?: {
                    [x: `0x${string}`]: `0x${string}`;
                };
            };
        } | undefined, blockOverrideSet?: {
            number?: `0x${string}`;
            time?: `0x${string}`;
            gasLimit?: `0x${string}`;
            coinbase?: `0x${string}`;
            baseFee?: `0x${string}`;
            blobBaseFee?: `0x${string}`;
        } | undefined];
        ReturnType: {
            trace?: {
                readonly failed: boolean;
                readonly gas: `0x${string}`;
                readonly returnValue: `0x${string}`;
                readonly structLogs: {
                    readonly depth: number;
                    readonly gas: `0x${string}`;
                    readonly gasCost: `0x${string}`;
                    readonly op: string;
                    readonly pc: number;
                    readonly stack: `0x${string}`[];
                    readonly error?: {
                        error: string;
                        errorType: string;
                    };
                }[];
            };
            accessList?: {
                [x: `0x${string}`]: readonly `0x${string}`[];
            };
            txHash?: `0x${string}`;
            gas?: `0x${string}`;
            executionGasUsed: `0x${string}`;
            logs?: {
                readonly address: `0x${string}`;
                readonly topics: `0x${string}`[];
                readonly data: `0x${string}`;
            }[];
            gasRefund?: `0x${string}`;
            blobGasUsed?: `0x${string}`;
            createdAddress?: `0x${string}`;
            selfdestruct?: readonly `0x${string}`[];
            createdAddresses?: readonly `0x${string}`[];
            rawData: `0x${string}`;
            errors?: never[];
        };
    }, {
        Method: "tevm_dumpState";
        Parameters?: [] | undefined;
        ReturnType: import("@tevm/actions-types").DumpStateResult<never>;
    }, {
        Method: "tevm_loadState";
        Parameters: [import("@tevm/procedures-types").SerializedParams];
        ReturnType: {
            errors?: never[];
        };
    }, {
        Method: "tevm_getAccount";
        Parameters: [{
            throwOnFail?: boolean;
            address: `0x${string}`;
            returnStorage?: boolean;
        }];
        ReturnType: {
            errors?: never[];
            address: `0x${string}`;
            nonce: `0x${string}`;
            balance: `0x${string}`;
            deployedBytecode: `0x${string}`;
            storageRoot: `0x${string}`;
            codeHash: `0x${string}`;
            isContract: boolean;
            isEmpty: boolean;
            storage?: {
                [x: `0x${string}`]: `0x${string}`;
            };
        };
    }, {
        Method: "tevm_setAccount";
        Parameters: [{
            throwOnFail?: boolean;
            address: `0x${string}`;
            nonce?: `0x${string}`;
            balance?: `0x${string}`;
            deployedBytecode?: `0x${string}`;
            storageRoot?: `0x${string}`;
            state?: {
                [x: `0x${string}`]: `0x${string}`;
            };
            stateDiff?: {
                [x: `0x${string}`]: `0x${string}`;
            };
        }];
        ReturnType: {
            errors?: never[];
        };
    }], { [K_2 in keyof client]: client[K_2]; } & import("viem").PublicActions & import("@tevm/memory-client").TevmActions>;
};
export type L1Client = ReturnType<typeof createL1Client>;
//# sourceMappingURL=createL1Client.d.ts.map