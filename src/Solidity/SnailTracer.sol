// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

/**
 * @title SnailTracer
 * @dev A simple Solidity contract for testing compilation and integration with Zig
 */
contract SnailTracer {
    // State variables
    uint256 private _value;
    
    // Events
    event ValueChanged(uint256 newValue);
    
    /**
     * @dev Constructor to initialize the contract
     */
    constructor() {
        _value = 0;
    }
    
    /**
     * @dev Set a new value
     * @param newValue The new value to set
     */
    function setValue(uint256 newValue) public {
        _value = newValue;
        emit ValueChanged(newValue);
    }
    
    /**
     * @dev Get the current value
     * @return The current value
     */
    function getValue() public view returns (uint256) {
        return _value;
    }
    
    /**
     * @dev Benchmark function that returns predefined values
     * @return Three bytes for testing
     */
    function benchmark() public pure returns (bytes1, bytes1, bytes1) {
        return (bytes1(0x01), bytes1(0x02), bytes1(0x03));
    }
}