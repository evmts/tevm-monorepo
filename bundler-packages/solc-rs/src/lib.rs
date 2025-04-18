pub mod models;
pub mod solc;
pub mod error;
#[cfg(feature = "examples")]
pub mod examples;

// Re-export the main functions and types for easier access
pub use models::{
    SolcInputDescription, SolcOutput, SolcLanguage, SolcInputSource, SolcInputSources,
    SolcSettings, SolcOptimizer, SolcOutputSelection, SolcErrorEntry, SolcContractOutput,
};
pub use solc::{Solc, solc_compile};
pub use error::SolcError;
