import { readFileSync, writeFileSync } from 'fs';

const filePath = process.argv[2];

if (!filePath) {
  process.exit(0);
}

try {
  const content = readFileSync(filePath, 'utf8');
  if (!content.startsWith('// @ts-nocheck')) {
    writeFileSync(filePath, `// @ts-nocheck\n${content}`);
  }
} catch (err) {
  console.error('add-ts-nocheck error:', err);
} 