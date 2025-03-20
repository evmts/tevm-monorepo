import { EmptyRunner, Console, RunEmpty, artifacts } from './empty.s.sol'
import { createMemoryClient } from 'tevm'
import { definePrecompile, defineCall } from 'tevm'

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
    // Get the deployed bytecode source map for the contract
    const sourceMapStr = solcOutput.contracts["empty.s.sol"]["EmptyRunner"].evm.deployedBytecode.sourceMap;

    // Parse the source map (this is a simplified example)
    const entries = sourceMapStr.split(',').map(entry => {
      const [startStr, lengthStr, fileIndexStr] = entry.split(':');
      return {
        start: Number(startStr),
        length: Number(lengthStr),
        fileIndex: Number(fileIndexStr),
      };
    });

    // Determine the mapping entry corresponding to the current PC.
    // (In practice, you may need a more sophisticated lookup if pc doesn't map directly.)
    const entry = entries[pc] || entries[entries.length - 1];

    // Now, using the file index, get the source file.
    // Assume your sources object has keys corresponding to file names.
    // For example, if your file is named "empty.s.sol":
    const sourceFile = sources["empty.s.sol"].content;

    // Compute the line number by counting newlines up to entry.start.
    const sourceUpToOffset = sourceFile.slice(0, entry.start);
    const lineNumber = sourceUpToOffset.split('\n').length;

    console.log(`At PC ${pc}: executing source line ${lineNumber}`);

    next?.();
  }
}).then(console.log)