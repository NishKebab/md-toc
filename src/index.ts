import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';
import ignore from 'ignore';
import { Config } from './config';
import { parseMarkdown, MarkdownFile } from './parser';

export async function generateToc(directory: string, config: Config): Promise<string> {
  const ig = ignore();
  
  // Only add custom ignore patterns (node_modules and .git are handled separately)
  if (config.ignore && config.ignore.length > 0) {
    ig.add(config.ignore);
  }

  const patterns = config.include || ['**/*.md'];
  const allFiles: string[] = [];

  for (const pattern of patterns) {
    const files = await glob(pattern, {
      cwd: directory,
      absolute: false,
      nodir: true,
      maxDepth: config.maxDepth || 10,
      // Don't use glob's ignore - we'll filter with the ignore package
      ignore: []
    });
    allFiles.push(...files);
  }

  const filteredFiles = allFiles
    .filter(file => {
      // Check if any part of the path contains node_modules or .git
      const pathParts = file.split(path.sep);
      if (pathParts.includes('node_modules') || pathParts.includes('.git')) {
        return false;
      }
      // Also check with the ignore package for custom patterns
      return !ig.ignores(file);
    })
    .filter(file => {
      if (config.excludeReadme) {
        const basename = path.basename(file).toLowerCase();
        return basename !== 'readme.md';
      }
      return true;
    })
    .sort();

  const markdownFiles: MarkdownFile[] = [];

  for (const file of filteredFiles) {
    const fullPath = path.join(directory, file);
    const content = fs.readFileSync(fullPath, 'utf-8');
    const parsed = parseMarkdown(content, file);
    if (parsed.headers.length > 0) {
      markdownFiles.push(parsed);
    }
  }

  return formatToc(markdownFiles, config);
}

function formatToc(files: MarkdownFile[], config: Config): string {
  const lines: string[] = [];
  
  if (config.title) {
    lines.push(`# ${config.title}`);
    lines.push('');
  }

  const filesByDir = new Map<string, MarkdownFile[]>();
  
  for (const file of files) {
    const dir = path.dirname(file.path);
    if (!filesByDir.has(dir)) {
      filesByDir.set(dir, []);
    }
    filesByDir.get(dir)!.push(file);
  }

  const sortedDirs = Array.from(filesByDir.keys()).sort();

  for (const dir of sortedDirs) {
    const dirFiles = filesByDir.get(dir)!;
    const dirLevel = dir === '.' ? 0 : dir.split(path.sep).length;
    const indent = '  '.repeat(dirLevel);

    if (dir !== '.') {
      lines.push(`${indent}- **${dir}/**`);
    }

    for (const file of dirFiles) {
      const fileName = path.basename(file.path);
      const fileIndent = dir === '.' ? '' : '  ';
      lines.push(`${indent}${fileIndent}- [${fileName}](${file.path})`);
      
      for (const header of file.headers) {
        const headerIndent = '  '.repeat(header.level - 1);
        lines.push(`${indent}${fileIndent}  ${headerIndent}- [${header.text}](${file.path}#${header.anchor})`);
      }
    }
  }

  return lines.join('\n');
}

export { Config } from './config';
export { parseMarkdown } from './parser';