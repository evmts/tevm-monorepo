[**@tevm/node**](../README.md)

***

[@tevm/node](../globals.md) / ExExEvent

# Type Alias: ExExEvent

> **ExExEvent** = \{ `blockHash`: `` `0x${string}` ``; `phase`: `"executed"`; `receipt`: `TxReceipt`; `txHash`: `` `0x${string}` ``; `type`: `"transaction"`; \} \| \{ `blockHash`: `` `0x${string}` ``; `phase`: `"created"`; `receipt`: `TxReceipt`; `type`: `"receipt"`; \} \| \{ `blockHash`: `` `0x${string}` ``; `log`: `TxReceipt`\[`"logs"`\]\[`number`\]; `phase`: `"created"`; `receipt`: `TxReceipt`; `type`: `"log"`; \} \| \{ `blockHash`: `` `0x${string}` ``; `phase`: `"committed"`; `stateRoot`: `` `0x${string}` ``; `type`: `"state"`; \} \| \{ `block`: `Block`; `blockHash`: `` `0x${string}` ``; `phase`: `"imported"`; `type`: `"block"`; \} \| \{ `headHash`: `` `0x${string}` ``; `headNumber`: `bigint`; `phase`: `"headChanged"`; `reorged`: `boolean`; `type`: `"canonical"`; \} \| \{ `method`: `string`; `payload`: `unknown`; `phase`: `"received"` \| `"validated"`; `result?`: `unknown`; `type`: `"enginePayload"`; \}

Defined in: [packages/node/src/ExEx.ts:4](https://github.com/evmts/tevm-monorepo/blob/main/packages/node/src/ExEx.ts#L4)
