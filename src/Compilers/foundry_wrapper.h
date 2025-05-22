#ifndef FOUNDRY_WRAPPER_H
#define FOUNDRY_WRAPPER_H

#include <stdint.h>

#ifdef __cplusplus
extern "C" {
#endif

// Error struct for foundry operations
typedef struct FoundryError {
    char* message;
    int32_t code;
} foundry_FoundryError;

// Function to free an error
void foundry_free_error(foundry_FoundryError* error);

// Get the error message
const char* foundry_get_error_message(const foundry_FoundryError* error);

// Get the error code
int32_t foundry_get_error_code(const foundry_FoundryError* error);

// Compile a Solidity project
int32_t foundry_compile_project(const char* project_path, foundry_FoundryError** out_error);

// Install a specific Solidity compiler version
int32_t foundry_install_solc_version(const char* version_str, foundry_FoundryError** out_error);

// Compile a single Solidity file
int32_t foundry_compile_file(const char* file_path, const char* solc_version, foundry_FoundryError** out_error);

#ifdef __cplusplus
}
#endif

#endif /* FOUNDRY_WRAPPER_H */