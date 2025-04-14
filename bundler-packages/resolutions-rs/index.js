import { existsSync, readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";
import { platform, arch, report } from "process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const require = createRequire(import.meta.url);

let nativeBinding = null;
let localFileExisted = false;
let loadError = null;

async function isMusl() {
  // For Node 10
  if (!report || typeof report.getReport !== "function") {
    try {
      const { execSync } = await import("child_process");
      const lddPath = execSync("which ldd").toString().trim();
      return readFileSync(lddPath, "utf8").includes("musl");
    } catch (e) {
      return true;
    }
  } else {
    const { glibcVersionRuntime } = report.getReport().header;
    return !glibcVersionRuntime;
  }
}

switch (platform) {
  case "android":
    switch (arch) {
      case "arm64":
        localFileExisted = existsSync(
          join(__dirname, "resolutions_rs.android-arm64.node"),
        );
        try {
          if (localFileExisted) {
            nativeBinding = require("./resolutions_rs.android-arm64.node");
          } else {
            nativeBinding = require("@tevm/_tevm-bundler-packages-rs-android-arm64");
          }
        } catch (e) {
          loadError = e;
        }
        break;
      case "arm":
        localFileExisted = existsSync(
          join(__dirname, "resolutions_rs.android-arm-eabi.node"),
        );
        try {
          if (localFileExisted) {
            nativeBinding = require("./resolutions_rs.android-arm-eabi.node");
          } else {
            nativeBinding = require("@tevm/_tevm-bundler-packages-rs-android-arm-eabi");
          }
        } catch (e) {
          loadError = e;
        }
        break;
      default:
        throw new Error(`Unsupported architecture on Android ${arch}`);
    }
    break;
  case "win32":
    switch (arch) {
      case "x64":
        localFileExisted = existsSync(
          join(__dirname, "resolutions_rs.win32-x64-msvc.node"),
        );
        try {
          if (localFileExisted) {
            nativeBinding = require("./resolutions_rs.win32-x64-msvc.node");
          } else {
            nativeBinding = require("@tevm/_tevm-bundler-packages-rs-win32-x64-msvc");
          }
        } catch (e) {
          loadError = e;
        }
        break;
      case "ia32":
        localFileExisted = existsSync(
          join(__dirname, "resolutions_rs.win32-ia32-msvc.node"),
        );
        try {
          if (localFileExisted) {
            nativeBinding = require("./resolutions_rs.win32-ia32-msvc.node");
          } else {
            nativeBinding = require("@tevm/_tevm-bundler-packages-rs-win32-ia32-msvc");
          }
        } catch (e) {
          loadError = e;
        }
        break;
      case "arm64":
        localFileExisted = existsSync(
          join(__dirname, "resolutions_rs.win32-arm64-msvc.node"),
        );
        try {
          if (localFileExisted) {
            nativeBinding = require("./resolutions_rs.win32-arm64-msvc.node");
          } else {
            nativeBinding = require("@tevm/_tevm-bundler-packages-rs-win32-arm64-msvc");
          }
        } catch (e) {
          loadError = e;
        }
        break;
      default:
        throw new Error(`Unsupported architecture on Windows: ${arch}`);
    }
    break;
  case "darwin":
    localFileExisted = existsSync(
      join(__dirname, "resolutions_rs.darwin-universal.node"),
    );
    try {
      if (localFileExisted) {
        nativeBinding = require("./resolutions_rs.darwin-universal.node");
      } else {
        nativeBinding = require("@tevm/_tevm-bundler-packages-rs-darwin-universal");
      }
      break;
    } catch { }
    switch (arch) {
      case "x64":
        localFileExisted = existsSync(
          join(__dirname, "resolutions_rs.darwin-x64.node"),
        );
        try {
          if (localFileExisted) {
            nativeBinding = require("./resolutions_rs.darwin-x64.node");
          } else {
            nativeBinding = require("@tevm/_tevm-bundler-packages-rs-darwin-x64");
          }
        } catch (e) {
          loadError = e;
        }
        break;
      case "arm64":
        localFileExisted = existsSync(
          join(__dirname, "resolutions_rs.darwin-arm64.node"),
        );
        try {
          if (localFileExisted) {
            nativeBinding = require("./resolutions_rs.darwin-arm64.node");
          } else {
            nativeBinding = require("@tevm/_tevm-bundler-packages-rs-darwin-arm64");
          }
        } catch (e) {
          loadError = e;
        }
        break;
      default:
        throw new Error(`Unsupported architecture on macOS: ${arch}`);
    }
    break;
  case "freebsd":
    if (arch !== "x64") {
      throw new Error(`Unsupported architecture on FreeBSD: ${arch}`);
    }
    localFileExisted = existsSync(
      join(__dirname, "resolutions_rs.freebsd-x64.node"),
    );
    try {
      if (localFileExisted) {
        nativeBinding = require("./resolutions_rs.freebsd-x64.node");
      } else {
        nativeBinding = require("@tevm/_tevm-bundler-packages-rs-freebsd-x64");
      }
    } catch (e) {
      loadError = e;
    }
    break;
  case "linux":
    switch (arch) {
      case "x64":
        if (isMusl()) {
          localFileExisted = existsSync(
            join(__dirname, "resolutions_rs.linux-x64-musl.node"),
          );
          try {
            if (localFileExisted) {
              nativeBinding = require("./resolutions_rs.linux-x64-musl.node");
            } else {
              nativeBinding = require("@tevm/_tevm-bundler-packages-rs-linux-x64-musl");
            }
          } catch (e) {
            loadError = e;
          }
        } else {
          localFileExisted = existsSync(
            join(__dirname, "resolutions_rs.linux-x64-gnu.node"),
          );
          try {
            if (localFileExisted) {
              nativeBinding = require("./resolutions_rs.linux-x64-gnu.node");
            } else {
              nativeBinding = require("@tevm/_tevm-bundler-packages-rs-linux-x64-gnu");
            }
          } catch (e) {
            loadError = e;
          }
        }
        break;
      case "arm64":
        if (isMusl()) {
          localFileExisted = existsSync(
            join(__dirname, "resolutions_rs.linux-arm64-musl.node"),
          );
          try {
            if (localFileExisted) {
              nativeBinding = require("./resolutions_rs.linux-arm64-musl.node");
            } else {
              nativeBinding = require("@tevm/_tevm-bundler-packages-rs-linux-arm64-musl");
            }
          } catch (e) {
            loadError = e;
          }
        } else {
          localFileExisted = existsSync(
            join(__dirname, "resolutions_rs.linux-arm64-gnu.node"),
          );
          try {
            if (localFileExisted) {
              nativeBinding = require("./resolutions_rs.linux-arm64-gnu.node");
            } else {
              nativeBinding = require("@tevm/_tevm-bundler-packages-rs-linux-arm64-gnu");
            }
          } catch (e) {
            loadError = e;
          }
        }
        break;
      case "arm":
        localFileExisted = existsSync(
          join(__dirname, "resolutions_rs.linux-arm-gnueabihf.node"),
        );
        try {
          if (localFileExisted) {
            nativeBinding = require("./resolutions_rs.linux-arm-gnueabihf.node");
          } else {
            nativeBinding = require("@tevm/_tevm-bundler-packages-rs-linux-arm-gnueabihf");
          }
        } catch (e) {
          loadError = e;
        }
        break;
      default:
        throw new Error(`Unsupported architecture on Linux: ${arch}`);
    }
    break;
  default:
    throw new Error(`Unsupported OS: ${platform}, architecture: ${arch}`);
}

if (!nativeBinding) {
  if (loadError) {
    throw loadError;
  }
  throw new Error(`Failed to load native binding`);
}

const { resolve_imports, module_factory } = nativeBinding;

export { resolve_imports, module_factory };
export default nativeBinding;
