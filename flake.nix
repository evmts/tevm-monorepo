# `nix develop` to enter the devShell
{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    flake-parts.url = "github:hercules-ci/flake-parts";
    foundry.url = "github:shazow/foundry.nix/monthly";
    rust-overlay.url = "github:oxalica/rust-overlay";
  };

  outputs = { nixpkgs, flake-utils, foundry, rust-overlay, ... }:
    flake-utils.lib.eachDefaultSystem (system:
      let pkgs = import nixpkgs {
        inherit system;
        overlays = [
          foundry.overlay
          rust-overlay.overlays.default
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
        ];

        shellHook = ''
          export PS1="[dev] $PS1"

          [[ -f .env ]] && source .env
        '';
      };
    });
}
