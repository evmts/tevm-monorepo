import { assertType, describe, expect, test } from 'vitest'

import { accounts } from '~test/src/constants.js'
import { sign } from '../../accounts/utils/sign.js'
import type {
  TransactionSerializableBase,
  TransactionSerializableEIP1559,
  TransactionSerializableEIP2930,
  TransactionSerializableLegacy,
} from '../../types/transaction.js'
import { toHex } from '../encoding/toHex.js'
import { toRlp } from '../encoding/toRlp.js'
import { keccak256 } from '../hash/keccak256.js'
import { parseEther } from '../unit/parseEther.js'
import { parseGwei } from '../unit/parseGwei.js'

import {
  parseAccessList,
  parseTransaction,
  toTransactionArray,
} from './parseTransaction.js'
import { serializeTransaction } from './serializeTransaction.js'

const base = {
  to: accounts[1].address,
  nonce: 785,
  value: parseEther('1'),
} satisfies TransactionSerializableBase

describe('eip1559', () => {
  const baseEip1559 = {
    ...base,
    chainId: 1,
    maxFeePerGas: parseGwei('2'),
    maxPriorityFeePerGas: parseGwei('2'),
  }

  test('default', () => {
    const serialized = serializeTransaction(baseEip1559)
    const transaction = parseTransaction(serialized)
    assertType<TransactionSerializableEIP1559>(transaction)
    expect(transaction).toEqual({ ...baseEip1559, type: 'eip1559' })
  })

  test('minimal', () => {
    const args = {
      chainId: 1,
      maxFeePerGas: 1n,
    }
    const serialized = serializeTransaction(args)
    expect(parseTransaction(serialized)).toEqual({ ...args, type: 'eip1559' })
  })

  test('args: gas', () => {
    const args = {
      ...baseEip1559,
      gas: 21001n,
    }
    const serialized = serializeTransaction(args)
    expect(parseTransaction(serialized)).toEqual({ ...args, type: 'eip1559' })
  })

  test('args: accessList', () => {
    const args = {
      ...baseEip1559,
      accessList: [
        {
          address: '0x0000000000000000000000000000000000000000',
          storageKeys: [
            '0x0000000000000000000000000000000000000000000000000000000000000001',
            '0x60fdd29ff912ce880cd3edaf9f932dc61d3dae823ea77e0323f94adb9f6a72fe',
          ],
        },
      ],
    } satisfies TransactionSerializableEIP1559
    const serialized = serializeTransaction(args)
    expect(parseTransaction(serialized)).toEqual({ ...args, type: 'eip1559' })
  })

  test('args: data', () => {
    const args = {
      ...baseEip1559,
      data: '0x1234',
    } satisfies TransactionSerializableEIP1559
    const serialized = serializeTransaction(args)
    expect(parseTransaction(serialized)).toEqual({ ...args, type: 'eip1559' })
  })

  test('signed', async () => {
    const signature = await sign({
      hash: keccak256(serializeTransaction(baseEip1559)),
      privateKey: accounts[0].privateKey,
    })
    const serialized = serializeTransaction(baseEip1559, signature)
    expect(parseTransaction(serialized)).toEqual({
      ...baseEip1559,
      ...signature,
      type: 'eip1559',
      yParity: 1,
    })
  })

  describe('raw', () => {
    test('default', () => {
      const serialized = `0x02${toRlp([
        toHex(1), // chainId
        toHex(0), // nonce
        toHex(1), // maxPriorityFeePerGas
        toHex(1), // maxFeePerGas
        toHex(1), // gas
        '0x0000000000000000000000000000000000000000', // to
        toHex(0), // value
        '0x', // data
        '0x', // accessList
      ]).slice(2)}` as const
      expect(parseTransaction(serialized)).toMatchInlineSnapshot(`
        {
          "chainId": 1,
          "gas": 1n,
          "maxFeePerGas": 1n,
          "maxPriorityFeePerGas": 1n,
          "nonce": 0,
          "to": "0x0000000000000000000000000000000000000000",
          "type": "eip1559",
          "value": 0n,
        }
      `)
    })

    test('empty sig', () => {
      const serialized = `0x02${toRlp([
        toHex(1), // chainId
        toHex(0), // nonce
        toHex(1), // maxPriorityFeePerGas
        toHex(1), // maxFeePerGas
        toHex(1), // gas
        '0x0000000000000000000000000000000000000000', // to
        toHex(0), // value
        '0x', // data
        '0x', // accessList
        '0x', // r
        '0x', // v
        '0x', // s
      ]).slice(2)}` as const
      expect(parseTransaction(serialized)).toMatchInlineSnapshot(`
        {
          "chainId": 1,
          "gas": 1n,
          "maxFeePerGas": 1n,
          "maxPriorityFeePerGas": 1n,
          "nonce": 0,
          "r": "0x0000000000000000000000000000000000000000000000000000000000000000",
          "s": "0x0000000000000000000000000000000000000000000000000000000000000000",
          "to": "0x0000000000000000000000000000000000000000",
          "type": "eip1559",
          "v": 27n,
          "value": 0n,
          "yParity": 0,
        }
      `)
    })

    test('low sig coords', () => {
      const serialized = `0x02${toRlp([
        toHex(1), // chainId
        toHex(0), // nonce
        toHex(1), // maxPriorityFeePerGas
        toHex(1), // maxFeePerGas
        toHex(1), // gas
        '0x0000000000000000000000000000000000000000', // to
        toHex(0), // value
        '0x', // data
        '0x', // accessList
        '0x', // r
        toHex(69), // v
        toHex(420), // s
      ]).slice(2)}` as const
      expect(parseTransaction(serialized)).toMatchInlineSnapshot(`
        {
          "chainId": 1,
          "gas": 1n,
          "maxFeePerGas": 1n,
          "maxPriorityFeePerGas": 1n,
          "nonce": 0,
          "r": "0x0000000000000000000000000000000000000000000000000000000000000045",
          "s": "0x00000000000000000000000000000000000000000000000000000000000001a4",
          "to": "0x0000000000000000000000000000000000000000",
          "type": "eip1559",
          "v": 27n,
          "value": 0n,
          "yParity": 0,
        }
      `)
    })
  })

  describe('errors', () => {
    test('invalid access list (invalid address)', () => {
      expect(() =>
        parseTransaction(
          `0x02${toRlp([
            toHex(1), // chainId
            toHex(0), // nonce
            toHex(1), // maxPriorityFeePerGas
            toHex(1), // maxFeePerGas
            toHex(1), // gas
            '0x0000000000000000000000000000000000000000', // to
            toHex(0), // value
            '0x', // data
            [
              [
                '0x',
                [
                  '0x0000000000000000000000000000000000000000000000000000000000000001',
                ],
              ],
            ], // accessList
          ]).slice(2)}`,
        ),
      ).toThrowErrorMatchingInlineSnapshot(`
        "Address \\"0x\\" is invalid.

        Version: viem@1.0.2"
      `)

      expect(() =>
        parseTransaction(
          `0x02${toRlp([
            toHex(1), // chainId
            toHex(0), // nonce
            toHex(1), // maxPriorityFeePerGas
            toHex(1), // maxFeePerGas
            toHex(1), // gas
            '0x0000000000000000000000000000000000000000', // to
            toHex(0), // value
            '0x', // data
            [['0x123456', ['0x0']]], // accessList
          ]).slice(2)}`,
        ),
      ).toThrowErrorMatchingInlineSnapshot(`
        "Address \\"0x123456\\" is invalid.

        Version: viem@1.0.2"
      `)
    })

    test('invalid transaction (all missing)', () => {
      expect(() =>
        parseTransaction(`0x02${toRlp([]).slice(2)}`),
      ).toThrowErrorMatchingInlineSnapshot(`
        "Invalid serialized transaction of type \\"eip1559\\" was provided.

        Serialized Transaction: \\"0x02c0\\"
        Missing Attributes: chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gas, to, value, data, accessList

        Version: viem@1.0.2"
      `)
    })

    test('invalid transaction (some missing)', () => {
      expect(() =>
        parseTransaction(`0x02${toRlp(['0x0', '0x1']).slice(2)}`),
      ).toThrowErrorMatchingInlineSnapshot(`
        "Invalid serialized transaction of type \\"eip1559\\" was provided.

        Serialized Transaction: \\"0x02c20001\\"
        Missing Attributes: maxPriorityFeePerGas, maxFeePerGas, gas, to, value, data, accessList

        Version: viem@1.0.2"
      `)
    })

    test('invalid transaction (missing signature)', () => {
      expect(() =>
        parseTransaction(
          `0x02${toRlp([
            '0x',
            '0x',
            '0x',
            '0x',
            '0x',
            '0x',
            '0x',
            '0x',
            '0x',
            '0x',
          ]).slice(2)}`,
        ),
      ).toThrowErrorMatchingInlineSnapshot(`
        "Invalid serialized transaction of type \\"eip1559\\" was provided.

        Serialized Transaction: \\"0x02ca80808080808080808080\\"
        Missing Attributes: r, s

        Version: viem@1.0.2"
      `)
    })
  })
})

describe('eip2930', () => {
  const baseEip2930 = {
    ...base,
    chainId: 1,
    accessList: [
      {
        address: '0x1234512345123451234512345123451234512345',
        storageKeys: [
          '0x60fdd29ff912ce880cd3edaf9f932dc61d3dae823ea77e0323f94adb9f6a72fe',
        ],
      },
    ],
    gasPrice: parseGwei('2'),
  } as TransactionSerializableEIP2930

  test('default', () => {
    const serialized = serializeTransaction(baseEip2930)
    const transaction = parseTransaction(serialized)
    assertType<TransactionSerializableEIP2930>(transaction)
    expect(transaction).toEqual({ ...baseEip2930, type: 'eip2930' })
  })

  test('minimal', () => {
    const args = {
      chainId: 1,
      gasPrice: 1n,
      accessList: [
        {
          address: '0x0000000000000000000000000000000000000000',
          storageKeys: [
            '0x0000000000000000000000000000000000000000000000000000000000000001',
          ],
        },
      ],
    } satisfies TransactionSerializableEIP2930
    const serialized = serializeTransaction(args)
    expect(parseTransaction(serialized)).toEqual({ ...args, type: 'eip2930' })
  })

  test('args: gas', () => {
    const args = {
      ...baseEip2930,
      gas: 21001n,
    } satisfies TransactionSerializableEIP2930
    const serialized = serializeTransaction(args)
    expect(parseTransaction(serialized)).toEqual({ ...args, type: 'eip2930' })
  })

  test('args: data', () => {
    const args = {
      ...baseEip2930,
      data: '0x1234',
    } satisfies TransactionSerializableEIP2930
    const serialized = serializeTransaction(args)
    expect(parseTransaction(serialized)).toEqual({ ...args, type: 'eip2930' })
  })

  test('args: data', () => {
    const args = {
      ...baseEip2930,
      data: '0x1234',
    } satisfies TransactionSerializableEIP2930
    const serialized = serializeTransaction(args)
    expect(parseTransaction(serialized)).toEqual({ ...args, type: 'eip2930' })
  })

  test('signed', async () => {
    const signature = await sign({
      hash: keccak256(serializeTransaction(baseEip2930)),
      privateKey: accounts[0].privateKey,
    })
    const serialized = serializeTransaction(baseEip2930, signature)
    expect(parseTransaction(serialized)).toEqual({
      ...baseEip2930,
      ...signature,
      type: 'eip2930',
      yParity: 1,
    })
  })

  describe('errors', () => {
    test('invalid transaction (all missing)', () => {
      expect(() =>
        parseTransaction(`0x01${toRlp([]).slice(2)}`),
      ).toThrowErrorMatchingInlineSnapshot(`
        "Invalid serialized transaction of type \\"eip2930\\" was provided.

        Serialized Transaction: \\"0x01c0\\"
        Missing Attributes: chainId, nonce, gasPrice, gas, to, value, data, accessList

        Version: viem@1.0.2"
      `)
    })

    test('invalid transaction (some missing)', () => {
      expect(() =>
        parseTransaction(`0x01${toRlp(['0x0', '0x1']).slice(2)}`),
      ).toThrowErrorMatchingInlineSnapshot(`
        "Invalid serialized transaction of type \\"eip2930\\" was provided.

        Serialized Transaction: \\"0x01c20001\\"
        Missing Attributes: gasPrice, gas, to, value, data, accessList

        Version: viem@1.0.2"
      `)
    })

    test('invalid transaction (missing signature)', () => {
      expect(() =>
        parseTransaction(
          `0x01${toRlp([
            '0x',
            '0x',
            '0x',
            '0x',
            '0x',
            '0x',
            '0x',
            '0x',
            '0x',
          ]).slice(2)}`,
        ),
      ).toThrowErrorMatchingInlineSnapshot(`
        "Invalid serialized transaction of type \\"eip2930\\" was provided.

        Serialized Transaction: \\"0x01c9808080808080808080\\"
        Missing Attributes: r, s

        Version: viem@1.0.2"
      `)
    })
  })
})

describe('legacy', () => {
  const baseLegacy = {
    ...base,
    gasPrice: parseGwei('2'),
  }

  test('default', () => {
    const serialized = serializeTransaction(baseLegacy)
    const transaction = parseTransaction(serialized)
    assertType<TransactionSerializableLegacy>(transaction)
    expect(transaction).toEqual({ ...baseLegacy, type: 'legacy' })
  })

  test('args: gas', () => {
    const args = {
      ...baseLegacy,
      gas: 21001n,
    }
    const serialized = serializeTransaction(args)
    expect(parseTransaction(serialized)).toEqual({ ...args, type: 'legacy' })
  })

  test('args: data', () => {
    const args = {
      ...baseLegacy,
      data: '0x1234',
    } satisfies TransactionSerializableLegacy
    const serialized = serializeTransaction(args)
    expect(parseTransaction(serialized)).toEqual({ ...args, type: 'legacy' })
  })

  test('args: chainId', () => {
    const args = {
      ...baseLegacy,
      chainId: 69,
    } satisfies TransactionSerializableLegacy
    const serialized = serializeTransaction(args)
    expect(parseTransaction(serialized)).toEqual({ ...args, type: 'legacy' })
  })

  test('signed', async () => {
    const signature = await sign({
      hash: keccak256(serializeTransaction(baseLegacy)),
      privateKey: accounts[0].privateKey,
    })
    const serialized = serializeTransaction(baseLegacy, signature)
    expect(parseTransaction(serialized)).toEqual({
      ...baseLegacy,
      ...signature,
      type: 'legacy',
    })
  })

  test('signed w/ chainId', async () => {
    const args = {
      ...baseLegacy,
      chainId: 69,
    }
    const signature = await sign({
      hash: keccak256(serializeTransaction(args)),
      privateKey: accounts[0].privateKey,
    })
    const serialized = serializeTransaction(args, signature)
    expect(parseTransaction(serialized)).toEqual({
      ...args,
      ...signature,
      type: 'legacy',
      v: 173n,
    })
  })

  describe('raw', () => {
    test('default', () => {
      const serialized = toRlp([
        toHex(0), // nonce
        toHex(1), // gasPrice
        toHex(1), // gas
        '0x0000000000000000000000000000000000000000', // to
        toHex(0), // value
        '0x', // data
      ])
      expect(parseTransaction(serialized)).toMatchInlineSnapshot(`
        {
          "gas": 1n,
          "gasPrice": 1n,
          "nonce": 0,
          "to": "0x0000000000000000000000000000000000000000",
          "type": "legacy",
          "value": 0n,
        }
      `)
    })

    test('empty sig', () => {
      const serialized = toRlp([
        toHex(0), // nonce
        toHex(1), // gasPrice
        toHex(1), // gas
        '0x0000000000000000000000000000000000000000', // to
        toHex(0), // value
        '0x', // data
        '0x', // v
        '0x', // r
        '0x', // s
      ])
      expect(parseTransaction(serialized)).toMatchInlineSnapshot(`
        {
          "gas": 1n,
          "gasPrice": 1n,
          "nonce": 0,
          "to": "0x0000000000000000000000000000000000000000",
          "type": "legacy",
          "value": 0n,
        }
      `)
    })

    test('low sig coords', () => {
      const serialized = toRlp([
        toHex(0), // nonce
        toHex(1), // gasPrice
        toHex(1), // gas
        '0x0000000000000000000000000000000000000000', // to
        toHex(0), // value
        '0x', // data
        '0x1b', // v
        toHex(69), // r
        toHex(420), // s
      ])
      expect(parseTransaction(serialized)).toMatchInlineSnapshot(`
        {
          "gas": 1n,
          "gasPrice": 1n,
          "nonce": 0,
          "r": "0x45",
          "s": "0x01a4",
          "to": "0x0000000000000000000000000000000000000000",
          "type": "legacy",
          "v": 27n,
          "value": 0n,
        }
      `)
    })
  })

  describe('errors', () => {
    test('invalid transaction (all missing)', () => {
      expect(() =>
        parseTransaction(toRlp([])),
      ).toThrowErrorMatchingInlineSnapshot(`
        "Invalid serialized transaction of type \\"legacy\\" was provided.

        Serialized Transaction: \\"0xc0\\"
        Missing Attributes: nonce, gasPrice, gas, to, value, data

        Version: viem@1.0.2"
      `)
    })

    test('invalid transaction (some missing)', () => {
      expect(() =>
        parseTransaction(toRlp(['0x0', '0x1'])),
      ).toThrowErrorMatchingInlineSnapshot(`
        "Invalid serialized transaction of type \\"legacy\\" was provided.

        Serialized Transaction: \\"0xc20001\\"
        Missing Attributes: gas, to, value, data

        Version: viem@1.0.2"
      `)
    })

    test('invalid transaction (missing signature)', () => {
      expect(() =>
        parseTransaction(toRlp(['0x', '0x', '0x', '0x', '0x', '0x', '0x'])),
      ).toThrowErrorMatchingInlineSnapshot(`
        "Invalid serialized transaction of type \\"legacy\\" was provided.

        Serialized Transaction: \\"0xc780808080808080\\"
        Missing Attributes: r, s

        Version: viem@1.0.2"
      `)
    })

    test('invalid transaction (attribute overload)', () => {
      expect(() =>
        parseTransaction(
          toRlp(['0x', '0x', '0x', '0x', '0x', '0x', '0x', '0x', '0x', '0x']),
        ),
      ).toThrowErrorMatchingInlineSnapshot(`
        "Invalid serialized transaction of type \\"legacy\\" was provided.

        Serialized Transaction: \\"0xca80808080808080808080\\"

        Version: viem@1.0.2"
      `)
    })

    test('invalid v', () => {
      expect(() =>
        parseTransaction(
          toRlp([
            toHex(0), // nonce
            toHex(1), // gasPrice
            toHex(1), // gas
            '0x0000000000000000000000000000000000000000', // to
            toHex(0), // value
            '0x', // data
            '0x', // v
            toHex(69), // r
            toHex(420), // s
          ]),
        ),
      ).toThrowErrorMatchingInlineSnapshot(`
        "Invalid \`v\` value \\"0\\". Expected 27 or 28.

        Version: viem@1.0.2"
      `)

      expect(() =>
        parseTransaction(
          toRlp([
            toHex(0), // nonce
            toHex(1), // gasPrice
            toHex(1), // gas
            '0x0000000000000000000000000000000000000000', // to
            toHex(0), // value
            '0x', // data
            toHex(35), // v
            toHex(69), // r
            toHex(420), // s
          ]),
        ),
      ).toThrowErrorMatchingInlineSnapshot(`
        "Invalid \`v\` value \\"35\\". Expected 27 or 28.

        Version: viem@1.0.2"
      `)
    })
  })
})

describe('errors', () => {
  test('invalid transaction', () => {
    expect(() => parseTransaction('0x')).toThrowErrorMatchingInlineSnapshot(
      `
      "Serialized transaction type \\"0x\\" is invalid.

      Version: viem@1.0.2"
    `,
    )
  })

  test('invalid transaction', () => {
    expect(() => parseTransaction('0x03')).toThrowErrorMatchingInlineSnapshot(
      `
      "Serialized transaction type \\"0x03\\" is invalid.

      Version: viem@1.0.2"
    `,
    )
  })
})

test('toTransactionArray', () => {
  expect(
    toTransactionArray(
      serializeTransaction({
        ...base,
        chainId: 1,
        maxFeePerGas: 1n,
        maxPriorityFeePerGas: 1n,
      }),
    ),
  ).toMatchInlineSnapshot(`
    [
      "0x01",
      "0x0311",
      "0x01",
      "0x01",
      "0x",
      "0x70997970c51812dc3a010c7d01b50e0d17dc79c8",
      "0x0de0b6b3a7640000",
      "0x",
      [],
    ]
  `)
})

test('parseAccessList', () => {
  expect(
    parseAccessList([
      [
        '0x1234512345123451234512345123451234512345',
        [
          '0x1234512345123451234512345123451234512345',
          '0x1234512345123451234512345123451234512345',
        ],
      ],
    ]),
  ).toMatchInlineSnapshot(`
    [
      {
        "address": "0x1234512345123451234512345123451234512345",
        "storageKeys": [
          "0x1234512345123451234512345123451234512345",
          "0x1234512345123451234512345123451234512345",
        ],
      },
    ]
  `)
})
