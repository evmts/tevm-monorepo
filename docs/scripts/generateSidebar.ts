import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const docsDir = path.join(__dirname, '../src/content/docs');
const sidebarConfigPath = path.join(__dirname, '../astro.sidebar.config.mjs');

interface SidebarItem {
    label: string;
    link: string;
}

interface SidebarConfig {
    label: string;
    items: SidebarItem[];
}

function generateSidebarConfig(dir: string): SidebarItem[] {
    const items: SidebarItem[] = [];

    fs.readdirSync(dir).forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            const indexPath = path.join(fullPath, 'index.md');
            if (fs.existsSync(indexPath)) {
                const { data } = matter(fs.readFileSync(indexPath, 'utf8'));
                items.push({ label: data.title || file, link: `/learn/${file}/` });
            }
        } else if (file.endsWith('.md')) {
            const { data } = matter(fs.readFileSync(fullPath, 'utf8'));
            const fileName = path.basename(file, '.md');
            items.push({ label: data.title || fileName, link: `/learn/${fileName}/` });
        }
    });

    return items;
}

const sidebarConfig: SidebarConfig[] = [
    {
        label: 'Learn',
        items: generateSidebarConfig(docsDir),
    },
];

fs.writeFileSync(sidebarConfigPath, `export const sidebarConfig = ${JSON.stringify(sidebarConfig, null, 4)};`);

console.log('Sidebar configuration generated successfully.');

