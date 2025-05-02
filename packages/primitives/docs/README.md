**@tevm/primitives**

***

<p align="center">
  <a href="https://tevm.sh/">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/35039927/218812217-92f0f784-cb85-43b9-9ca6-e2b9effd9eb2.png">
      <img alt="tevm logo" src="https://user-images.githubusercontent.com/35039927/218812217-92f0f784-cb85-43b9-9ca6-e2b9effd9eb2.png" width="auto" height="300">
    </picture>
  </a>
</p>

# @tevm/primitives

Core primitive types for Tevm built with Effect Schema.

## Installation

Primitive types can be imported from `tevm/primitives` or `@tevm/primitives`

```bash
npm install tevm
```

or

```bash
npm install @tevm/primitives
```

## Usage

The `@tevm/primitives` package provides type-safe schemas built with Effect Schema for Ethereum types.

```typescript
import { Address } from '@tevm/primitives'

// Validate an Ethereum address
const result = Address.parse('0x1234567890123456789012345678901234567890')
```

## Features

- Type-safe Ethereum primitive types using Effect Schema
- Runtime validation of Ethereum addresses, hashes, and hex values
- Seamless integration with the Effect.ts ecosystem

## License 📄

<a href="_media/LICENSE"><img src="https://user-images.githubusercontent.com/35039927/231030761-66f5ce58-a4e9-4695-b1fe-255b1bceac92.png" width="200" /></a>
