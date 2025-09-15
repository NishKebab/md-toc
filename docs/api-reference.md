# API Reference

## Core Functions

### generateToc(directory, config)
Main function that generates the table of contents.

#### Parameters
- `directory` (string): The root directory to scan
- `config` (Config): Configuration object

#### Returns
Returns a string containing the formatted table of contents.

### parseMarkdown(content, filePath)
Parses markdown content and extracts headers.

#### Parameters
- `content` (string): The markdown content to parse
- `filePath` (string): Path to the markdown file

#### Returns
Returns a MarkdownFile object with parsed headers.

## Configuration

### Config Interface
The main configuration interface for md-toc.

```typescript
interface Config {
  ignore?: string[];
  include?: string[];
  maxDepth?: number;
  excludeReadme?: boolean;
  title?: string;
  insertMarker?: string;
}
```

### Default Configuration
The default configuration values used when no config file is provided.

## CLI Commands

### Basic Command
```bash
md-toc [options] [directory]
```

### Options Reference
- `-o, --output`: Specify output file
- `-c, --config`: Path to configuration file
- `-d, --max-depth`: Maximum directory depth
- `--dry-run`: Preview without writing

## Types

### Header Type
Represents a parsed markdown header.

### MarkdownFile Type
Represents a parsed markdown file with its headers.