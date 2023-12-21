import { createTevmContract } from '@tevm/contract'
import { createTevm } from '../createTevm.js'
import { DaiContract } from '../test/DaiContract.sol.js'
import { definePredeploy } from './definePredeploy.js'
import { expect, test } from 'bun:test'

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
		customPredeploys: [predeploy],
	})

	expect(
		await tevm
			.runContractCall({
				address: predeploy.address,
				...predeploy.contract.read.balanceOf(
					'0xf0d4c12a5768d806021f80a262b4d39d26c58b8d',
				),
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
