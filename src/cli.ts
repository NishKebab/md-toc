#!/usr/bin/env node

import { Command } from 'commander';
import * as fs from 'fs';
import * as path from 'path';
import { generateToc } from './index';
import { Config, loadConfig } from './config';

const program = new Command();

program
  .name('md-toc')
  .description('Generate table of contents for all markdown files in a repository')
  .version('1.0.0')
  .option('-o, --output <file>', 'output file to write TOC to', 'README.md')
  .option('-c, --config <file>', 'config file path', '.mdtoc')
  .option('-d, --max-depth <depth>', 'maximum directory depth to traverse', '10')
  .option('-t, --title <title>', 'title for the table of contents', 'Table of Contents')
  .option('--dry-run', 'show what would be generated without writing files')
  .option('--insert-at <marker>', 'insert TOC at a specific marker in the file', '<!-- TOC -->')
  .argument('[directory]', 'directory to scan for markdown files', '.')
  .action(async (directory, options) => {
    try {
      const configPath = path.resolve(options.config);
      let config: Config = {
        ignore: [],
        include: ['**/*.md'],
        maxDepth: parseInt(options.maxDepth, 10),
        excludeReadme: false,
        title: options.title,
        insertMarker: options.insertAt
      };

      if (fs.existsSync(configPath)) {
        const loadedConfig = await loadConfig(configPath);
        config = { ...config, ...loadedConfig };
      }

      const targetDir = path.resolve(directory);
      const outputFile = path.resolve(targetDir, options.output);
      
      // Add output file to ignore list to prevent self-reference
      const outputRelative = path.relative(targetDir, outputFile);
      if (!config.ignore) {
        config.ignore = [];
      }
      if (!config.ignore.includes(outputRelative)) {
        config.ignore.push(outputRelative);
      }

      const toc = await generateToc(targetDir, config);

      if (options.dryRun) {
        console.log('Generated TOC:');
        console.log(toc);
      } else {
        if (fs.existsSync(outputFile)) {
          // File exists - preserve content and insert/update TOC
          const content = fs.readFileSync(outputFile, 'utf-8');
          const marker = config.insertMarker || '<!-- TOC -->';
          const markerRegex = new RegExp(`${marker.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[\\s\\S]*?${marker.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'g');
          
          if (markerRegex.test(content)) {
            // Markers exist - update between them
            const updatedContent = content.replace(
              markerRegex,
              `${marker}\n${toc}\n${marker}`
            );
            fs.writeFileSync(outputFile, updatedContent);
            console.log(`✅ TOC updated in ${outputFile}`);
          } else {
            // No markers - insert TOC at the top, preserving existing content
            const tocBlock = `${marker}\n${toc}\n${marker}`;
            const lines = content.split('\n');
            
            if (lines[0].startsWith('#')) {
              // Insert after the first heading
              lines.splice(1, 0, '', tocBlock, '');
            } else {
              // Insert at the very top
              lines.unshift(tocBlock, '');
            }
            
            fs.writeFileSync(outputFile, lines.join('\n'));
            console.log(`✅ TOC inserted in ${outputFile}`);
          }
        } else {
          // File doesn't exist - create new file with TOC
          const marker = config.insertMarker || '<!-- TOC -->';
          const tocWithMarkers = `${marker}\n${toc}\n${marker}`;
          fs.writeFileSync(outputFile, tocWithMarkers);
          console.log(`✅ TOC written to ${outputFile}`);
        }
      }
    } catch (error) {
      console.error('Error generating TOC:', error);
      process.exit(1);
    }
  });

program.parse();