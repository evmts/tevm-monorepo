pub mod models;
pub mod solc;
pub mod error;

// Re-export the main functions and types for easier access
pub use models::{
    SolcInputDescription, SolcOutput, SolcLanguage, SolcInputSource, SolcInputSources,
    SolcSettings, SolcOptimizer, SolcOutputSelection, SolcErrorEntry, SolcContractOutput,
    Releases, SolcVersions,
};
pub use solc::{Solc, create_solc, solc_compile};
pub use error::SolcError;
