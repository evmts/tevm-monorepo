// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title StringUtils
 * @dev String utilities for Solidity
 */
library StringUtils {
    /**
     * @dev Checks if two strings are equal
     * @param a First string
     * @param b Second string
     * @return True if strings are equal, false otherwise
     */
    function equals(string memory a, string memory b) internal pure returns (bool) {
        return keccak256(bytes(a)) == keccak256(bytes(b));
    }

    /**
     * @dev Convert a string to lowercase
     * @param str The string to convert
     * @return The lowercase string
     */
    function toLowerCase(string memory str) internal pure returns (string memory) {
        bytes memory bStr = bytes(str);
        bytes memory bLower = new bytes(bStr.length);
        
        for (uint i = 0; i < bStr.length; i++) {
            // If uppercase, convert to lowercase
            if ((uint8(bStr[i]) >= 65) && (uint8(bStr[i]) <= 90)) {
                bLower[i] = bytes1(uint8(bStr[i]) + 32);
            } else {
                bLower[i] = bStr[i];
            }
        }
        
        return string(bLower);
    }

    /**
     * @dev Convert a string to uppercase
     * @param str The string to convert
     * @return The uppercase string
     */
    function toUpperCase(string memory str) internal pure returns (string memory) {
        bytes memory bStr = bytes(str);
        bytes memory bUpper = new bytes(bStr.length);
        
        for (uint i = 0; i < bStr.length; i++) {
            // If lowercase, convert to uppercase
            if ((uint8(bStr[i]) >= 97) && (uint8(bStr[i]) <= 122)) {
                bUpper[i] = bytes1(uint8(bStr[i]) - 32);
            } else {
                bUpper[i] = bStr[i];
            }
        }
        
        return string(bUpper);
    }

    /**
     * @dev Returns the length of a string
     */
    function length(string memory str) internal pure returns (uint256) {
        return bytes(str).length;
    }

    /**
     * @dev Concatenate two strings
     * @param a First string
     * @param b Second string
     * @return Concatenated string
     */
    function concatenate(string memory a, string memory b) internal pure returns (string memory) {
        return string(abi.encodePacked(a, b));
    }

    /**
     * @dev Check if a string contains a substring
     * @param haystack The string to search in
     * @param needle The string to search for
     * @return True if the haystack contains the needle, false otherwise
     */
    function contains(string memory haystack, string memory needle) internal pure returns (bool) {
        bytes memory haystackBytes = bytes(haystack);
        bytes memory needleBytes = bytes(needle);
        
        if (needleBytes.length > haystackBytes.length) {
            return false;
        }
        
        bool found = false;
        for (uint i = 0; i <= haystackBytes.length - needleBytes.length; i++) {
            bool match = true;
            for (uint j = 0; j < needleBytes.length; j++) {
                if (haystackBytes[i + j] != needleBytes[j]) {
                    match = false;
                    break;
                }
            }
            if (match) {
                found = true;
                break;
            }
        }
        
        return found;
    }

    /**
     * @dev Converts an address to a string
     * @param addr The address to convert
     * @return The address as a string
     */
    function addressToString(address addr) internal pure returns (string memory) {
        bytes memory addressBytes = abi.encodePacked(addr);
        bytes memory stringBytes = new bytes(42);
        
        stringBytes[0] = '0';
        stringBytes[1] = 'x';
        
        for (uint i = 0; i < 20; i++) {
            uint8 leftValue = uint8(addressBytes[i]) / 16;
            uint8 rightValue = uint8(addressBytes[i]) % 16;
            
            stringBytes[2 + i*2] = leftValue < 10 ? bytes1(leftValue + 48) : bytes1(leftValue + 87);
            stringBytes[3 + i*2] = rightValue < 10 ? bytes1(rightValue + 48) : bytes1(rightValue + 87);
        }
        
        return string(stringBytes);
    }
}