import { expect, test } from 'bun:test'
import { createTevm } from '../createTevm.js'
import { definePredeploy } from './definePredeploy.js'
import { DaiContract } from '../test/DaiContract.sol.js'
import { createTevmContract } from '@tevm/contract'

test('Call predeploy from TypeScript', async () => {
	const { abi, deployedBytecode } = DaiContract

	const predeploy = definePredeploy({
		address: `0x${'0420'.repeat(10)}`,
		contract: createTevmContract({
			abi,
			deployedBytecode,
			name: 'ExamplePredeploy',
		}),
	})

	const tevm = await createTevm({
		predeploys: [predeploy],
	})

	expect(
		await tevm
			.runContractCall({
				address: predeploy.address,
				...predeploy.contract.read.exampleFunction(),
			})
			.then((res) => {
				res.data
			}),
	).toBe('return value')

	/**

  const vm = await EVMts.create({
    customPrecompiles: [fsPrecompile.precompile()]
  })

  await vm.runContractCall({
    contractAddress: fsPrecompile.address,
    ...fsPrecompile.contract.write.writeFile('test.txt', 'hello world')
  })

  expect(existsSync('test.txt')).toBe(true)
  expect(
    (await vm.runContractCall({
      contractAddress: fsPrecompile.address,
      ...fsPrecompile.contract.read.readFile('test.txt')
    })).data
  ).toBe('hello world')

  rmSync('test.txt')

  **/
})

/**
test('Call precompile from solidity script', async () => {
  const { WriteHelloWorld } = await import("./WriteHelloWorld.s.sol")

  const vm = await EVMts.create({
    customPrecompiles: [fsPrecompile.precompile()]
  })

  await vm.runScript(
    WriteHelloWorld.write.write(fsPrecompile.address)
  )

  expect(existsSync('test.txt')).toBe(true)

  rmSync('test.txt')
})

*/
