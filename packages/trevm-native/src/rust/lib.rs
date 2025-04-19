#![deny(clippy::all)]

use napi::bindgen_prelude::*;
use napi_derive::napi;

mod state_bridge;
mod types;
mod vm;

use vm::TrevmWrapper;

#[napi]
pub fn init_trevm(options: Object) -> Promise<TrevmWrapper> {
  TrevmWrapper::new(options)
}

#[napi]
pub fn version() -> String {
  env!("CARGO_PKG_VERSION").to_string()
}