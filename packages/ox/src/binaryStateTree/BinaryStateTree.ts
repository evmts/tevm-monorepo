import { Effect } from 'effect'
import Ox from 'ox'

// Export the core types
export type BinaryStateTree = Ox.BinaryStateTree.BinaryStateTree

/**
 * Error class for create function
 */
export class CreateError extends Error {
  override name = "CreateError"
  _tag = "CreateError"
  constructor(cause: unknown) {
    super("Unexpected error creating BinaryStateTree with ox", {
      cause: cause instanceof Error ? cause : undefined,
    })
  }
}

/**
 * Creates a new BinaryStateTree
 */
export function create(): Effect.Effect<Ox.BinaryStateTree.BinaryStateTree, CreateError, never> {
  return Effect.try({
    try: () => Ox.BinaryStateTree.create(),
    catch: (cause) => new CreateError(cause),
  })
}

/**
 * Error class for insert function
 */
export class InsertError extends Error {
  override name = "InsertError"
  _tag = "InsertError"
  constructor(cause: unknown) {
    super("Unexpected error inserting into BinaryStateTree with ox", {
      cause: cause instanceof Error ? cause : undefined,
    })
  }
}

/**
 * Inserts a key-value pair into the Binary State Tree
 */
export function insert(
  tree: Ox.BinaryStateTree.BinaryStateTree,
  key: Ox.Bytes.Bytes,
  value: Ox.Bytes.Bytes
): Effect.Effect<void, InsertError, never> {
  return Effect.try({
    try: () => Ox.BinaryStateTree.insert(tree, key, value),
    catch: (cause) => new InsertError(cause),
  })
}

/**
 * Error class for merkelize function
 */
export class MerkelizeError extends Error {
  override name = "MerkelizeError"
  _tag = "MerkelizeError"
  constructor(cause: unknown) {
    super("Unexpected error merkelizing BinaryStateTree with ox", {
      cause: cause instanceof Error ? cause : undefined,
    })
  }
}

/**
 * Computes the Merkle root of the Binary State Tree
 */
export function merkelize(
  tree: Ox.BinaryStateTree.BinaryStateTree
): Effect.Effect<Ox.Bytes.Bytes, MerkelizeError, never> {
  return Effect.try({
    try: () => Ox.BinaryStateTree.merkelize(tree),
    catch: (cause) => new MerkelizeError(cause),
  })
}