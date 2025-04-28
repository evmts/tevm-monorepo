import { Effect } from 'effect'
import Ox from 'ox'
import type { Bytes } from 'ox/Bytes'

// Export types
export type BinaryStateTree = Ox.BinaryStateTree.BinaryStateTree
export type Node = Ox.BinaryStateTree.Node

/**
 * Error class for create function
 */
export class CreateError extends Error {
	override name = 'CreateError'
	_tag = 'CreateError'
	constructor(cause: unknown) {
		super('Failed to create BinaryStateTree with ox', {
			cause,
		})
	}
}

/**
 * Creates a new BinaryStateTree
 * @returns An Effect that succeeds with a new BinaryStateTree
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
	override name = 'InsertError'
	_tag = 'InsertError'
	constructor(cause: unknown) {
		super('Failed to insert into BinaryStateTree with ox', {
			cause,
		})
	}
}

/**
 * Inserts a key-value pair into the Binary State Tree
 * @param tree The tree to insert into
 * @param key The key to insert
 * @param value The value to insert
 * @returns An Effect that succeeds with void
 */
export function insert(
	tree: Ox.BinaryStateTree.BinaryStateTree,
	key: Bytes,
	value: Bytes,
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
	override name = 'MerkelizeError'
	_tag = 'MerkelizeError'
	constructor(cause: unknown) {
		super('Failed to merkelize BinaryStateTree with ox', {
			cause,
		})
	}
}

/**
 * Computes the Merkle root of the Binary State Tree
 * @param tree The tree to merkelize
 * @returns An Effect that succeeds with the merkle root as Bytes
 */
export function merkelize(tree: Ox.BinaryStateTree.BinaryStateTree): Effect.Effect<Bytes, MerkelizeError, never> {
	return Effect.try({
		try: () => Ox.BinaryStateTree.merkelize(tree),
		catch: (cause) => new MerkelizeError(cause),
	})
}
