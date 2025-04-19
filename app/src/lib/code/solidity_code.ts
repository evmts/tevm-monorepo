export const code = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract Counter {
    uint256 private count;
    
    // Event emitted when counter is incremented
    event Incremented(address indexed by, uint256 newCount);
    // Event emitted when counter is decremented
    event Decremented(address indexed by, uint256 newCount);
    
    constructor(uint256 initialCount) {
        count = initialCount;
    }
    
    // Returns the current count
    function getCount() public view returns (uint256) {
        return count;
    }
    
    // Increments the counter by 1
    function increment() public {
        count += 1;
        emit Incremented(msg.sender, count);
    }
    
    // Decrements the counter by 1
    function decrement() public {
        require(count > 0, "Counter: cannot decrement below zero");
        count -= 1;
        emit Decremented(msg.sender, count);
    }
    
    // Sets the counter to a specific value
    function setCount(uint256 newCount) public {
        count = newCount;
    }
}
`;