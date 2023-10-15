import { expect, test } from 'vitest'

import type {
  TransactionRequest,
  TransactionRequestEIP1559,
  TransactionRequestEIP2930,
  TransactionRequestLegacy,
} from '../../types/transaction.js'

import {
  formatTransactionRequest,
  rpcTransactionType,
} from './transactionRequest.js'

const base: TransactionRequest = {
  data: '0x1',
  from: '0x1',
  gas: 69420420n,
  nonce: 1,
  to: '0x1',
  value: 1n,
}

test('legacy transaction', () => {
  expect(
    formatTransactionRequest({
      ...base,
      gasPrice: 69n,
      type: 'legacy',
    } as TransactionRequestLegacy),
  ).toMatchInlineSnapshot(`
    {
      "data": "0x1",
      "from": "0x1",
      "gas": "0x4234584",
      "gasPrice": "0x45",
      "maxFeePerGas": undefined,
      "maxPriorityFeePerGas": undefined,
      "nonce": "0x1",
      "to": "0x1",
      "type": "0x0",
      "value": "0x1",
    }
  `)
})

test('eip2930 transaction', () => {
  expect(
    formatTransactionRequest({
      ...base,
      accessList: [
        {
          address: '0x1',
          storageKeys: ['0x1'],
        },
      ],
      gasPrice: 69n,
      type: 'eip2930',
    } as TransactionRequestEIP2930),
  ).toMatchInlineSnapshot(`
    {
      "accessList": [
        {
          "address": "0x1",
          "storageKeys": [
            "0x1",
          ],
        },
      ],
      "data": "0x1",
      "from": "0x1",
      "gas": "0x4234584",
      "gasPrice": "0x45",
      "maxFeePerGas": undefined,
      "maxPriorityFeePerGas": undefined,
      "nonce": "0x1",
      "to": "0x1",
      "type": "0x1",
      "value": "0x1",
    }
  `)
})

test('eip1559 transaction', () => {
  expect(
    formatTransactionRequest({
      ...base,
      accessList: [
        {
          address: '0x1',
          storageKeys: ['0x1'],
        },
      ],
      maxFeePerGas: 69n,
      maxPriorityFeePerGas: 69n,
      type: 'eip1559',
    } as TransactionRequestEIP1559),
  ).toMatchInlineSnapshot(`
    {
      "accessList": [
        {
          "address": "0x1",
          "storageKeys": [
            "0x1",
          ],
        },
      ],
      "data": "0x1",
      "from": "0x1",
      "gas": "0x4234584",
      "gasPrice": undefined,
      "maxFeePerGas": "0x45",
      "maxPriorityFeePerGas": "0x45",
      "nonce": "0x1",
      "to": "0x1",
      "type": "0x2",
      "value": "0x1",
    }
  `)
})

test('nullish gas', () => {
  expect(
    formatTransactionRequest({
      ...base,
      gas: undefined,
    }),
  ).toMatchInlineSnapshot(`
    {
      "data": "0x1",
      "from": "0x1",
      "gas": undefined,
      "gasPrice": undefined,
      "maxFeePerGas": undefined,
      "maxPriorityFeePerGas": undefined,
      "nonce": "0x1",
      "to": "0x1",
      "type": undefined,
      "value": "0x1",
    }
  `)
})

test('nullish gasPrice', () => {
  expect(
    formatTransactionRequest({
      ...base,
      gasPrice: undefined,
    }),
  ).toMatchInlineSnapshot(`
    {
      "data": "0x1",
      "from": "0x1",
      "gas": "0x4234584",
      "gasPrice": undefined,
      "maxFeePerGas": undefined,
      "maxPriorityFeePerGas": undefined,
      "nonce": "0x1",
      "to": "0x1",
      "type": undefined,
      "value": "0x1",
    }
  `)
})

test('nullish maxFeePerGas', () => {
  expect(
    formatTransactionRequest({
      ...base,
      maxFeePerGas: undefined,
    }),
  ).toMatchInlineSnapshot(`
    {
      "data": "0x1",
      "from": "0x1",
      "gas": "0x4234584",
      "gasPrice": undefined,
      "maxFeePerGas": undefined,
      "maxPriorityFeePerGas": undefined,
      "nonce": "0x1",
      "to": "0x1",
      "type": undefined,
      "value": "0x1",
    }
  `)
})

test('nullish maxPriorityFeePerGas', () => {
  expect(
    formatTransactionRequest({
      ...base,
      maxPriorityFeePerGas: undefined,
    }),
  ).toMatchInlineSnapshot(`
    {
      "data": "0x1",
      "from": "0x1",
      "gas": "0x4234584",
      "gasPrice": undefined,
      "maxFeePerGas": undefined,
      "maxPriorityFeePerGas": undefined,
      "nonce": "0x1",
      "to": "0x1",
      "type": undefined,
      "value": "0x1",
    }
  `)
})

test('nullish nonce', () => {
  expect(
    formatTransactionRequest({
      ...base,
      nonce: undefined,
    }),
  ).toMatchInlineSnapshot(`
    {
      "data": "0x1",
      "from": "0x1",
      "gas": "0x4234584",
      "gasPrice": undefined,
      "maxFeePerGas": undefined,
      "maxPriorityFeePerGas": undefined,
      "nonce": undefined,
      "to": "0x1",
      "type": undefined,
      "value": "0x1",
    }
  `)
})

test('nullish value', () => {
  expect(
    formatTransactionRequest({
      ...base,
      value: undefined,
    }),
  ).toMatchInlineSnapshot(`
    {
      "data": "0x1",
      "from": "0x1",
      "gas": "0x4234584",
      "gasPrice": undefined,
      "maxFeePerGas": undefined,
      "maxPriorityFeePerGas": undefined,
      "nonce": "0x1",
      "to": "0x1",
      "type": undefined,
      "value": undefined,
    }
  `)
})

test('rpcTransactionType', () => {
  expect(rpcTransactionType).toMatchInlineSnapshot(`
    {
      "eip1559": "0x2",
      "eip2930": "0x1",
      "legacy": "0x0",
    }
  `)
})
