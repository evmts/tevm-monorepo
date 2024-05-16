---
editUrl: false
next: false
prev: false
title: "getAccountFromProvider"
---

> `private` **getAccountFromProvider**(`baseState`): (`address`) => `Promise`\<[`EthjsAccount`](/reference/tevm/utils/classes/ethjsaccount/)\>

Retrieves an account from the provider and stores in the local trie

## Parameters

• **baseState**: [`BaseState`](/reference/tevm/state/type-aliases/basestate/)

## Returns

`Function`

### Parameters

• **address**: \`0x$\{string\}\`

### Returns

`Promise`\<[`EthjsAccount`](/reference/tevm/utils/classes/ethjsaccount/)\>

## Source

[packages/state/src/actions/getAccountFromProvider.js:11](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/actions/getAccountFromProvider.js#L11)
