import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { glob } from 'glob';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const docsDir = path.join(__dirname, '../src/content/docs');
const sidebarConfigPath = path.join(__dirname, '../astro.sidebar.config.mjs');

interface SidebarItem {
    label: string;
    link: string;
    items?: SidebarItem[];
}

interface SidebarConfig {
    label: string;
    items: SidebarItem[];
}

function generateSidebarConfig(): SidebarItem[] {
    const items: SidebarItem[] = [];

    // Use glob to find all markdown and mdx files, excluding specific directories and files
    const files = glob.sync('**/*.{md,mdx}', {
        cwd: docsDir,
        ignore: ['reference/**', 'blog/**', 'index.mdx'],
    });

    console.log(`Found markdown and mdx files: ${files}`);

    files.forEach(file => {
        const fullPath = path.join(docsDir, file);
        const { data } = matter(fs.readFileSync(fullPath, 'utf8'));
        const fileName = path.basename(file, path.extname(file));
        const dirName = path.dirname(file);

        // Split the directory path to create nested structure
        const pathParts = dirName.split(path.sep);

        // Create a nested structure based on the directory path
        let currentLevel = items;
        pathParts.forEach((part) => {
            let existingItem = currentLevel.find(item => item.label === part);
            if (!existingItem) {
                existingItem = { label: part, link: '', items: [] };
                currentLevel.push(existingItem);
            }
            if (existingItem.items) {
                currentLevel = existingItem.items;
            }
        });

        // Add the file to the appropriate level
        const linkPath = fileName === 'index' ? `/${dirName}/` : `/${dirName}/${fileName}/`;
        currentLevel.push({ label: data.title || fileName, link: linkPath });
        console.log(`Added item: ${data.title || fileName} with link: ${linkPath}`);
    });

    console.log(`Generated items: ${JSON.stringify(items, null, 2)}`);
    return items;
}

const sidebarConfig: SidebarConfig[] = [
    {
        label: 'Learn',
        items: generateSidebarConfig(),
    },
];

fs.writeFileSync(sidebarConfigPath, `export const sidebarConfig = ${JSON.stringify(sidebarConfig, null, 4)};`);

console.log('Sidebar configuration generated successfully.');
