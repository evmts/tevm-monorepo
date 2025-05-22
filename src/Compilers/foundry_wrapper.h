#ifndef FOUNDRY_WRAPPER_H
#define FOUNDRY_WRAPPER_H

#include <stdarg.h>
#include <stdbool.h>
#include <stdint.h>
#include <stdlib.h>

typedef struct foundry_FoundryError {
  char *message;
  int code;
} foundry_FoundryError;

#ifdef __cplusplus
extern "C" {
#endif // __cplusplus

void foundry_free_error(struct foundry_FoundryError *error);

const char *foundry_get_error_message(const struct foundry_FoundryError *error);

int foundry_get_error_code(const struct foundry_FoundryError *error);

/**
 * Compile a Solidity project at the given path
 *
 * @param project_path Path to the Solidity project
 * @param out_error Pointer to store error information (set to NULL if no error)
 * @return 1 on success, 0 on failure (check out_error for details)
 */
int foundry_compile_project(const char *project_path, struct foundry_FoundryError **out_error);

/**
 * Install a specific Solidity compiler version
 *
 * @param version_str Version string (e.g., "0.8.20")
 * @param out_error Pointer to store error information (set to NULL if no error)
 * @return 1 on success, 0 on failure (check out_error for details)
 */
int foundry_install_solc_version(const char *version_str, struct foundry_FoundryError **out_error);

/**
 * Compile a single Solidity file
 *
 * @param file_path Path to the Solidity file
 * @param solc_version Version of solc to use (can be NULL for auto-detection)
 * @param out_error Pointer to store error information (set to NULL if no error)
 * @return 1 on success, 0 on failure (check out_error for details)
 */
int foundry_compile_file(const char *file_path,
                         const char *solc_version,
                         struct foundry_FoundryError **out_error);

#ifdef __cplusplus
} // extern "C"
#endif // __cplusplus

#endif /* FOUNDRY_WRAPPER_H */
