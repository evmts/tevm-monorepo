[**@tevm/opstack**](../README.md) • **Docs**

***

[@tevm/opstack](../globals.md) / DelayedVetoableHumanReadableAbi

# Variable: DelayedVetoableHumanReadableAbi

> `const` **DelayedVetoableHumanReadableAbi**: readonly [`"constructor(address vetoer_, address initiator_, address target_, uint256 operatingDelay_)"`, `"fallback()"`, `"function delay() returns (uint256 delay_)"`, `"function initiator() returns (address initiator_)"`, `"function queuedAt(bytes32 callHash) returns (uint256 queuedAt_)"`, `"function target() returns (address target_)"`, `"function version() view returns (string)"`, `"function vetoer() returns (address vetoer_)"`, `"event DelayActivated(uint256 delay)"`, `"event Forwarded(bytes32 indexed callHash, bytes data)"`, `"event Initiated(bytes32 indexed callHash, bytes data)"`, `"event Vetoed(bytes32 indexed callHash, bytes data)"`, `"error AlreadyDelayed()"`, `"error ForwardingEarly()"`, `"error TargetUnitialized()"`, `"error Unauthorized(address expected, address actual)"`]

## Source

[experimental/opstack/src/contracts/l1/DelayedVetoable.ts:31](https://github.com/evmts/tevm-monorepo/blob/main/experimental/opstack/src/contracts/l1/DelayedVetoable.ts#L31)
