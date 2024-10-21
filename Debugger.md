```typescript
import {createMemoryClient, http} from 'tevm'
import {numberToHex} from 'tevm/utils'
import MyContract from '<chain-id>:<contract-address>?rpcUrl=https://my.rpc.url'

main()

async function main() {
  const client = createMemoryClient({
    fork: { transport: http('https://my.rpc.url') },
  })
  setupDebugger()
  await client.contract({
    abi: MyContract.abi,
    functionName: 'someMethod',
    args: ['method', 'args'],
  })
}

// registers a debugger on the evm
function setupDebugger() {
  const vm = await client.getVm()

  vm.evm.events.on('step', async (step, next) => {
    console.log({
			pc: step.pc,
			op: step.opcode.name,
			gasCost: BigInt(step.opcode.fee) + (step.opcode.dynamicFee ?? 0n),
			gas: step.gasLeft,
			depth: step.depth,
			stack: step.stack.map((code) => numberToHex(code)),
    })
    // here we would track things like stack depth etc.
    await stopForDebuggerOrBreakpoint()
  })
}

// here is where we plug in the ui to stop execution for the debugger
// for now just use a javascript debugger
async function stopForDebuggerOrBreakpoint () {
  debugger
}
```

