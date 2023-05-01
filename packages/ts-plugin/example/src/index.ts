// Edit this file to trigger the TSServer commands.

import { HelloWorld } from './index.sol'

export type Abi = typeof HelloWorld.abi

console.log(HelloWorld.abi)
