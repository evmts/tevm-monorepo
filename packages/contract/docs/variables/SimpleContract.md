[**@tevm/contract**](../README.md) • **Docs**

***

[@tevm/contract](../globals.md) / SimpleContract

# Variable: SimpleContract

> `const` **SimpleContract**: [`Script`](../type-aliases/Script.md)\<`"SimpleContract"`, readonly [`"constructor(uint256 initialValue)"`, `"event ValueSet(uint256 newValue)"`, `"function get() view returns (uint256)"`, `"function set(uint256 newValue)"`]\>

A simple contract that stores a uint256 that is initialized in constructor and offers a getter and setter method

## Warning

the deployedBytecode is not currently correct and contract must be deployed

## Source

[contract-lib/SimpleContract.ts:7](https://github.com/evmts/tevm-monorepo/blob/main/packages/contract/src/contract-lib/SimpleContract.ts#L7)
