import * as fs from 'fs';
import * as path from 'path';
import { loadConfig, createDefaultConfig } from '../config';

const testDir = path.join(__dirname, 'test-configs');

beforeAll(() => {
  if (!fs.existsSync(testDir)) {
    fs.mkdirSync(testDir, { recursive: true });
  }
});

afterAll(() => {
  if (fs.existsSync(testDir)) {
    fs.rmSync(testDir, { recursive: true, force: true });
  }
});

describe('loadConfig', () => {
  it('should load JSON config', async () => {
    const configPath = path.join(testDir, 'config.json');
    const config = {
      ignore: ['test/**'],
      include: ['src/**/*.md'],
      maxDepth: 5
    };
    
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    
    const loaded = await loadConfig(configPath);
    expect(loaded).toEqual(config);
  });

  it('should load YAML config', async () => {
    const configPath = path.join(testDir, 'config.yaml');
    const yamlContent = `ignore:
  - test/**
include:
  - src/**/*.md
maxDepth: 5`;
    
    fs.writeFileSync(configPath, yamlContent);
    
    const loaded = await loadConfig(configPath);
    expect(loaded.ignore).toEqual(['test/**']);
    expect(loaded.include).toEqual(['src/**/*.md']);
    expect(loaded.maxDepth).toBe(5);
  });

  it('should auto-detect format for files without extension', async () => {
    const configPath = path.join(testDir, '.mdtoc');
    const config = {
      ignore: ['node_modules/**'],
      maxDepth: 3
    };
    
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    
    const loaded = await loadConfig(configPath);
    expect(loaded).toEqual(config);
  });
});

describe('createDefaultConfig', () => {
  it('should return default configuration', () => {
    const config = createDefaultConfig();
    
    expect(config.ignore).toContain('node_modules/**');
    expect(config.ignore).toContain('.git/**');
    expect(config.include).toEqual(['**/*.md']);
    expect(config.maxDepth).toBe(10);
    expect(config.excludeReadme).toBe(false);
    expect(config.title).toBe('Table of Contents');
    expect(config.insertMarker).toBe('<!-- TOC -->');
  });
});