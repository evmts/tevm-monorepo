import { readFile } from "node:fs/promises";
import { execSync } from "node:child_process";

export interface FileWithContent {
  file: string;
  content: string;
}

export interface CodeFile extends FileWithContent {
  lang: string;
}

/**
 * Get all files matching patterns
 */
export async function getFilesFromPatterns(
  patterns: string[],
  fileExtension: string = "*.zig"
): Promise<FileWithContent[]> {
  console.log(`🔧 Extracting ${fileExtension} files...`);

  const allFiles: string[] = [];

  for (const pattern of patterns) {
    try {
      const command = `find ${pattern} -name "${fileExtension}" 2>/dev/null`;
      const result = execSync(command, { encoding: "utf8" });
      const files = result.trim().split("\n").filter(Boolean);
      allFiles.push(...files);

      console.log(`📦 Found ${files.length} files in ${pattern}`);
    } catch (error) {
      console.warn(`⚠️  Could not search ${pattern}:`, error.message);
    }
  }

  console.log(`📦 Total files found: ${allFiles.length}`);

  // Read all files concurrently
  const fileReads = allFiles.map(async (file) => {
    try {
      const content = await readFile(file, "utf8");
      return { file, content };
    } catch (error) {
      console.warn(`⚠️  Could not read ${file}:`, error);
      return null;
    }
  });

  const results = await Promise.all(fileReads);
  return results.filter(
    (result): result is FileWithContent => result !== null,
  );
}

/**
 * Get all Zig files from specified patterns
 */
export async function getZigFiles(patterns: string[]): Promise<FileWithContent[]> {
  return getFilesFromPatterns(patterns, "*.zig");
}

/**
 * Get code files from external resource codebase
 */
export async function getResourceFiles(
  patterns: string[],
  extensions: string[]
): Promise<CodeFile[]> {
  console.log(`🔧 Extracting files with extensions: ${extensions.join(", ")}...`);

  const allFileReads: Promise<CodeFile | null>[] = [];
  let totalFiles = 0;

  for (const pattern of patterns) {
    const command = `find . -path "./${pattern}" -type f 2>/dev/null`;
    const result = execSync(command, { encoding: "utf8" });
    const files = result.trim().split("\n").filter(Boolean);
    totalFiles += files.length;

    console.log(`📦 Found ${files.length} files for pattern ${pattern}`);

    // Add all file reads to the batch
    for (const file of files) {
      const ext = extensions.find((e) => file.endsWith(e)) || "";
      if (!ext) continue; // Skip files that don't match our extensions
      
      const lang = ext.replace(".", "") || "text";

      allFileReads.push(
        readFile(file, "utf8")
          .then((content) => ({ file, content, lang }))
          .catch((error) => {
            console.warn(`⚠️  Could not read ${file}:`, error);
            return null;
          }),
      );
    }
  }

  // Read all files concurrently
  const results = await Promise.all(allFileReads);
  const validResults = results.filter(
    (result): result is CodeFile => result !== null,
  );

  console.log(`📝 Extracted ${validResults.length} files`);
  return validResults;
}