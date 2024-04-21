**tevm** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [errors](../README.md) > ForkError

# Type alias: ForkError

> **ForkError**: [`InvalidUrlError`](InvalidUrlError.md) \| [`InvalidBlockError`](InvalidBlockError.md) \| [`FailedToForkError`](FailedToForkError.md) \| [`UnexpectedError`](UnexpectedError.md)

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

 - [InvalidBlockError](InvalidBlockError.md)
 - [FailedToForkError](FailedToForkError.md)
 - [UnexpectedError](UnexpectedError.md)
 - [InvalidUrlError](InvalidUrlError.md)

## Source

packages/errors/types/actions/ForkError.d.ts:19

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
