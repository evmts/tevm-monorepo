---
title: Advanced tutorial
description: A tutorial to dive deep into Tevm
---

In this advanced tutorial we will dive deeper into some advanced Tevm functionality. If you haven't done the [quick start tutorial](./quick-start.md) it is recomended you start there.

## Introduction

We will be building an onchain tic tac toe app. It will have the following properties:

- Moves can be made much faster than the block time of the underlying network via optimistic updates
- Multiple players will be able to play each other in real time
- Each player will only need to make two total transactions to play the game

## Setup

1. Generate a tevm template with `create-tevm`

npx create-tevm@latest --template next

We are using the next.js framework but it isn't necessary to know Next to follow along with this tutorial.

2. Install `@tevm/tutorial` package

For the sake of this tutorial not focusing on building UI some visual react components are provided.

```bash
bun i @tevm/tutorial
```

3. Create the board

Go to `App.ts` and render the tic tac toe board

```typescript App.tsx
import {type Board, TicTacToe} from '@tevm/tutorial'

export const App = () => {
  const board: Board = [[], [], []]
  return <TicTacToe board={board} />
}
```

4. Now let's write a simple tic tac toe contract

```solidity
contract TicTacToe {

}
```

5. Now hook it up in single player mode

Let's get this tic tac toe game running in single player mode. 

- Make a tevm instance

```solidity tevm
import {createTevm} from 'tevm'

export const tevm = createTevm()
```

- use your tevm instance in react

```typescript App.tsx
import {tevm} from './tevm.js'
import {type Board, TicTacToe} from '@tevm/tutorial'

export const App = () => {
  const board: Board = [[], [], []]
  return <TicTacToe board={board} />
}
```
