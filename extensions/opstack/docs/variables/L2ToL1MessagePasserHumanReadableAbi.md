**@tevm/opstack** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > L2ToL1MessagePasserHumanReadableAbi

# Variable: L2ToL1MessagePasserHumanReadableAbi

> **`const`** **L2ToL1MessagePasserHumanReadableAbi**: readonly [`"receive() external payable"`, `"function MESSAGE_VERSION() view returns (uint16)"`, `"function burn()"`, `"function initiateWithdrawal(address _target, uint256 _gasLimit, bytes _data) payable"`, `"function messageNonce() view returns (uint256)"`, `"function sentMessages(bytes32) view returns (bool)"`, `"function version() view returns (string)"`, `"event MessagePassed(uint256 indexed nonce, address indexed sender, address indexed target, uint256 value, uint256 gasLimit, bytes data, bytes32 withdrawalHash)"`, `"event WithdrawerBalanceBurnt(uint256 indexed amount)"`]

## Source

[extensions/opstack/src/contracts/l2/L2ToL1MessagePasser.ts:31](https://github.com/evmts/tevm-monorepo/blob/main/extensions/opstack/src/contracts/l2/L2ToL1MessagePasser.ts#L31)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
