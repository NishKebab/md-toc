import * as fs from 'fs';
import * as path from 'path';
import { generateToc } from '../index';
import { Config } from '../config';

const testDir = path.join(__dirname, 'test-ignore');

beforeAll(() => {
  // Create test directory structure with node_modules
  if (!fs.existsSync(testDir)) {
    fs.mkdirSync(testDir, { recursive: true });
  }
  
  // Create main README
  fs.writeFileSync(path.join(testDir, 'README.md'), `# Main Project
## Overview
This is the main project file.`);

  // Create docs directory
  const docsDir = path.join(testDir, 'docs');
  fs.mkdirSync(docsDir, { recursive: true });
  fs.writeFileSync(path.join(docsDir, 'guide.md'), `# Documentation
## User Guide`);

  // Create node_modules with README files that should be ignored
  const nodeModulesDir = path.join(testDir, 'node_modules');
  fs.mkdirSync(nodeModulesDir, { recursive: true });
  
  const packageDir = path.join(nodeModulesDir, 'some-package');
  fs.mkdirSync(packageDir, { recursive: true });
  fs.writeFileSync(path.join(packageDir, 'README.md'), `# Some Package
## This should be ignored`);
  
  const nestedPackageDir = path.join(nodeModulesDir, '@scope', 'package');
  fs.mkdirSync(nestedPackageDir, { recursive: true });
  fs.writeFileSync(path.join(nestedPackageDir, 'README.md'), `# Scoped Package
## This should also be ignored`);

  // Create .git directory with README that should be ignored
  const gitDir = path.join(testDir, '.git');
  fs.mkdirSync(gitDir, { recursive: true });
  fs.writeFileSync(path.join(gitDir, 'README.md'), `# Git README
## This should be ignored`);

  // Create dist directory with README that should be configurable
  const distDir = path.join(testDir, 'dist');
  fs.mkdirSync(distDir, { recursive: true });
  fs.writeFileSync(path.join(distDir, 'README.md'), `# Dist README
## This should be ignored when configured`);

  // Create test files that should be ignored with patterns
  fs.writeFileSync(path.join(testDir, 'test.draft.md'), `# Draft
## This is a draft`);
  
  fs.writeFileSync(path.join(testDir, 'example.test.md'), `# Test File
## This is a test file`);
});

afterAll(() => {
  if (fs.existsSync(testDir)) {
    fs.rmSync(testDir, { recursive: true, force: true });
  }
});

describe('ignore patterns', () => {
  it('should always ignore node_modules and .git directories', async () => {
    const config: Config = {
      include: ['**/*.md'],
      ignore: [],
      maxDepth: 10
    };

    const toc = await generateToc(testDir, config);
    
    // Should include main files
    expect(toc).toContain('README.md');
    expect(toc).toContain('docs/guide.md');
    
    // Should NOT include node_modules files
    expect(toc).not.toContain('node_modules');
    expect(toc).not.toContain('Some Package');
    expect(toc).not.toContain('Scoped Package');
    
    // Should NOT include .git files
    expect(toc).not.toContain('.git');
    expect(toc).not.toContain('Git README');
  });

  it('should respect additional ignore patterns from config', async () => {
    const config: Config = {
      include: ['**/*.md'],
      ignore: ['dist/**', '*.draft.md', '*.test.md'],
      maxDepth: 10
    };

    const toc = await generateToc(testDir, config);
    
    // Should include main files
    expect(toc).toContain('README.md');
    expect(toc).toContain('docs/guide.md');
    
    // Should NOT include ignored patterns
    expect(toc).not.toContain('dist/README.md');
    expect(toc).not.toContain('Dist README');
    expect(toc).not.toContain('test.draft.md');
    expect(toc).not.toContain('example.test.md');
  });

  it('should work correctly when run from a different directory', async () => {
    // Simulate running from parent directory
    const parentDir = path.dirname(testDir);
    const relativeTestDir = path.basename(testDir);
    
    // Change to parent directory context
    const originalCwd = process.cwd();
    process.chdir(parentDir);
    
    try {
      const config: Config = {
        include: ['**/*.md'],
        ignore: ['dist/**', '*.draft.md'],
        maxDepth: 10
      };

      const toc = await generateToc(relativeTestDir, config);
      
      // Should still properly ignore node_modules
      expect(toc).not.toContain('node_modules');
      expect(toc).not.toContain('Some Package');
      
      // Should still properly ignore custom patterns
      expect(toc).not.toContain('dist/README.md');
      expect(toc).not.toContain('test.draft.md');
      
      // Should include valid files
      expect(toc).toContain('README.md');
      expect(toc).toContain('docs/guide.md');
    } finally {
      process.chdir(originalCwd);
    }
  });

  it('should handle deeply nested node_modules', async () => {
    // Create nested project with its own node_modules
    const subprojectDir = path.join(testDir, 'subproject');
    fs.mkdirSync(subprojectDir, { recursive: true });
    fs.writeFileSync(path.join(subprojectDir, 'README.md'), `# Subproject
## Subproject Overview`);
    
    const nestedNodeModules = path.join(subprojectDir, 'node_modules', 'nested-package');
    fs.mkdirSync(nestedNodeModules, { recursive: true });
    fs.writeFileSync(path.join(nestedNodeModules, 'README.md'), `# Nested Package
## Should be ignored`);
    
    try {
      const config: Config = {
        include: ['**/*.md'],
        ignore: [],
        maxDepth: 10
      };

      const toc = await generateToc(testDir, config);
      
      // Should include subproject README
      expect(toc).toContain('subproject/README.md');
      expect(toc).toContain('Subproject Overview');
      
      // Should NOT include nested node_modules
      expect(toc).not.toContain('nested-package');
      expect(toc).not.toContain('Nested Package');
    } finally {
      fs.rmSync(subprojectDir, { recursive: true, force: true });
    }
  });
});