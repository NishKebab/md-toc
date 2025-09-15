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

      const toc = await generateToc(targetDir, config);

      if (options.dryRun) {
        console.log('Generated TOC:');
        console.log(toc);
      } else {
        if (config.insertMarker && fs.existsSync(outputFile)) {
          const content = fs.readFileSync(outputFile, 'utf-8');
          const markerRegex = new RegExp(`${config.insertMarker}[\\s\\S]*?${config.insertMarker}`, 'g');
          
          if (markerRegex.test(content)) {
            const updatedContent = content.replace(
              markerRegex,
              `${config.insertMarker}\n${toc}\n${config.insertMarker}`
            );
            fs.writeFileSync(outputFile, updatedContent);
            console.log(`✅ TOC updated in ${outputFile}`);
          } else {
            const marker = config.insertMarker;
            const tocBlock = `${marker}\n${toc}\n${marker}`;
            const lines = content.split('\n');
            
            if (lines[0].startsWith('#')) {
              lines.splice(1, 0, '', tocBlock);
            } else {
              lines.unshift(tocBlock, '');
            }
            
            fs.writeFileSync(outputFile, lines.join('\n'));
            console.log(`✅ TOC inserted in ${outputFile}`);
          }
        } else {
          fs.writeFileSync(outputFile, toc);
          console.log(`✅ TOC written to ${outputFile}`);
        }
      }
    } catch (error) {
      console.error('Error generating TOC:', error);
      process.exit(1);
    }
  });

program.parse();