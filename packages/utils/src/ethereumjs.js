// All @ethereumjs/util exports have been migrated to native implementations
//
// Migrations:
// - Account - migrated to native implementation in account-class.js (EthjsAccount)
// - Address - migrated to native implementation in address.js (EthjsAddress)
// - bytesToUnprefixedHex - migrated to native implementation in bytesToUnprefixedHex.js
// - bytesToUtf8 - migrated to native implementation in bytesToUtf8.js
// - concatBytes - migrated to native implementation in concatBytes.js
// - createAccount - migrated to native implementation in account-class.js
// - createAddressFromString - migrated to native implementation in address.js
// - createWithdrawal - migrated to native implementation in withdrawal.js
// - ecrecover - migrated to native implementation in ecrecover.js
// - equalsBytes - migrated to native implementation in equalsBytes.js
// - fetchFromProvider - migrated to native implementation in provider.js
// - GWEI_TO_WEI - migrated to native implementation in constants.js
// - getProvider - migrated to native implementation in provider.js
// - KECCAK256_RLP - migrated to native implementation in constants.js
// - KECCAK256_RLP_ARRAY - migrated to native implementation in constants.js
// - KeyEncoding - migrated to native implementation in encoding.js
// - randomBytes - migrated to native implementation in randomBytes.js
// - setLengthLeft - migrated to native implementation in setLengthLeft.js
// - TypeOutput - migrated to native implementation in typeOutput.js
// - toType - migrated to native implementation in typeOutput.js
// - ValueEncoding - migrated to native implementation in encoding.js
// - Withdrawal - migrated to native implementation in withdrawal.js
// - MAX_UINT64 - migrated to native implementation in constants.js
// - SECP256K1_ORDER_DIV_2 - migrated to native implementation in constants.js
// - BIGINT_0 - migrated to native implementation in constants.js
// - BIGINT_1 - migrated to native implementation in constants.js
// - EIP-7702 utilities - migrated to native implementation in eip7702.js:
//   - eoaCode7702RecoverAuthority
//   - eoaCode7702SignAuthorization
//   - eoaCode7702AuthorizationMessageToSign
//   - eoaCode7702AuthorizationHashedMessageToSign
//   - eoaCode7702AuthorizationListBytesItemToJSON
//   - eoaCode7702AuthorizationListJSONItemToBytes
//   - isEOACode7702AuthorizationList
//   - isEOACode7702AuthorizationListBytes
//   - EOA_CODE_7702_AUTHORITY_SIGNING_MAGIC
//
// This file is now empty - all exports have been migrated to native implementations.
// The @ethereumjs/util dependency can be removed from package.json.
