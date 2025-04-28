import { Effect } from 'effect'
import Ox from 'ox'
import * as Address from 'ox/core/Address'
import * as Bytes from 'ox/core/Bytes'
import * as Hex from 'ox/core/Hex'

// Re-export types
export type Bloom = Ox.Bloom.Bloom

/**
 * Error thrown when creating a Bloom filter
 */
export class CreateError extends Error {
  override name = 'CreateError'
  _tag = 'CreateError'
  constructor(cause: unknown) {
    super('Error creating Bloom filter with ox', {
      cause: cause instanceof Error ? cause : undefined,
    })
  }
}

/**
 * Creates a new Bloom filter
 * 
 * @param options - Optional data to initialize the Bloom filter with
 * @returns Effect that succeeds with a new Bloom filter
 * 
 * @example
 * ```ts
 * import { Effect } from 'effect'
 * import * as Bloom from '@tevm/ox/bloom'
 * 
 * const program = Bloom.create()
 * const filter = await Effect.runPromise(program) 
 * // filter is a new empty Bloom filter
 * ```
 */
export function create(options?: { data?: Hex.Hex | Bytes.Bytes }): Effect.Effect<Bloom, CreateError, never> {
  return Effect.try({
    try: () => Ox.Bloom.create(options),
    catch: (cause) => new CreateError(cause),
  })
}

/**
 * Error thrown when adding an address to a Bloom filter
 */
export class AddAddressError extends Error {
  override name = 'AddAddressError'
  _tag = 'AddAddressError'
  constructor(cause: unknown) {
    super('Error adding address to Bloom filter with ox', {
      cause: cause instanceof Error ? cause : undefined,
    })
  }
}

/**
 * Adds an address to the Bloom filter
 * 
 * @param options - Object containing the bloom filter and the address to add
 * @returns Effect that succeeds with an updated Bloom filter
 * 
 * @example
 * ```ts
 * import { Effect } from 'effect'
 * import * as Bloom from '@tevm/ox/bloom'
 * import * as Address from 'ox/core/Address'
 * 
 * const program = Effect.gen(function* (_) {
 *   const filter = yield* _(Bloom.create())
 *   const address = Address.parse('0x1234567890123456789012345678901234567890')
 *   const updated = yield* _(Bloom.addAddress({ bloom: filter, address }))
 *   return updated
 * })
 * const updatedFilter = await Effect.runPromise(program)
 * ```
 */
export function addAddress(options: { bloom: Bloom; address: Address.Address }): Effect.Effect<Bloom, AddAddressError, never> {
  return Effect.try({
    try: () => Ox.Bloom.addAddress(options),
    catch: (cause) => new AddAddressError(cause),
  })
}

/**
 * Error thrown when adding a topic to a Bloom filter
 */
export class AddTopicError extends Error {
  override name = 'AddTopicError'
  _tag = 'AddTopicError'
  constructor(cause: unknown) {
    super('Error adding topic to Bloom filter with ox', {
      cause: cause instanceof Error ? cause : undefined,
    })
  }
}

/**
 * Adds a topic to the Bloom filter
 * 
 * @param options - Object containing the bloom filter and the topic to add
 * @returns Effect that succeeds with an updated Bloom filter
 * 
 * @example
 * ```ts
 * import { Effect } from 'effect'
 * import * as Bloom from '@tevm/ox/bloom'
 * import * as Hex from 'ox/core/Hex'
 * 
 * const program = Effect.gen(function* (_) {
 *   const filter = yield* _(Bloom.create())
 *   const topic = Hex.parse('0x1234567890123456789012345678901234567890123456789012345678901234')
 *   const updated = yield* _(Bloom.addTopic({ bloom: filter, topic }))
 *   return updated
 * })
 * const updatedFilter = await Effect.runPromise(program)
 * ```
 */
export function addTopic(options: { bloom: Bloom; topic: Hex.Hex | Bytes.Bytes }): Effect.Effect<Bloom, AddTopicError, never> {
  return Effect.try({
    try: () => Ox.Bloom.addTopic(options),
    catch: (cause) => new AddTopicError(cause),
  })
}

/**
 * Error thrown when checking if a Bloom filter has an address
 */
export class HasAddressError extends Error {
  override name = 'HasAddressError'
  _tag = 'HasAddressError'
  constructor(cause: unknown) {
    super('Error checking if Bloom filter has address with ox', {
      cause: cause instanceof Error ? cause : undefined,
    })
  }
}

/**
 * Checks if a Bloom filter has an address
 * 
 * @param options - Object containing the bloom filter and the address to check
 * @returns Effect that succeeds with a boolean indicating if the address is in the filter
 * 
 * @example
 * ```ts
 * import { Effect } from 'effect'
 * import * as Bloom from '@tevm/ox/bloom'
 * import * as Address from 'ox/core/Address'
 * 
 * const program = Effect.gen(function* (_) {
 *   const filter = yield* _(Bloom.create())
 *   const address = Address.parse('0x1234567890123456789012345678901234567890')
 *   const updated = yield* _(Bloom.addAddress({ bloom: filter, address }))
 *   const hasAddress = yield* _(Bloom.hasAddress({ bloom: updated, address }))
 *   return hasAddress // true
 * })
 * const result = await Effect.runPromise(program)
 * ```
 */
export function hasAddress(options: { bloom: Bloom; address: Address.Address }): Effect.Effect<boolean, HasAddressError, never> {
  return Effect.try({
    try: () => Ox.Bloom.hasAddress(options),
    catch: (cause) => new HasAddressError(cause),
  })
}

/**
 * Error thrown when checking if a Bloom filter has a topic
 */
export class HasTopicError extends Error {
  override name = 'HasTopicError'
  _tag = 'HasTopicError'
  constructor(cause: unknown) {
    super('Error checking if Bloom filter has topic with ox', {
      cause: cause instanceof Error ? cause : undefined,
    })
  }
}

/**
 * Checks if a Bloom filter has a topic
 * 
 * @param options - Object containing the bloom filter and the topic to check
 * @returns Effect that succeeds with a boolean indicating if the topic is in the filter
 * 
 * @example
 * ```ts
 * import { Effect } from 'effect'
 * import * as Bloom from '@tevm/ox/bloom'
 * import * as Hex from 'ox/core/Hex'
 * 
 * const program = Effect.gen(function* (_) {
 *   const filter = yield* _(Bloom.create())
 *   const topic = Hex.parse('0x1234567890123456789012345678901234567890123456789012345678901234')
 *   const updated = yield* _(Bloom.addTopic({ bloom: filter, topic }))
 *   const hasTopic = yield* _(Bloom.hasTopic({ bloom: updated, topic }))
 *   return hasTopic // true
 * })
 * const result = await Effect.runPromise(program)
 * ```
 */
export function hasTopic(options: { bloom: Bloom; topic: Hex.Hex | Bytes.Bytes }): Effect.Effect<boolean, HasTopicError, never> {
  return Effect.try({
    try: () => Ox.Bloom.hasTopic(options),
    catch: (cause) => new HasTopicError(cause),
  })
}