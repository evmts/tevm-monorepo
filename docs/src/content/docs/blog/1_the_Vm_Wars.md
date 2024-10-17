---
title: "Rollup Wars 1: The VM Wars"
description: "Exploring the competition between different scaling solutions in Ethereum's Layer 2 ecosystem."
date: 2023-10-10
author: "Your Name"
---

# Rollup Wars 1: The VM Wars

## Welcome to the Rollup Wars

The "Rollup Wars" describe the dynamic competition among scaling solutions vying to become the leading technology for scaling Ethereum. Rollups have been among the fastest-growing chains in the industry, and the battle to be the dominant solution has created fascinating, fierce, high-stakes competition.

In this installment, we delve into the virtual machine (VM) wars, the initial battleground that birthed the rollups we know today. We'll explore what a rollup is, why the VM wars were pivotal to their early success, and what the future might hold.

This document is a living resource. Contributions to enrich content, correct inaccuracies, or update with new developments are welcome.

## Rollups: A Permissionlessly Derived Layer 2

Layer 2 solutions are built on top of host chains, primarily Ethereum, to enhance computational throughput and reduce costs while preserving security and decentralization. Bedrock (Optimism) and Nitro (Arbitrum) are two leading L2 solutions for Ethereum.

These solutions are modular EVM-Equivalent rollups, executing Ethereum’s virtual machine to ensure compatibility. They compress and batch transactions off-chain, then post the data back to Ethereum, where the host chain stores it without execution. L2 nodes, operated by anyone, independently derive the rollup’s state.

## Rollups Defined by Derivation

Before proceeding, let's clarify some key terms:

- **Layer 2 (L2)**: A state machine running on a host chain, akin to a minigame within a larger video game.
- **Modular**: A system broken into smaller, interchangeable components, like LEGO bricks or universal electrical plugs.
- **EVM-Equivalence**: Emulating Ethereum’s programming environment within a virtual state machine, providing a seamless experience for developers and users.
- **Rollups**: L2 solutions that scale by batching transactions and relying on off-chain state derivation.
- **Batching**: Compressing multiple transactions into one, reducing costs and increasing system throughput.
- **Off-chain State Derivation**: Permissionlessly deriving a rollup's state from data posted to the L1 host chain using an "L2 Node," similar to a console reading a game cartridge.

## Rollups Are Not Inherently Proof Systems

A common misconception about rollups is that their state is proven via fault or zk proofs. Instead, rollups, like Ethereum, utilize various nodes, with the Full L2 Node being crucial. To obtain an L2 rollup's state, one runs an L2 Node to calculate it. This process resembles a console reading a cartridge: the L2 Node verifies that the data (cartridge) is securely from Ethereum. Once verified, the node can independently derive or verify the state without additional proofs.

L2 Nodes are analogous to Ethereum's Full Nodes. In Part 2, we'll discuss a special type of light client node capable of running on other chains, like Ethereum, without losing the scaling benefits of off-chain derivation. These light clients, known as Optimistic and ZK withdrawal bridges, are not essential for building a rollup but are highly desirable for reasons we'll explore.

### Key Takeaways:
- **Rollup State Derivation**: Rollups post minimal data for L2 nodes to independently execute and derive the rollup's state.
- **L2 Node**: Software for executing and deriving the L2 state.
- **Withdrawal Bridges**: Optional light clients to be discussed in the next section.

## Let's Build a Rollup: The NFL Picks Example

To better understand how a rollup functions, let's design a simple, app-specific rollup that tracks NFL picks. This example will illustrate the core principles of rollups in a relatable context.

### The Concept

Imagine a group of friends who love predicting NFL game outcomes. They decide to use a rollup to track their picks and determine the winner each week. Here's how it works:

1. **Smart Contract on Ethereum**: The foundation of our rollup is a smart contract deployed on Ethereum. This contract hosts the app rollup, ensuring that all operations are transparent and secure.

2. **Making Picks**: Every Saturday, each participant selects their predicted winners for the upcoming NFL games. They share their picks in a group Discord channel, accompanied by a cryptographic signature that proves they made their selections for that specific week.

3. **Data Compression and Storage**: The group leader collects all the picks, compresses the data, and submits it to Ethereum in a single batch. This process reduces costs and ensures that the data is securely stored on the blockchain.

4. **L2 Rollup Node**: The rollup node is essentially a simple spreadsheet. It requests data from a specified L1 Ethereum node to calculate the weekly winner based on the picks. This node can be run by anyone, allowing for permissionless verification of results.

5. **Verifying Results**: If someone disputes the results, they can independently run the L2 rollup node to verify the data. This transparency ensures that any attempt to falsify results can be easily exposed, assuming everyone agrees on the actual NFL game outcomes.

6. **Censorship Resistance**: To prevent censorship, the system allows any participant to batch and post their picks directly to L1, even if the current batcher attempts to censor them. This feature ensures that the rollup remains open and fair to all participants.

7. **Gas Savings**: By relying on each member to calculate the game results off-chain, the rollup significantly reduces gas costs. Instead of executing and deriving results directly on Ethereum, participants perform these computations independently, saving on transaction fees.

### Key Takeaways

- **Decentralization and Transparency**: The rollup leverages Ethereum's security and transparency, allowing anyone to verify the data and results.
- **Cost Efficiency**: By batching transactions and performing off-chain computations, the rollup reduces costs while maintaining the integrity of the data.
- **Censorship Resistance**: The ability for anyone to post their picks ensures that the system remains open and fair.

This simple NFL picks rollup exemplifies the principles discussed earlier in this article, demonstrating how rollups can be used to create efficient, transparent, and decentralized applications.

## Why EVM-Equivalence Matters

Why are most rollups EVM-Equivalent? The answer lies in compatibility, developer adoption, and ecosystem integration:

- **Compatibility**: EVM-Equivalent rollups mirror Ethereum’s virtual machine, ensuring seamless operation of existing smart contracts, dapps, and tools on Layer 2.
- **Developer Adoption**: Familiarity with Ethereum allows developers to easily transition to or build on these rollups without learning new technologies, lowering barriers to entry.
- **Auditability**: Leveraging the EVM means existing auditing and security research applies to rollup contracts.
- **Infrastructure**: EVM-Equivalent rollups quickly achieve tooling maturity by reusing Ethereum's existing tools, whereas bespoke VMs face slower infrastructure development.

### Key Takeaways:
- **EVM-Equivalence**: Essential for compatibility, adoption, and integration with Ethereum's ecosystem.

## Effects of the EVM Wars Today

Focusing on EVM-Equivalence has profoundly impacted the rollup ecosystem. Early competition among Optimism, Arbitrum, and others highlighted the importance of rapid execution and modularity:

- **Polygon**: By adopting a hybrid approach using the Cosmos SDK and developing ZK technology, Polygon captured early market share by addressing Ethereum's scaling challenges. This strategy provided a significant advantage and allowed them to work on their vision for Ethereum scaling.
- **Arbitrum**: Early engineering decisions enabled Arbitrum to launch the first stable EVM-Equivalent rollup, proving rollup design concepts before Optimism and ZK Rollup solutions.
- **Optimism**: Despite initial setbacks, Optimism upgraded their OVM to a stable, EVM-Equivalent product with Bedrock, leveraging partnerships and integrations with Base and Uniswap to expand their ecosystem.
- **ZK-Rollups**: Some rollup solutions focused on bridging, a feature we'll cover in Part 2.
- **StarkNet**: StarkNet is an exception, warranting its own installment.

Polygon emerged as the early VM wars' clear winner, followed by Arbitrum and Optimism. Success depended on addressing Ethereum's scaling issues while aligning with a decentralized and secure Ethereum vision. Polygon's foresight to prioritize market entry, even without a rollup, secured significant market share. Optimistic rollups OP and Arbitrum gained traction by being first with EVM-Equivalent rollup MVPs, with Arbitrum leading due to early stable product delivery.

### Key Takeaways:
- **EVM Wars Impact**: Early engineering choices and market strategies significantly influenced rollup success.
- **EVM Equivalence Importance**: EVM equivalence proved crucial for early rollup wars.

## Are the VM Wars Over or Just Dormant?

While the Rollup Wars continue on different fronts, the VM wars may not be over. Two major bets suggest EVM Equivalence isn't the final solution for L2 scaling:

- **Stylus**: Stylus integrates additional programming languages and features beyond the EVM using WASM (Web Assembly), originally built for web browsers. This large ecosystem could meet emerging needs for alternative VMs.
- **StarkNet**: StarkNet uses Cairo, its own VM, offering scalability and efficiency at the cost of EVM compatibility. We'll explore StarkNet in a future installment.
- **Solana and Move**: Growing demand for other smart contract VMs in the L2 space could shift dominance, requiring EVM-Equivalent rollups to adapt.

The VM wars may be in a lull, with EVM-Equivalent rollups currently leading. However, new developments could reignite competition, making it crucial to monitor evolving strategies and technologies.

### Key Takeaways:
- **Future of VM Wars**: Technologies like Stylus and StarkNet could challenge EVM-Equivalent rollups' dominance one day, but as of today EVM equivelance is a pretty agreed upon and universal standard striven to by all major successful rollups, [unless you are Starknet](https://www.youtube.com/watch?v=PqcVro-3f4I)

---

## Rollup Wars 2: The Battle of Bridges (Coming Soon)

In the next installment, we’ll explore the evolution and significance of rollup bridges. We'll examine how bridges became central to rollup discourse, the competition between ZK and Optimistic bridges, and their ongoing importance for scaling solutions. The battle of bridges not only defined early rollup wars but remains relevant for future L2 battles. Stay tuned.

---

## Other similar pieces

This piece is inspired heavily by the following 

- [Almost everything you need to know about optimistic rollups](https://www.paradigm.xyz/2021/01/almost-everything-you-need-to-know-about-optimistic-rollup)
- [How rollups actually work](https://www.youtube.com/watch?v=NKQz9jU0ftg)