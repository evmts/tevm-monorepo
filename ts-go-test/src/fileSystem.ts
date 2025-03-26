import { promises as fs } from 'node:fs';
import path from 'node:path';

export class VirtualFileSystem {
  private files: Map<string, string> = new Map();
  
  // Add a file to the virtual filesystem
  async addFile(filePath: string, content: string): Promise<void> {
    this.files.set(path.normalize(filePath), content);
  }
  
  // Add a real file to the virtual filesystem
  async addRealFile(filePath: string): Promise<void> {
    const content = await fs.readFile(filePath, 'utf-8');
    await this.addFile(filePath, content);
  }
  
  // Add a directory recursively to the virtual filesystem
  async addDirectory(dirPath: string, extensions?: string[]): Promise<void> {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      
      if (entry.isDirectory()) {
        await this.addDirectory(fullPath, extensions);
      } else if (entry.isFile()) {
        if (!extensions || extensions.some(ext => entry.name.endsWith(ext))) {
          await this.addRealFile(fullPath);
        }
      }
    }
  }
  
  // Get all files as a map for passing to Go implementation
  getAllFiles(): Record<string, string> {
    const result: Record<string, string> = {};
    for (const [path, content] of this.files.entries()) {
      result[path] = content;
    }
    return result;
  }
  
  // Create a FileAccessObject compatible with tevm/resolutions
  createFileAccessObject() {
    return {
      readFile: async (path: string, _encoding: string) => {
        const normalizedPath = path.normalize(path);
        const content = this.files.get(normalizedPath);
        if (content === undefined) {
          throw new Error(`File not found: ${normalizedPath}`);
        }
        return content;
      },
      readFileSync: (path: string, _encoding: string) => {
        const normalizedPath = path.normalize(path);
        const content = this.files.get(normalizedPath);
        if (content === undefined) {
          throw new Error(`File not found: ${normalizedPath}`);
        }
        return content;
      },
      exists: async (path: string) => {
        return this.files.has(path.normalize(path));
      },
      existsSync: (path: string) => {
        return this.files.has(path.normalize(path));
      }
    };
  }
}