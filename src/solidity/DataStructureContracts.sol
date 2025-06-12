// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title DataStructureContracts
 * @dev Comprehensive contracts for testing complex data structures in the EVM
 */

/**
 * @dev Contract for testing dynamic arrays and nested array operations
 */
contract ArrayTester {
    uint256[] public dynamicArray;
    uint256[][] public nestedArray;
    mapping(address => uint256[]) public userArrays;
    
    struct ArrayStruct {
        uint256[] numbers;
        string[] names;
        bool[] flags;
    }
    
    ArrayStruct public complexStruct;
    
    // Basic array operations
    function pushToArray(uint256 value) external {
        dynamicArray.push(value);
    }
    
    function popFromArray() external returns (uint256) {
        require(dynamicArray.length > 0, "Array is empty");
        uint256 value = dynamicArray[dynamicArray.length - 1];
        dynamicArray.pop();
        return value;
    }
    
    function getArrayLength() external view returns (uint256) {
        return dynamicArray.length;
    }
    
    function getArrayElement(uint256 index) external view returns (uint256) {
        require(index < dynamicArray.length, "Index out of bounds");
        return dynamicArray[index];
    }
    
    function setArrayElement(uint256 index, uint256 value) external {
        require(index < dynamicArray.length, "Index out of bounds");
        dynamicArray[index] = value;
    }
    
    function clearArray() external {
        delete dynamicArray;
    }
    
    // Nested array operations
    function addNestedArray(uint256[] memory values) external {
        nestedArray.push(values);
    }
    
    function getNestedArrayLength() external view returns (uint256) {
        return nestedArray.length;
    }
    
    function getNestedElement(uint256 arrayIndex, uint256 elementIndex) 
        external view returns (uint256) {
        require(arrayIndex < nestedArray.length, "Array index out of bounds");
        require(elementIndex < nestedArray[arrayIndex].length, "Element index out of bounds");
        return nestedArray[arrayIndex][elementIndex];
    }
    
    // User-specific arrays
    function addToUserArray(uint256 value) external {
        userArrays[msg.sender].push(value);
    }
    
    function getUserArrayLength(address user) external view returns (uint256) {
        return userArrays[user].length;
    }
    
    function getUserArrayElement(address user, uint256 index) 
        external view returns (uint256) {
        require(index < userArrays[user].length, "Index out of bounds");
        return userArrays[user][index];
    }
    
    // Array with struct
    function addToStructArray(uint256 number, string memory name, bool flag) external {
        complexStruct.numbers.push(number);
        complexStruct.names.push(name);
        complexStruct.flags.push(flag);
    }
    
    function getStructArrayLengths() external view returns (uint256, uint256, uint256) {
        return (
            complexStruct.numbers.length,
            complexStruct.names.length, 
            complexStruct.flags.length
        );
    }
    
    // Batch operations
    function batchPush(uint256[] memory values) external {
        for (uint256 i = 0; i < values.length; i++) {
            dynamicArray.push(values[i]);
        }
    }
    
    function sumArray() external view returns (uint256) {
        uint256 sum = 0;
        for (uint256 i = 0; i < dynamicArray.length; i++) {
            sum += dynamicArray[i];
        }
        return sum;
    }
}

/**
 * @dev Contract for testing various mapping types and operations
 */
contract MappingTester {
    mapping(address => uint256) public balances;
    mapping(uint256 => string) public idToName;
    mapping(string => bool) public nameExists;
    mapping(address => mapping(uint256 => bool)) public nestedMapping;
    mapping(bytes32 => uint256) public hashToValue;
    
    struct UserInfo {
        string name;
        uint256 age;
        bool active;
    }
    
    mapping(address => UserInfo) public users;
    mapping(address => uint256[]) public userTokens;
    
    // Basic mapping operations
    function setBalance(address user, uint256 amount) external {
        balances[user] = amount;
    }
    
    function getBalance(address user) external view returns (uint256) {
        return balances[user];
    }
    
    function increaseBalance(address user, uint256 amount) external {
        balances[user] += amount;
    }
    
    function transferBalance(address from, address to, uint256 amount) external {
        require(balances[from] >= amount, "Insufficient balance");
        balances[from] -= amount;
        balances[to] += amount;
    }
    
    // String key mapping
    function setName(uint256 id, string memory name) external {
        idToName[id] = name;
        nameExists[name] = true;
    }
    
    function getName(uint256 id) external view returns (string memory) {
        return idToName[id];
    }
    
    function checkNameExists(string memory name) external view returns (bool) {
        return nameExists[name];
    }
    
    // Nested mapping
    function setNestedValue(address user, uint256 id, bool value) external {
        nestedMapping[user][id] = value;
    }
    
    function getNestedValue(address user, uint256 id) external view returns (bool) {
        return nestedMapping[user][id];
    }
    
    // Hash key mapping
    function setHashValue(bytes32 hash, uint256 value) external {
        hashToValue[hash] = value;
    }
    
    function getHashValue(bytes32 hash) external view returns (uint256) {
        return hashToValue[hash];
    }
    
    function setHashFromString(string memory str, uint256 value) external {
        bytes32 hash = keccak256(bytes(str));
        hashToValue[hash] = value;
    }
    
    // Struct mapping
    function setUser(address user, string memory name, uint256 age, bool active) external {
        users[user] = UserInfo(name, age, active);
    }
    
    function getUser(address user) external view returns (string memory, uint256, bool) {
        UserInfo memory userInfo = users[user];
        return (userInfo.name, userInfo.age, userInfo.active);
    }
    
    function updateUserAge(address user, uint256 newAge) external {
        users[user].age = newAge;
    }
    
    function toggleUserActive(address user) external {
        users[user].active = !users[user].active;
    }
    
    // Mapping with array values
    function addUserToken(address user, uint256 tokenId) external {
        userTokens[user].push(tokenId);
    }
    
    function getUserTokenCount(address user) external view returns (uint256) {
        return userTokens[user].length;
    }
    
    function getUserToken(address user, uint256 index) external view returns (uint256) {
        require(index < userTokens[user].length, "Index out of bounds");
        return userTokens[user][index];
    }
}

/**
 * @dev Contract for testing struct operations and packed structs
 */
contract StructTester {
    struct SimpleStruct {
        uint256 id;
        string name;
        bool active;
    }
    
    struct PackedStruct {
        uint128 value1;
        uint128 value2;
        uint64 timestamp;
        uint32 count;
        uint16 status;
        uint8 flags;
        bool enabled;
    }
    
    struct NestedStruct {
        SimpleStruct info;
        uint256[] numbers;
        mapping(string => uint256) data;
    }
    
    SimpleStruct public simpleData;
    PackedStruct public packedData;
    mapping(uint256 => NestedStruct) public nestedStructs;
    SimpleStruct[] public structArray;
    
    // Simple struct operations
    function setSimpleStruct(uint256 id, string memory name, bool active) external {
        simpleData = SimpleStruct(id, name, active);
    }
    
    function getSimpleStruct() external view returns (uint256, string memory, bool) {
        return (simpleData.id, simpleData.name, simpleData.active);
    }
    
    function updateSimpleName(string memory newName) external {
        simpleData.name = newName;
    }
    
    function toggleSimpleActive() external {
        simpleData.active = !simpleData.active;
    }
    
    // Packed struct operations
    function setPackedStruct(
        uint128 v1, uint128 v2, uint64 ts, uint32 cnt, 
        uint16 stat, uint8 fl, bool en
    ) external {
        packedData = PackedStruct(v1, v2, ts, cnt, stat, fl, en);
    }
    
    function getPackedStruct() external view returns (
        uint128, uint128, uint64, uint32, uint16, uint8, bool
    ) {
        return (
            packedData.value1, packedData.value2, packedData.timestamp,
            packedData.count, packedData.status, packedData.flags, packedData.enabled
        );
    }
    
    function incrementPackedCount() external {
        packedData.count++;
    }
    
    function updatePackedTimestamp() external {
        packedData.timestamp = uint64(block.timestamp);
    }
    
    // Nested struct operations
    function createNestedStruct(
        uint256 structId, uint256 infoId, 
        string memory name, bool active
    ) external {
        NestedStruct storage ns = nestedStructs[structId];
        ns.info = SimpleStruct(infoId, name, active);
    }
    
    function addToNestedArray(uint256 structId, uint256 value) external {
        nestedStructs[structId].numbers.push(value);
    }
    
    function setNestedData(uint256 structId, string memory key, uint256 value) external {
        nestedStructs[structId].data[key] = value;
    }
    
    function getNestedInfo(uint256 structId) external view returns (uint256, string memory, bool) {
        SimpleStruct memory info = nestedStructs[structId].info;
        return (info.id, info.name, info.active);
    }
    
    function getNestedArrayLength(uint256 structId) external view returns (uint256) {
        return nestedStructs[structId].numbers.length;
    }
    
    function getNestedData(uint256 structId, string memory key) external view returns (uint256) {
        return nestedStructs[structId].data[key];
    }
    
    // Struct array operations
    function addToStructArray(uint256 id, string memory name, bool active) external {
        structArray.push(SimpleStruct(id, name, active));
    }
    
    function getStructArrayLength() external view returns (uint256) {
        return structArray.length;
    }
    
    function getStructArrayElement(uint256 index) external view returns (uint256, string memory, bool) {
        require(index < structArray.length, "Index out of bounds");
        SimpleStruct memory s = structArray[index];
        return (s.id, s.name, s.active);
    }
    
    function updateStructArrayElement(uint256 index, string memory newName) external {
        require(index < structArray.length, "Index out of bounds");
        structArray[index].name = newName;
    }
}

/**
 * @dev Contract for testing string and bytes manipulation
 */
contract StringBytesTester {
    string public storedString;
    bytes public storedBytes;
    mapping(string => uint256) public stringToId;
    string[] public stringArray;
    
    // String operations
    function setString(string memory str) external {
        storedString = str;
    }
    
    function getString() external view returns (string memory) {
        return storedString;
    }
    
    function getStringLength() external view returns (uint256) {
        return bytes(storedString).length;
    }
    
    function concatenateStrings(string memory a, string memory b) 
        external pure returns (string memory) {
        return string(abi.encodePacked(a, b));
    }
    
    function compareStrings(string memory a, string memory b) 
        external pure returns (bool) {
        return keccak256(bytes(a)) == keccak256(bytes(b));
    }
    
    function stringToHash(string memory str) external pure returns (bytes32) {
        return keccak256(bytes(str));
    }
    
    // Bytes operations
    function setBytes(bytes memory data) external {
        storedBytes = data;
    }
    
    function getBytes() external view returns (bytes memory) {
        return storedBytes;
    }
    
    function getBytesLength() external view returns (uint256) {
        return storedBytes.length;
    }
    
    function getByte(uint256 index) external view returns (bytes1) {
        require(index < storedBytes.length, "Index out of bounds");
        return storedBytes[index];
    }
    
    function setByte(uint256 index, bytes1 value) external {
        require(index < storedBytes.length, "Index out of bounds");
        storedBytes[index] = value;
    }
    
    function concatenateBytes(bytes memory a, bytes memory b) 
        external pure returns (bytes memory) {
        return abi.encodePacked(a, b);
    }
    
    // Advanced bytes operations
    function sliceBytes(bytes memory data, uint256 start, uint256 length) 
        external pure returns (bytes memory) {
        require(start + length <= data.length, "Slice out of bounds");
        bytes memory result = new bytes(length);
        for (uint256 i = 0; i < length; i++) {
            result[i] = data[start + i];
        }
        return result;
    }
    
    function findByte(bytes memory data, bytes1 target) 
        external pure returns (int256) {
        for (uint256 i = 0; i < data.length; i++) {
            if (data[i] == target) {
                return int256(i);
            }
        }
        return -1; // Not found
    }
    
    function reverseByte(bytes memory data) external pure returns (bytes memory) {
        uint256 length = data.length;
        bytes memory result = new bytes(length);
        for (uint256 i = 0; i < length; i++) {
            result[i] = data[length - 1 - i];
        }
        return result;
    }
    
    // String array operations
    function addString(string memory str) external {
        stringArray.push(str);
        stringToId[str] = stringArray.length - 1;
    }
    
    function getStringById(uint256 id) external view returns (string memory) {
        require(id < stringArray.length, "ID out of bounds");
        return stringArray[id];
    }
    
    function getIdByString(string memory str) external view returns (uint256) {
        return stringToId[str];
    }
    
    function getStringArrayLength() external view returns (uint256) {
        return stringArray.length;
    }
    
    // Encoding/decoding operations
    function encodeUint(uint256 value) external pure returns (bytes memory) {
        return abi.encode(value);
    }
    
    function decodeUint(bytes memory data) external pure returns (uint256) {
        return abi.decode(data, (uint256));
    }
    
    function encodeMultiple(uint256 a, string memory b, bool c) 
        external pure returns (bytes memory) {
        return abi.encode(a, b, c);
    }
    
    function decodeMultiple(bytes memory data) 
        external pure returns (uint256, string memory, bool) {
        return abi.decode(data, (uint256, string, bool));
    }
}