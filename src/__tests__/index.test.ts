import * as fs from 'fs';
import * as path from 'path';
import { generateToc } from '../index';
import { Config } from '../config';

const testDir = path.join(__dirname, 'test-markdown');

beforeAll(() => {
  if (!fs.existsSync(testDir)) {
    fs.mkdirSync(testDir, { recursive: true });
  }
  
  fs.writeFileSync(path.join(testDir, 'README.md'), `# Project Title
## Overview
This is a test project.
## Installation
### Requirements
Node.js 14+
### Steps
1. Clone repo
2. Install deps`);

  const docsDir = path.join(testDir, 'docs');
  fs.mkdirSync(docsDir, { recursive: true });
  
  fs.writeFileSync(path.join(docsDir, 'guide.md'), `# User Guide
## Getting Started
### First Steps
## Advanced Usage`);

  fs.writeFileSync(path.join(docsDir, 'api.md'), `# API Reference
## Classes
### MyClass
## Functions
### myFunction`);

  const srcDir = path.join(testDir, 'src');
  fs.mkdirSync(srcDir, { recursive: true });
  
  fs.writeFileSync(path.join(srcDir, 'notes.md'), `# Developer Notes
## Architecture
## Code Style`);

  fs.writeFileSync(path.join(testDir, 'ignore-me.test.md'), `# Test File
Should be ignored`);
});

afterAll(() => {
  if (fs.existsSync(testDir)) {
    fs.rmSync(testDir, { recursive: true, force: true });
  }
});

describe('generateToc', () => {
  it('should generate TOC for all markdown files', async () => {
    const config: Config = {
      include: ['**/*.md'],
      ignore: [],
      maxDepth: 10
    };

    const toc = await generateToc(testDir, config);
    
    expect(toc).toContain('README.md');
    expect(toc).toContain('docs/api.md');
    expect(toc).toContain('docs/guide.md');
    expect(toc).toContain('src/notes.md');
    expect(toc).toContain('Project Title');
    expect(toc).toContain('User Guide');
    expect(toc).toContain('API Reference');
  });

  it('should respect ignore patterns', async () => {
    const config: Config = {
      include: ['**/*.md'],
      ignore: ['*.test.md', 'src/**'],
      maxDepth: 10
    };

    const toc = await generateToc(testDir, config);
    
    expect(toc).toContain('README.md');
    expect(toc).toContain('docs/api.md');
    expect(toc).not.toContain('ignore-me.test.md');
    expect(toc).not.toContain('src/notes.md');
  });

  it('should respect maxDepth option', async () => {
    const config: Config = {
      include: ['**/*.md'],
      ignore: [],
      maxDepth: 1
    };

    const toc = await generateToc(testDir, config);
    
    expect(toc).toContain('README.md');
    expect(toc).not.toContain('docs/api.md');
    expect(toc).not.toContain('src/notes.md');
  });

  it('should exclude README when configured', async () => {
    const config: Config = {
      include: ['**/*.md'],
      ignore: [],
      excludeReadme: true,
      maxDepth: 10
    };

    const toc = await generateToc(testDir, config);
    
    expect(toc).not.toContain('README.md');
    expect(toc).toContain('docs/api.md');
    expect(toc).toContain('docs/guide.md');
  });

  it('should add custom title when provided', async () => {
    const config: Config = {
      include: ['**/*.md'],
      ignore: [],
      title: 'Documentation Index',
      maxDepth: 10
    };

    const toc = await generateToc(testDir, config);
    
    expect(toc).toContain('# Documentation Index');
  });

  it('should generate proper anchor links', async () => {
    const config: Config = {
      include: ['**/*.md'],
      ignore: [],
      maxDepth: 10
    };

    const toc = await generateToc(testDir, config);
    
    expect(toc).toContain('[Overview](README.md#overview)');
    expect(toc).toContain('[Installation](README.md#installation)');
    expect(toc).toContain('[Getting Started](docs/guide.md#getting-started)');
    expect(toc).toContain('[Classes](docs/api.md#classes)');
  });

  it('should handle nested headers with proper indentation', async () => {
    const config: Config = {
      include: ['**/*.md'],
      ignore: [],
      maxDepth: 10
    };

    const toc = await generateToc(testDir, config);
    const lines = toc.split('\n');
    
    const overviewIndex = lines.findIndex(l => l.includes('[Overview]'));
    const requirementsIndex = lines.findIndex(l => l.includes('[Requirements]'));
    
    expect(overviewIndex).toBeGreaterThan(-1);
    expect(requirementsIndex).toBeGreaterThan(overviewIndex);
    
    const overviewLine = lines[overviewIndex];
    const requirementsLine = lines[requirementsIndex];
    
    expect(requirementsLine.indexOf('-')).toBeGreaterThan(overviewLine.indexOf('-'));
  });
});