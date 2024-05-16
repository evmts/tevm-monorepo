---
editUrl: false
next: false
prev: false
title: "ForkError"
---

> **ForkError**: [`InvalidUrlError`](/reference/tevm/errors/type-aliases/invalidurlerror/) \| [`InvalidBlockError`](/reference/tevm/errors/type-aliases/invalidblockerror/) \| [`FailedToForkError`](/reference/tevm/errors/type-aliases/failedtoforkerror/) \| [`UnexpectedError`](/reference/tevm/errors/type-aliases/unexpectederror/)

Error Returned by `tevm_fork` procedure

## Example

```ts
const res = await tevm.fork()

if (res.errors?.length) {
  console.log(res.errors[0].name) // Unable to fork because eth_blockNumber returned an error
  console.log(res.errors[0].message) // fork url returned a 503 forbidden error
}
```

## See

 - [InvalidBlockError](../../../../../../../reference/tevm/errors/type-aliases/invalidblockerror)
 - [FailedToForkError](../../../../../../../reference/tevm/errors/type-aliases/failedtoforkerror)
 - [UnexpectedError](../../../../../../../reference/tevm/errors/type-aliases/unexpectederror)
 - [InvalidUrlError](../../../../../../../reference/tevm/errors/type-aliases/invalidurlerror)

## Source

[packages/errors/src/actions/ForkError.ts:21](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/actions/ForkError.ts#L21)
