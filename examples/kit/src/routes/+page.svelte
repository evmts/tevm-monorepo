<script>
  import { client, contract } from "tevm/kit";

  const counter = $contract(Counter)
  
  // Function to increment the counter
  function increment() {
    counter.update(n => n + 1);
  }
</script>

<sol>
  // SPDX-License-Identifier: MIT
  pragma solidity ^0.8.0;

  contract Counter {
      uint256 public count;

      // Function to increment the counter
      function increment() public {
          count += 1;
      }

      // Function to retrieve the current counter value
      function getCount() public view returns (uint256) {
          return count;
      }
  }
</sol>

<main>
  <h1>Hello, Tevm Kit!</h1>
  <p>Counter: {$counter}</p>
  <button onclick={increment}>Increment</button>
</main>

