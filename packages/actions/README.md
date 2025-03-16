<p align="center">
  <a href="https://tevm.sh/">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/35039927/218812217-92f0f784-cb85-43b9-9ca6-e2b9effd9eb2.png">
      <img alt="tevm logo" src="https://user-images.githubusercontent.com/35039927/218812217-92f0f784-cb85-43b9-9ca6-e2b9effd9eb2.png" width="auto" height="300">
    </picture>
  </a>
</p>

# @tevm/actions

Actions add functionality to the [base client](https://github.com/evmts/tevm-monorepo/tree/main/packages/node)

## Installation

Action handlers can be imported from `tevm/actions` or `@tevm/actions`

```bash
npm install tevm
```

or

```bash
npm install @tevm/actions
```

## Usage

Action handlers take a client and return an tevm action handler function

```typescript
import {createTevmNode} from 'tevm/node'
import {callHandler} from 'tevm/actions'

/**
 * Most action handlers wrap the base client
 */
const client = createTevmNode()

/**
 * To use the action first instanciate it with the base client
 * @type {import('tevm/actions').CallHandler}
 */
const call = callHandler(client)

/**
 * @type{import('tevm/actions').CallHandlerResult}
 */
const callResult = await call({
  to: `0x${'01'.repeat(20)}`,
  value: 1n,
})
```

## Actions

See [generated actions docs](./docs/API.md)

## License 📄

<a href="./LICENSE"><img src="https://user-images.githubusercontent.com/35039927/231030761-66f5ce58-a4e9-4695-b1fe-255b1bceac92.png" width="200" /></a>
