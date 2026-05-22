[**@tevm/node**](../README.md)

***

[@tevm/node](../globals.md) / createIntervalMiner

# Function: createIntervalMiner()

> **createIntervalMiner**(`client`): `IntervalMiner`

Defined in: [packages/node/src/createIntervalMiner.js:34](https://github.com/evmts/tevm-monorepo/blob/main/packages/node/src/createIntervalMiner.js#L34)

Creates an interval mining system that uses setTimeout to prevent race conditions

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `client` | [`TevmNode`](../type-aliases/TevmNode.md)\<`"fork"` \| `"normal"`, \{ \}\> | The TevmNode client |

## Returns

`IntervalMiner`

The interval miner controller

## Example

```js
import { createIntervalMiner } from '@tevm/node'

const client = createTevmNode({
  miningConfig: { type: 'interval', blockTime: 5 }
})

const miner = createIntervalMiner(client)
miner.start() // Start mining every 5 seconds

// Later...
miner.stop() // Stop mining
```
