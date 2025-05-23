// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

/**
 * @title TestMemory
 * @dev Test contract for memory operations
 */
contract TestMemory {
    // Test memory allocation and return
    function testReturnString() public pure returns (string memory) {
        return "Hello, EVM!";
    }
    
    function testReturnBytes() public pure returns (bytes memory) {
        bytes memory data = new bytes(3);
        data[0] = 0x01;
        data[1] = 0x02;
        data[2] = 0x03;
        return data;
    }
    
    function testReturnArray() public pure returns (uint256[] memory) {
        uint256[] memory arr = new uint256[](3);
        arr[0] = 100;
        arr[1] = 200;
        arr[2] = 300;
        return arr;
    }
    
    // Test memory operations with parameters
    function testConcatStrings(string memory a, string memory b) public pure returns (string memory) {
        return string(abi.encodePacked(a, b));
    }
    
    function testSumArray(uint256[] memory numbers) public pure returns (uint256) {
        uint256 sum = 0;
        for (uint256 i = 0; i < numbers.length; i++) {
            sum += numbers[i];
        }
        return sum;
    }
}