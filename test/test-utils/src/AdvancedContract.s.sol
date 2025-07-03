// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Small helper contract that can be called by AdvancedContract
contract MathHelper {
    uint256 public multiplier = 2;

    event Calculated(uint256 input, uint256 result);

    function multiply(uint256 value) public returns (uint256) {
        uint256 result = value * multiplier;
        emit Calculated(value, result);
        return result;
    }

    function add(uint256 a, uint256 b) public pure returns (uint256) {
        return a + b;
    }

    function setMultiplier(uint256 newMultiplier) public {
        multiplier = newMultiplier;
    }
}

contract AdvancedContract {
    uint256 private numberValue;
    bool private boolValue;
    string private stringValue;
    address private addressValue;
    address public mathHelperAddress;

    event NumberSet(uint256 newValue);
    event BoolSet(bool newValue);
    event StringSet(string newValue);
    event AddressSet(address newValue);
    event AllValuesSet(uint256 number, bool boolean, string str, address addr);
    event ExternalCallResult(uint256 result);
    event DelegateCallResult(uint256 result);

    constructor(uint256 initialNumber, bool initialBool, string memory initialString, address initialAddress) {
        numberValue = initialNumber;
        boolValue = initialBool;
        stringValue = initialString;
        addressValue = initialAddress;

        // Deploy MathHelper contract
        mathHelperAddress = address(new MathHelper());
    }

    // Individual getters
    function getNumber() public view returns (uint256) {
        return numberValue;
    }

    function getBool() public view returns (bool) {
        return boolValue;
    }

    function getString() public view returns (string memory) {
        return stringValue;
    }

    function getAddress() public view returns (address) {
        return addressValue;
    }

    // Individual setters
    function setNumber(uint256 newValue) public {
        numberValue = newValue;
        emit NumberSet(newValue);
    }

    function setBool(bool newValue) public {
        boolValue = newValue;
        emit BoolSet(newValue);
    }

    function setString(string memory newValue) public {
        stringValue = newValue;
        emit StringSet(newValue);
    }

    function setAddress(address newValue) public {
        addressValue = newValue;
        emit AddressSet(newValue);
    }

    // Main getter that calls other getters
    function getAllValues() public view returns (uint256, bool, string memory, address) {
        return (
            getNumber(),
            getBool(),
            getString(),
            getAddress()
        );
    }

    // Main setter that calls other setters
    function setAllValues(uint256 newNumber, bool newBool, string memory newString, address newAddress) public {
        setNumber(newNumber);
        setBool(newBool);
        setString(newString);
        setAddress(newAddress);
        emit AllValuesSet(newNumber, newBool, newString, newAddress);
    }

    // Function that makes a regular external call to MathHelper
    function callMathHelper(uint256 value) public returns (uint256) {
        MathHelper helper = MathHelper(mathHelperAddress);
        uint256 result = helper.multiply(value);
        emit ExternalCallResult(result);
        return result;
    }

    // Function that makes a delegate call to MathHelper
    function delegateCallMathHelper(uint256 value) public returns (uint256) {
        bytes memory data = abi.encodeWithSignature("multiply(uint256)", value);
        (bool success, bytes memory result) = mathHelperAddress.delegatecall(data);
        require(success, "Delegate call failed");

        uint256 returnValue = abi.decode(result, (uint256));
        emit DelegateCallResult(returnValue);
        return returnValue;
    }

    // Helper function to set a custom MathHelper address
    function setMathHelperAddress(address newAddress) public {
        mathHelperAddress = newAddress;
    }
}
