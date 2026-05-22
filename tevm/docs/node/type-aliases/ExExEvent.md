[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [node](../README.md) / ExExEvent

# Type Alias: ExExEvent

> **ExExEvent** = \{ `blockHash`: `` `0x${string}` ``; `phase`: `"executed"`; `receipt`: [`TxReceipt`](../../receipt-manager/type-aliases/TxReceipt.md); `txHash`: `` `0x${string}` ``; `type`: `"transaction"`; \} \| \{ `blockHash`: `` `0x${string}` ``; `phase`: `"created"`; `receipt`: [`TxReceipt`](../../receipt-manager/type-aliases/TxReceipt.md); `type`: `"receipt"`; \} \| \{ `blockHash`: `` `0x${string}` ``; `log`: [`TxReceipt`](../../receipt-manager/type-aliases/TxReceipt.md)\[`"logs"`\]\[`number`\]; `phase`: `"created"`; `receipt`: [`TxReceipt`](../../receipt-manager/type-aliases/TxReceipt.md); `type`: `"log"`; \} \| \{ `blockHash`: `` `0x${string}` ``; `phase`: `"committed"`; `stateRoot`: `` `0x${string}` ``; `type`: `"state"`; \} \| \{ `block`: [`Block`](../../block/classes/Block.md); `blockHash`: `` `0x${string}` ``; `phase`: `"imported"`; `type`: `"block"`; \} \| \{ `headHash`: `` `0x${string}` ``; `headNumber`: `bigint`; `phase`: `"headChanged"`; `reorged`: `boolean`; `type`: `"canonical"`; \} \| \{ `method`: `string`; `payload`: `unknown`; `phase`: `"received"` \| `"validated"`; `result?`: `unknown`; `type`: `"enginePayload"`; \}
