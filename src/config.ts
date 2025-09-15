import * as fs from 'fs';
import * as yaml from 'js-yaml';

export interface Config {
  ignore?: string[];
  include?: string[];
  maxDepth?: number;
  excludeReadme?: boolean;
  title?: string;
  insertMarker?: string;
}

export async function loadConfig(configPath: string): Promise<Config> {
  const content = fs.readFileSync(configPath, 'utf-8');
  
  if (configPath.endsWith('.json')) {
    return JSON.parse(content);
  } else if (configPath.endsWith('.yaml') || configPath.endsWith('.yml')) {
    return yaml.load(content) as Config;
  } else {
    try {
      return JSON.parse(content);
    } catch {
      return yaml.load(content) as Config;
    }
  }
}

export function createDefaultConfig(): Config {
  return {
    ignore: [
      'node_modules/**',
      '.git/**',
      'dist/**',
      'build/**',
      'coverage/**',
      '*.test.md',
      '*.spec.md'
    ],
    include: ['**/*.md'],
    maxDepth: 10,
    excludeReadme: false,
    title: 'Table of Contents',
    insertMarker: '<!-- TOC -->'
  };
}