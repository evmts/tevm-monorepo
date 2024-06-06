// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { Encoding } from "@eth-optimism/contracts-bedrock/src/libraries/Encoding.sol";
import { Types } from "@eth-optimism/contracts-bedrock/src/libraries/Types.sol";

contract EncodingSdk {

    function encodeDepositTransaction(Types.UserDepositTransaction memory _tx) public pure returns (bytes memory) {
        return Encoding.encodeDepositTransaction(_tx);
    }

    function encodeCrossDomainMessage(
        uint256 _nonce,
        address _sender,
        address _target,
        uint256 _value,
        uint256 _gasLimit,
        bytes memory _data
    )
        public
        pure
        returns (bytes memory)
    {
        return Encoding.encodeCrossDomainMessage(_nonce, _sender, _target, _value, _gasLimit, _data);
    }

    function encodeCrossDomainMessageV0(
        address _target,
        address _sender,
        bytes memory _data,
        uint256 _nonce
    )
        public
        pure
        returns (bytes memory)
    {
        return Encoding.encodeCrossDomainMessageV0(_target, _sender, _data, _nonce);
    }

    function encodeCrossDomainMessageV1(
        uint256 _nonce,
        address _sender,
        address _target,
        uint256 _value,
        uint256 _gasLimit,
        bytes memory _data
    )
        public
        pure
        returns (bytes memory)
    {
        return Encoding.encodeCrossDomainMessageV1(_nonce, _sender, _target, _value, _gasLimit, _data);
    }

    function encodeVersionedNonce(uint240 _nonce, uint16 _version) public pure returns (uint256) {
        return Encoding.encodeVersionedNonce(_nonce, _version);
    }

    function decodeVersionedNonce(uint256 _nonce) public pure returns (uint240, uint16) {
        return Encoding.decodeVersionedNonce(_nonce);
    }

    function encodeSetL1BlockValuesEcotone(
        uint32 baseFeeScalar,
        uint32 blobBaseFeeScalar,
        uint64 sequenceNumber,
        uint64 timestamp,
        uint64 number,
        uint256 baseFee,
        uint256 blobBaseFee,
        bytes32 hash,
        bytes32 batcherHash
    )
        public
        pure
        returns (bytes memory)
    {
        return Encoding.encodeSetL1BlockValuesEcotone(
            baseFeeScalar,
            blobBaseFeeScalar,
            sequenceNumber,
            timestamp,
            number,
            baseFee,
            blobBaseFee,
            hash,
            batcherHash
        );
    }

    function encodeSetL1BlockValuesInterop(
        uint32 _baseFeeScalar,
        uint32 _blobBaseFeeScalar,
        uint64 _sequenceNumber,
        uint64 _timestamp,
        uint64 _number,
        uint256 _baseFee,
        uint256 _blobBaseFee,
        bytes32 _hash,
        bytes32 _batcherHash,
        uint256[] memory _dependencySet
    )
        public
        pure
        returns (bytes memory)
    {
        return Encoding.encodeSetL1BlockValuesInterop(
            _baseFeeScalar,
            _blobBaseFeeScalar,
            _sequenceNumber,
            _timestamp,
            _number,
            _baseFee,
            _blobBaseFee,
            _hash,
            _batcherHash,
            _dependencySet
        );
    }
}
