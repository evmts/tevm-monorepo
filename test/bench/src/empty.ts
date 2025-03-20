import { readFileSync } from 'fs'
import { EmptyRunner, Console, RunEmpty, artifacts } from './empty.s.sol'
import { createMemoryClient } from 'tevm'
import { definePrecompile, defineCall } from 'tevm'
import { join } from 'path'

const consoleLogContract = Console.withAddress(`0x${'0357'.repeat(10)}`)

const consolePrecompile = definePrecompile({
  contract: consoleLogContract,
  call: defineCall(consoleLogContract.abi, {
    log: async ({ gasLimit, args }) => {
      console.log(...args)
      return {
        returnValue: undefined,
        executionGasUsed: 0n,
      }
    }
  })
})

const client = createMemoryClient({ customPrecompiles: [consolePrecompile.precompile()] })

const { createdAddress } = await client.tevmDeploy(RunEmpty.deploy(consoleLogContract.address))

client.tevmContract({
  ...RunEmpty.withAddress(createdAddress!).read.runner(),
  onStep: async (info, next) => {
    const pc = info.pc;
    const sourceMapStr = artifacts[EmptyRunner.name!].evm.deployedBytecode.sourceMap;

    const entries = sourceMapStr.split(',').map(entry => {
      const [startStr, lengthStr, fileIndexStr] = entry.split(':');
      return {
        start: Number(startStr),
        length: Number(lengthStr),
        fileIndex: Number(fileIndexStr),
      };
    });

    const entry = entries[pc] || entries[entries.length - 1];

    const sourceFile = readFileSync(join(__dirname, 'empty.s.sol'))

    const sourceUpToOffset = sourceFile.slice(0, entry.start);
    const lineNumber = sourceUpToOffset.split('\n').length;
    console.log(`At PC ${pc}: executing source line ${lineNumber}`);
    next?.();
  }
}).then(console.log)