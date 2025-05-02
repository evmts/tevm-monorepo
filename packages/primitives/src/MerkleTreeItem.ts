import { Schema, Effect } from "effect";
import { Bytes } from "ox";
import { B256, type B256 as B256Type } from "./B256.js";
import { keccak256 } from "./Keccak256.js";

/**
 * MerkleTreeItem is a 32-byte hash used in Merkle trees
 */
export type MerkleTreeItem = B256Type;

/**
 * Schema for validating MerkleTreeItem values
 */
export const MerkleTreeItem = B256;

/**
 * Creates an empty (zero) MerkleTreeItem
 */
export const empty = (): Effect.Effect<MerkleTreeItem, Error> =>
  Effect.gen(function*(_) {
    const bytes = new Uint8Array(32).fill(0);
    return yield* _(Schema.decode(MerkleTreeItem)(bytes));
  });

/**
 * Concatenates and hashes two MerkleTreeItems to create their parent node
 * @param left - The left child.
 * @param right - The right child.
 */
export const combine = (
  left: MerkleTreeItem,
  right: MerkleTreeItem,
): Effect.Effect<MerkleTreeItem, Error> =>
  Effect.gen(function*(_) {
    // Concatenate the two items
    const combined = Bytes.concat(left, right);

    // Hash the combination
    return yield* _(keccak256(combined));
  });

/**
 * Verifies a Merkle proof for a given item and root
 * @param item - The item to verify.
 * @param proof - The proof nodes (from leaf to root).
 * @param root - The Merkle root.
 * @param index - The index of the item in the tree (for determining left/right position).
 */
export const verifyProof = (
  item: MerkleTreeItem,
  proof: MerkleTreeItem[],
  root: MerkleTreeItem,
  index: number,
): Effect.Effect<boolean, Error> =>
  Effect.gen(function*(_) {
    let currentHash = item;
    let currentIndex = index;

    // Traverse the proof nodes
    for (const proofNode of proof) {
      // Determine if the current node is on the left or right
      if (currentIndex % 2 === 0) {
        // Current node is on the left, proof node is on the right
        currentHash = yield* _(combine(currentHash, proofNode));
      } else {
        // Current node is on the right, proof node is on the left
        currentHash = yield* _(combine(proofNode, currentHash));
      }

      // Move up the tree
      currentIndex = Math.floor(currentIndex / 2);
    }

    // Check if the computed root matches the expected root
    return Bytes.isEqual(currentHash, root);
  });

/**
 * Calculates a Merkle root from a list of items
 * @param items - The leaf items in the tree.
 */
export const root = (
  items: MerkleTreeItem[],
): Effect.Effect<MerkleTreeItem, Error> =>
  Effect.gen(function*(_) {
    if (items.length === 0) {
      return yield* _(empty());
    }

    if (items.length === 1) {
      return items[0] as B256;
    }

    // Clone the array to avoid modifying the original
    let nodes = [...items];

    // Iteratively combine pairs of nodes until only the root remains
    while (nodes.length > 1) {
      const newLevel: MerkleTreeItem[] = [];

      // Process pairs of nodes
      for (let i = 0; i < nodes.length; i += 2) {
        if (i + 1 < nodes.length) {
          // Make sure both nodes exist
          const left = nodes[i];
          const right = nodes[i + 1];

          if (left && right) {
            // Combine two adjacent nodes
            const combined = yield* _(combine(left, right));
            newLevel.push(combined);
          } else if (left) {
            // Only left node exists (shouldn't happen but handle it)
            newLevel.push(left);
          }
        } else if (nodes[i]) {
          // Odd number of nodes, promote the last one to the next level
          newLevel.push(nodes[i] as B256);
        }
      }

      // Replace the current level with the new level
      nodes = newLevel;
    }

    // The root is the only node left
    if (nodes.length === 0) {
      return yield* _(empty());
    }

    return nodes[0] as B256;
  });
