import { expect, test } from 'vitest'

import { BaseError } from './base.js'

test('BaseError', () => {
  expect(new BaseError('An error occurred.')).toMatchInlineSnapshot(`
    [ViemError: An error occurred.

    Version: viem@1.0.2]
  `)

  expect(
    new BaseError('An error occurred.', { details: 'details' }),
  ).toMatchInlineSnapshot(`
    [ViemError: An error occurred.

    Details: details
    Version: viem@1.0.2]
  `)

  expect(new BaseError('', { details: 'details' })).toMatchInlineSnapshot(`
    [ViemError: An error occurred.

    Details: details
    Version: viem@1.0.2]
  `)
})

test('BaseError (w/ docsPath)', () => {
  expect(
    new BaseError('An error occurred.', {
      details: 'details',
      docsPath: '/lol',
    }),
  ).toMatchInlineSnapshot(`
    [ViemError: An error occurred.

    Docs: https://viem.sh/lol.html
    Details: details
    Version: viem@1.0.2]
  `)
  expect(
    new BaseError('An error occurred.', {
      cause: new BaseError('error', { docsPath: '/docs' }),
    }),
  ).toMatchInlineSnapshot(`
    [ViemError: An error occurred.

    Docs: https://viem.sh/docs.html
    Version: viem@1.0.2]
  `)
  expect(
    new BaseError('An error occurred.', {
      cause: new BaseError('error'),
      docsPath: '/lol',
    }),
  ).toMatchInlineSnapshot(`
    [ViemError: An error occurred.

    Docs: https://viem.sh/lol.html
    Version: viem@1.0.2]
  `)
  expect(
    new BaseError('An error occurred.', {
      details: 'details',
      docsPath: '/lol',
      docsSlug: 'test',
    }),
  ).toMatchInlineSnapshot(`
    [ViemError: An error occurred.

    Docs: https://viem.sh/lol.html#test
    Details: details
    Version: viem@1.0.2]
  `)
})

test('BaseError (w/ metaMessages)', () => {
  expect(
    new BaseError('An error occurred.', {
      details: 'details',
      metaMessages: ['Reason: idk', 'Cause: lol'],
    }),
  ).toMatchInlineSnapshot(`
    [ViemError: An error occurred.

    Reason: idk
    Cause: lol

    Details: details
    Version: viem@1.0.2]
  `)
})

test('inherited BaseError', () => {
  const err = new BaseError('An error occurred.', {
    details: 'details',
    docsPath: '/lol',
  })
  expect(
    new BaseError('An internal error occurred.', {
      cause: err,
    }),
  ).toMatchInlineSnapshot(`
    [ViemError: An internal error occurred.

    Docs: https://viem.sh/lol.html
    Details: details
    Version: viem@1.0.2]
  `)
})

test('inherited Error', () => {
  const err = new Error('details')
  expect(
    new BaseError('An internal error occurred.', {
      cause: err,
      docsPath: '/lol',
    }),
  ).toMatchInlineSnapshot(`
    [ViemError: An internal error occurred.

    Docs: https://viem.sh/lol.html
    Details: details
    Version: viem@1.0.2]
  `)
})

test('walk: no predicate fn (walks to leaf)', () => {
  class FooError extends BaseError {}
  class BarError extends BaseError {}

  const err = new BaseError('test1', {
    cause: new FooError('test2', { cause: new BarError('test3') }),
  })
  expect(err.walk()).toMatchInlineSnapshot(`
    [ViemError: test3

    Version: viem@1.0.2]
  `)
})

test('walk: predicate fn', () => {
  class FooError extends BaseError {}
  class BarError extends BaseError {}

  const err = new BaseError('test1', {
    cause: new FooError('test2', { cause: new BarError('test3') }),
  })
  expect(err.walk((err) => err instanceof FooError)).toMatchInlineSnapshot(`
    [ViemError: test2

    Version: viem@1.0.2]
  `)
})

test('walk: predicate fn (no match)', () => {
  class FooError extends BaseError {}
  class BarError extends BaseError {}

  const err = new BaseError('test1', {
    cause: new Error('test2', { cause: new BarError('test3') }),
  })
  expect(err.walk((err) => err instanceof FooError)).toBeNull()
})
