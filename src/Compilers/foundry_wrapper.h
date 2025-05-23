#ifndef FOUNDRY_WRAPPER_H
#define FOUNDRY_WRAPPER_H

#include <stdarg.h>
#include <stdbool.h>
#include <stdint.h>
#include <stdlib.h>

/**
 * Error structure for C interop
 */
typedef struct foundry_FoundryError {
  char *message;
  int32_t code;
} foundry_FoundryError;

/**
 * Compiler settings for C interop
 */
typedef struct foundry_CompilerSettings {
  bool optimizer_enabled;
  uint32_t optimizer_runs;
  const char *evm_version;
  const char *const *remappings;
  bool cache_enabled;
  const char *cache_path;
  bool output_abi;
  bool output_bytecode;
  bool output_deployed_bytecode;
  bool output_ast;
} foundry_CompilerSettings;

/**
 * Compiled contract data
 */
typedef struct foundry_CompiledContract {
  char *name;
  char *abi;
  char *bytecode;
  char *deployed_bytecode;
} foundry_CompiledContract;

/**
 * Compiler error/warning
 */
typedef struct foundry_CompilerError {
  char *message;
  int32_t severity;
  uint64_t error_code;
  char *source_location;
} foundry_CompilerError;

/**
 * Compilation result
 */
typedef struct foundry_CompilationResult {
  struct foundry_CompiledContract *contracts;
  uintptr_t contracts_count;
  struct foundry_CompilerError *errors;
  uintptr_t errors_count;
  struct foundry_CompilerError *warnings;
  uintptr_t warnings_count;
} foundry_CompilationResult;

#ifdef __cplusplus
extern "C" {
#endif // __cplusplus

/**
 * Free a FoundryError
 */
void foundry_free_error(struct foundry_FoundryError *error);

/**
 * Get error message
 */
const char *foundry_get_error_message(const struct foundry_FoundryError *error);

/**
 * Get error code
 */
int32_t foundry_get_error_code(const struct foundry_FoundryError *error);

/**
 * Compile a single Solidity file
 */
int32_t foundry_compile_file(const char *file_path,
                             const struct foundry_CompilerSettings *settings,
                             struct foundry_CompilationResult **out_result,
                             struct foundry_FoundryError **out_error);

/**
 * Compile source code from memory
 */
int32_t foundry_compile_source(const char *source_name,
                               const char *source_content,
                               const struct foundry_CompilerSettings *settings,
                               struct foundry_CompilationResult **out_result,
                               struct foundry_FoundryError **out_error);

/**
 * Install a specific Solidity compiler version
 */
int32_t foundry_install_solc_version(const char *version_str,
                                     struct foundry_FoundryError **out_error);

/**
 * Free a string allocated by Rust
 */
void foundry_free_string(char *str);

/**
 * Free compilation result
 */
void foundry_free_compilation_result(struct foundry_CompilationResult *result);

/**
 * Clear compilation cache
 */
int32_t foundry_clear_cache(const char *cache_path, struct foundry_FoundryError **out_error);

#ifdef __cplusplus
} // extern "C"
#endif // __cplusplus

#endif /* FOUNDRY_WRAPPER_H */
