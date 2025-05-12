# `nix develop` to enter the devShell
{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    flake-utils.url = "github:numtide/flake-utils";
    flake-parts.url = "github:hercules-ci/flake-parts";
    foundry.url = "github:shazow/foundry.nix/monthly";
    rust-overlay.url = "github:oxalica/rust-overlay";
    zig-overlay.url = "github:mitchellh/zig-overlay";
  };

  outputs = { nixpkgs, flake-utils, foundry, rust-overlay, zig-overlay, ... }:
    flake-utils.lib.eachDefaultSystem (system:
      let pkgs = import nixpkgs {
        inherit system;
        overlays = [
          foundry.overlay
          rust-overlay.overlays.default
          zig-overlay.overlays.default
        ];
      };
    in {
      devShells.default = pkgs.mkShell {
        buildInputs = [
          # "if you add npm 22 bun pnpm foundry and rust nix configs to Tevm repo I’ll start using and shilling nix" ~ fucory.eth
          pkgs.nodejs_22
          pkgs.nodePackages.pnpm
          pkgs.bun
          pkgs.foundry-bin
          pkgs.rust-bin.stable.latest.default # or pkgs.rust-bin.beta.latest.default
          zig-overlay.packages.${system}.master # Use the latest master build of Zig
        ];

        shellHook = ''
          export PS1="[dev] $PS1"

          [[ -f .env ]] && source .env
        '';
      };
    });
}
