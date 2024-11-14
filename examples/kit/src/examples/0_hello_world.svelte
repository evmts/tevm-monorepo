<script>
  import { contract } from "tevm/kit";
  import { writable } from "svelte/store";

  const counter = contract(Counter);

  const count = writable(0);
  const status = writable("idle"); 

  async function increment() {
    status.set("loading");
    try {
      await counter.increment();
      await updateCount();
      status.set("success");
    } catch (error) {
      console.error("Error incrementing the counter:", error);
      status.set("error");
    }
  }

  async function updateCount() {
    try {
      const currentCount = await counter.count();
      count.set(currentCount);
    } catch (error) {
      console.error("Error fetching the counter:", error);
      status.set("error");
    }
  }

  updateCount();

  $: backgroundColor = 
      $status === "loading" ? "pastelblue" :
      $status === "success" ? "pastelgreen" :
      $status === "error" ? "pastelred" : "white";
</script>

<style>
  main {
    background-color: {backgroundColor};
    transition: background-color 0.3s ease;
  }
</style>

<script type="sol">
  // SPDX-License-Identifier: MIT
  pragma solidity ^0.8.0;

  contract Counter {
      uint256 public count;

      // Function to increment the counter
      function increment() public {
          count += 1;
      }
  }
</script>

<main>
  <h1>Hello, Tevm Kit!</h1>
  <p>Counter: {$count}</p>
  <button on:click={increment}>Increment</button>
</main>
