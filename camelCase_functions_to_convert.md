# CamelCase Functions to Convert to snake_case

This document lists all camelCase function names found in Zig files that need to be converted to snake_case according to the project's Zig naming conventions.

## src/Compilers/

### compiler_wasm.zig
- Line 117: `getVersion` → `get_version`

### rust_build.zig
- Line 3: `addRustIntegration` → `add_rust_integration`

### compiler.zig
- Line 129: `compileFile` → `compile_file`
- Line 167: `compileSource` → `compile_source`
- Line 208: `installSolcVersion` → `install_solc_version`
- Line 227: `clearCache` → `clear_cache`
- Line 252: `createCSettings` → `create_c_settings`
- Line 292: `freeCSettings` → `free_c_settings`
- Line 312: `convertCResult` → `convert_c_result`

## src/root.zig
- Line 40: `loadBytecode` → `load_bytecode`
- Line 45: `resetEvm` → `reset_evm`
- Line 49: `stepEvm` → `step_evm`
- Line 61: `toggleRunPause` → `toggle_run_pause`
- Line 73: `getEvmState` → `get_evm_state`

## src/evm/

### stack.zig
- Line 20: `fromSlice` → `from_slice`
- Line 34: `appendUnsafe` → `append_unsafe`
- Line 47: `popUnsafe` → `pop_unsafe`
- Line 59: `peekUnsafe` → `peek_unsafe`
- Line 63: `isEmpty` → `is_empty`
- Line 67: `isFull` → `is_full`
- Line 76: `backUnsafe` → `back_unsafe`
- Line 80: `peekN` → `peek_n`
- Line 85: `peekNUnsafe` → `peek_n_unsafe`
- Line 95: `swapUnsafe` → `swap_unsafe`
- Line 99: `swapN` → `swap_n`
- Line 107: `swapNUnsafe` → `swap_n_unsafe`
- Line 125: `dupUnsafe` → `dup_unsafe`
- Line 129: `dupN` → `dup_n`
- Line 136: `dupNUnsafe` → `dup_n_unsafe`
- Line 208: `toSlice` → `to_slice`
- Line 212: `checkRequirements` → `check_requirements`

### jump_table.zig
- Line 67: `getOperation` → `get_operation`
- Line 95: `initFromHardfork` → `init_from_hardfork`
- Line 111: `minStack` → `min_stack`
- Line 116: `maxStack` → `max_stack`
- Line 121: `minDupStack` → `min_dup_stack`
- Line 125: `maxDupStack` → `max_dup_stack`
- Line 129: `minSwapStack` → `min_swap_stack`
- Line 133: `maxSwapStack` → `max_swap_stack`
- Line 137: `undefinedExecute` → `undefined_execute`
- Line 144: `stopExecute` → `stop_execute`
- Line 151: `dummyExecute` → `dummy_execute`
- Line 159: `newFrontierInstructionSet` → `new_frontier_instruction_set`

### operation.zig
- Line 47: `undefinedExecute` → `undefined_execute`

### contract.zig
- Line 201: `useGasUnchecked` → `use_gas_unchecked`
- Line 206: `refundGas` → `refund_gas`
- Line 211: `addGasRefund` → `add_gas_refund`
- Line 217: `subGasRefund` → `sub_gas_refund`
- Line 340: `analyzeCode` → `analyze_code`

### storage_pool.zig
- Line 32: `borrowAccessMap` → `borrow_access_map`
- Line 41: `returnAccessMap` → `return_access_map`
- Line 46: `borrowStorageMap` → `borrow_storage_map`
- Line 55: `returnStorageMap` → `return_storage_map`

### evm_logger.zig
- Line 27: `createLogger` → `create_logger`
- Line 40: `createScopedLogger` → `create_scoped_logger`

### fee_market.zig
- Line 7: `getLogger` → `get_logger`
- Line 22: `calculateFeeDelta` → `calculate_fee_delta`
- Line 51: `initialBaseFee` → `initial_base_fee`
- Line 107: `nextBaseFee` → `next_base_fee`
- Line 180: `getEffectiveGasPrice` → `get_effective_gas_price`
- Line 218: `getGasTarget` → `get_gas_target`

### eip_7702_bytecode.zig
- Line 13: `newRaw` → `new_raw`

### execution_error.zig
- Line 28: `getDescription` → `get_description`

### opcode.zig
- Line 168: `getName` → `get_name`

## src/Token/token.zig
- Line 3: `formatUnits` → `format_units`
- Line 17: `formatEther` → `format_ether`
- Line 24: `formatGwei` → `format_gwei`
- Line 30: `parseUnits` → `parse_units`
- Line 36: `parseEther` → `parse_ether`
- Line 40: `parseGwei` → `parse_gwei`

## src/Utils/hex.zig
- Line 15: `hexToBytes` → `hex_to_bytes`
- Line 65: `bytesToHex` → `bytes_to_hex`

## src/Bytecode/bytecode.zig
- Line 105: `newAnalyzed` → `new_analyzed`

## src/Trie/

### hash_builder.zig
- Line 55: `storeNode` → `store_node`
- Line 151: `rootHash` → `root_hash`
- Line 688: `getValue` → `get_value`
- Line 782: `deleteKey` → `delete_key`
- Line 787: `deleteKeyWithDepth` → `delete_key_with_depth`
- Line 1169: `commonPrefixLength` → `common_prefix_length`
- Line 1177: `bytesToHexString` → `bytes_to_hex_string`

### trie.zig
- Line 365: `encodePath` → `encode_path`
- Line 396: `decodePath` → `decode_path`

### optimized_branch.zig
- Line 40: `addChild` → `add_child`
- Line 90: `getChild` → `get_child`
- Line 107: `removeChild` → `remove_child`
- Line 167: `hasOnlyOneChild` → `has_only_one_child`
- Line 172: `getOnlyChildIndex` → `get_only_child_index`

### merkle_trie.zig
- Line 48: `rootHash` → `root_hash`
- Line 75: `verifyProof` → `verify_proof`
- Line 105: `collectProofNodes` → `collect_proof_nodes`
- Line 192: `bytesToHexString` → `bytes_to_hex_string`

### hash_builder_fixed.zig
- Line 55: `storeNode` → `store_node`
- Line 156: `rootHash` → `root_hash`
- Line 648: `getValue` → `get_value`
- Line 742: `deleteKey` → `delete_key`
- Line 1080: `commonPrefixLength` → `common_prefix_length`
- Line 1088: `bytesToHexString` → `bytes_to_hex_string`

### proof.zig
- Line 42: `addNode` → `add_node`
- Line 345: `collectNode` → `collect_node`
- Line 375: `bytesToHexString` → `bytes_to_hex_string`

### main_test.zig
- Line 35: `getAllTests` → `get_all_tests`
- Line 65: `runTest` → `run_test`

## src/Signature/signature.zig
- Line 22: `fromRsAndYParity` → `from_rs_and_y_parity`
- Line 83: `recoverPublicKey` → `recover_public_key`
- Line 93: `recoverAddress` → `recover_address`

## src/Server/server.zig
- Line 23: `requestHandler` → `request_handler`

## src/StateManager/state_manager.zig
- Line 7: `fromHex` → `from_hex` (B160)
- Line 27: `fromHex` → `from_hex` (B256)
- Line 43: `fromBytes` → `from_bytes`
- Line 56: `fromDecimalString` → `from_decimal_string`
- Line 70: `bytesToHex` → `bytes_to_hex`
- Line 179: `isContract` → `is_contract`
- Line 286: `getStateRoot` → `get_state_root`
- Line 291: `hasStateRoot` → `has_state_root`
- Line 297: `setStateRoot` → `set_state_root`
- Line 306: `createCheckpoint` → `create_checkpoint`
- Line 356: `clearCaches` → `clear_caches`
- Line 362: `getAccount` → `get_account`
- Line 385: `putAccount` → `put_account`
- Line 394: `deleteAccount` → `delete_account`
- Line 400: `getContractCode` → `get_contract_code`
- Line 408: `putContractCode` → `put_contract_code`
- Line 414: `getContractStorage` → `get_contract_storage`
- Line 422: `putContractStorage` → `put_contract_storage`
- Line 428: `clearContractStorage` → `clear_contract_storage`
- Line 436: `generateCanonicalGenesis` → `generate_canonical_genesis`
- Line 443: `saveCurrentState` → `save_current_state`
- Line 466: `getAccountFromProvider` → `get_account_from_provider`
- Line 492: `getContractCodeFromProvider` → `get_contract_code_from_provider`
- Line 513: `getContractStorageFromProvider` → `get_contract_storage_from_provider`
- Line 535: `deepCopy` → `deep_copy`
- Line 542: `shallowCopy` → `shallow_copy`
- Line 549: `dumpStorage` → `dump_storage`
- Line 559: `getAccountAddresses` → `get_account_addresses`

## src/Rlp/rlp.zig
- Line 142: `encodeBytes` → `encode_bytes`
- Line 171: `encodeLength` → `encode_length`
- Line 387: `hexToBytes` → `hex_to_bytes`

## src/Test/transports.zig
- Line 6: `fromEnv` → `from_env`
- Line 47: `getTransports` → `get_transports`

## src/ui/webui/

### window.zig
- Line 60: `newWindow` → `new_window`
- Line 68: `newWindowWithId` → `new_window_with_id`
- Line 79: `getNewWindowId` → `get_new_window_id`
- Line 86: `getBestBrowser` → `get_best_browser`
- Line 97: `showBrowser` → `show_browser`
- Line 103: `startServer` → `start_server`
- Line 111: `showWv` → `show_wv`
- Line 117: `setKiosk` → `set_kiosk`
- Line 142: `isShown` → `is_shown`
- Line 147: `setHide` → `set_hide`
- Line 152: `setSize` → `set_size`
- Line 157: `setMinimumSize` → `set_minimum_size`
- Line 162: `setPosition` → `set_position`
- Line 167: `setCenter` → `set_center`
- Line 172: `setProfile` → `set_profile`
- Line 177: `deleteProfile` → `delete_profile`
- Line 182: `getParentProcessId` → `get_parent_process_id`
- Line 189: `getChildProcessId` → `get_child_process_id`
- Line 209: `setIcon` → `set_icon`
- Line 214: `setPublic` → `set_public`
- Line 219: `getPort` → `get_port`
- Line 226: `setPort` → `set_port`
- Line 232: `getUrl` → `get_url`
- Line 245: `setFrameless` → `set_frameless`
- Line 250: `setTransparent` → `set_transparent`
- Line 255: `setResizable` → `set_resizable`
- Line 260: `setHighContrast` → `set_high_contrast`
- Line 265: `setCustomParameters` → `set_custom_parameters`
- Line 287: `deleteAllProfiles` → `delete_all_profiles`
- Line 292: `getFreePort` → `get_free_port`
- Line 297: `openUrl` → `open_url`
- Line 302: `isHighConstrast` → `is_high_constrast`

### config.zig
- Line 24: `setEventBlocking` → `set_event_blocking`
- Line 29: `setProxy` → `set_proxy`
- Line 34: `interfaceGetWindowId` → `interface_get_window_id`
- Line 41: `setConfig` → `set_config`
- Line 47: `setTimeout` → `set_timeout`
- Line 52: `browserExist` → `browser_exist`
- Line 57: `interfaceIsAppRunning` → `interface_is_app_running`

### javascript.zig
- Line 114: `setRuntime` → `set_runtime`
- Line 119: `sendRaw` → `send_raw`
- Line 126: `interfaceGetStringAt` → `interface_get_string_at`
- Line 133: `interfaceGetIntAt` → `interface_get_int_at`
- Line 138: `interfaceGetFloatAt` → `interface_get_float_at`
- Line 143: `interfaceGetBoolAt` → `interface_get_bool_at`
- Line 148: `interfaceGetSizeAt` → `interface_get_size_at`
- Line 153: `interfaceShowClient` → `interface_show_client`
- Line 159: `interfaceCloseClient` → `interface_close_client`
- Line 164: `interfaceSendRawClient` → `interface_send_raw_client`
- Line 174: `interfaceNavigateClient` → `interface_navigate_client`
- Line 179: `interfaceRunClient` → `interface_run_client`
- Line 184: `interfaceScriptClient` → `interface_script_client`

### event.zig
- Line 53: `getWindow` → `get_window`
- Line 61: `showClient` → `show_client`
- Line 66: `closeClient` → `close_client`
- Line 71: `sendRawClient` → `send_raw_client`
- Line 81: `navigateClient` → `navigate_client`
- Line 86: `runClient` → `run_client`
- Line 92: `scriptClient` → `script_client`
- Line 109: `returnInt` → `return_int`
- Line 114: `returnFloat` → `return_float`
- Line 119: `returnString` → `return_string`
- Line 124: `returnBool` → `return_bool`
- Line 130: `returnValue` → `return_value`
- Line 169: `getCount` → `get_count`
- Line 174: `getIntAt` → `get_int_at`
- Line 179: `getInt` → `get_int`
- Line 184: `getFloatAt` → `get_float_at`
- Line 189: `getFloat` → `get_float`
- Line 194: `getStringAt` → `get_string_at`
- Line 201: `getString` → `get_string`
- Line 207: `getRawAt` → `get_raw_at`
- Line 213: `getRaw` → `get_raw`
- Line 219: `getBoolAt` → `get_bool_at`
- Line 224: `getBool` → `get_bool`
- Line 229: `getSizeAt` → `get_size_at`
- Line 236: `getSize` → `get_size`
- Line 243: `getContext` → `get_context`

### utils.zig
- Line 20: `getLastError` → `get_last_error`
- Line 68: `getMimeType` → `get_mime_type`
- Line 77: `setTlsCertificate` → `set_tls_certificate`

### binding.zig
- Line 63: `setContext` → `set_context`
- Line 69: `interfaceBind` → `interface_bind`
- Line 96: `interfaceSetResponse` → `interface_set_response`
- Line 233: `fnParamsToTuple` → `fn_params_to_tuple`

### webui.zig
- Line 48: `getCount` → `get_count`
- Line 52: `getIntAt` → `get_int_at`
- Line 56: `getInt` → `get_int`
- Line 60: `getFloatAt` → `get_float_at`
- Line 64: `getFloat` → `get_float`
- Line 68: `getStringAt` → `get_string_at`
- Line 72: `getString` → `get_string`
- Line 76: `getBoolAt` → `get_bool_at`
- Line 80: `getBool` → `get_bool`
- Line 84: `getSizeAt` → `get_size_at`
- Line 88: `getSize` → `get_size`
- Line 92: `returnInt` → `return_int`
- Line 96: `returnString` → `return_string`
- Line 100: `returnBool` → `return_bool`

### file_handler.zig
- Line 34: `setRootFolder` → `set_root_folder`
- Line 40: `setBrowserFolder` → `set_browser_folder`
- Line 48: `setFileHandler` → `set_file_handler`
- Line 67: `setFileHandlerWindow` → `set_file_handler_window`
- Line 85: `interfaceSetResponseFileHandler` → `interface_set_response_file_handler`
- Line 97: `setDefaultRootFolder` → `set_default_root_folder`

## test/evm/

### stack_test.zig
- Line 6: `setupStack` → `setup_stack`

### memory_test.zig
- Line 6: `calculateNumWords` → `calculate_num_words`

## bench/evm/memory_bench.zig
- Line 6: `benchmarkMemoryInit` → `benchmark_memory_init`
- Line 13: `benchmarkMemoryInitLarge` → `benchmark_memory_init_large`
- Line 20: `benchmarkMemoryInitWithLimit` → `benchmark_memory_init_with_limit`
- Line 27: `benchmarkMemoryLimitEnforcement` → `benchmark_memory_limit_enforcement`
- Line 42: `benchmarkByteOperations` → `benchmark_byte_operations`
- Line 55: `benchmarkWordOperations` → `benchmark_word_operations`
- Line 87: `benchmarkMemoryExpansion` → `benchmark_memory_expansion`
- Line 100: `benchmarkLargeDataCopy` → `benchmark_large_data_copy`
- Line 118: `benchmarkMemoryCopy` → `benchmark_memory_copy`
- Line 138: `benchmarkBoundedCopy` → `benchmark_bounded_copy`
- Line 158: `benchmarkSliceReading` → `benchmark_slice_reading`
- Line 175: `benchmarkResizeOperations` → `benchmark_resize_operations`
- Line 188: `benchmarkWordAlignedResize` → `benchmark_word_aligned_resize`

## build.zig
- Line 764: `getAsset` → `get_asset` (in generated code)
- Line 808: `getAsset` → `get_asset` (in generated code)
- Line 825: `getMimeType` → `get_mime_type` (in generated code)

## Summary

Total functions to convert: **220 functions**

The conversion should be done systematically by file to ensure consistency and avoid breaking changes. Each function name should be converted from camelCase to snake_case following the project's Zig naming conventions.