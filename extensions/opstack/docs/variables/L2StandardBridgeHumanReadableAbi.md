**@tevm/opstack** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > L2StandardBridgeHumanReadableAbi

# Variable: L2StandardBridgeHumanReadableAbi

> **`const`** **L2StandardBridgeHumanReadableAbi**: readonly [`"constructor()"`, `"receive() external payable"`, `"function MESSENGER() view returns (address)"`, `"function OTHER_BRIDGE() view returns (address)"`, `"function bridgeERC20(address _localToken, address _remoteToken, uint256 _amount, uint32 _minGasLimit, bytes _extraData)"`, `"function bridgeERC20To(address _localToken, address _remoteToken, address _to, uint256 _amount, uint32 _minGasLimit, bytes _extraData)"`, `"function bridgeETH(uint32 _minGasLimit, bytes _extraData) payable"`, `"function bridgeETHTo(address _to, uint32 _minGasLimit, bytes _extraData) payable"`, `"function deposits(address, address) view returns (uint256)"`, `"function finalizeBridgeERC20(address _localToken, address _remoteToken, address _from, address _to, uint256 _amount, bytes _extraData)"`, `"function finalizeBridgeETH(address _from, address _to, uint256 _amount, bytes _extraData) payable"`, `"function finalizeDeposit(address _l1Token, address _l2Token, address _from, address _to, uint256 _amount, bytes _extraData) payable"`, `"function initialize(address _otherBridge)"`, `"function l1TokenBridge() view returns (address)"`, `"function messenger() view returns (address)"`, `"function otherBridge() view returns (address)"`, `"function paused() view returns (bool)"`, `"function version() view returns (string)"`, `"function withdraw(address _l2Token, uint256 _amount, uint32 _minGasLimit, bytes _extraData) payable"`, `"function withdrawTo(address _l2Token, address _to, uint256 _amount, uint32 _minGasLimit, bytes _extraData) payable"`, `"event DepositFinalized(address indexed l1Token, address indexed l2Token, address indexed from, address to, uint256 amount, bytes extraData)"`, `"event ERC20BridgeFinalized(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 amount, bytes extraData)"`, `"event ERC20BridgeInitiated(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 amount, bytes extraData)"`, `"event ETHBridgeFinalized(address indexed from, address indexed to, uint256 amount, bytes extraData)"`, `"event ETHBridgeInitiated(address indexed from, address indexed to, uint256 amount, bytes extraData)"`, `"event Initialized(uint8 version)"`, `"event WithdrawalInitiated(address indexed l1Token, address indexed l2Token, address indexed from, address to, uint256 amount, bytes extraData)"`]

## Source

[extensions/opstack/src/contracts/l2/L2StandardBridge.ts:31](https://github.com/evmts/tevm-monorepo/blob/main/extensions/opstack/src/contracts/l2/L2StandardBridge.ts#L31)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
