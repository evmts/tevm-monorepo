import { expect, test } from 'bun:test'
import { EVMts } from '../evmts.js'

import { fsPrecompile } from './FsPrecompile.js'
import { existsSync, rmSync } from 'fs'

test('Call precompile from TypeScript', async () => {
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
})

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

