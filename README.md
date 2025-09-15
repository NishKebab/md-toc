# md-toc

A TypeScript CLI tool that recursively generates a table of contents for all markdown files in a repository.

## Features

- 🔍 Recursively scans directories for markdown files
- 📝 Generates hierarchical table of contents with all headers
- ⚙️ Configurable via `.mdtoc` file (supports YAML/JSON)
- 🚫 Gitignore-style pattern matching for excluding files
- 📊 Respects maximum depth settings
- 🎯 Can insert TOC at specific markers in existing files
- 🧪 Fully tested with Jest

## Installation

```bash
npm install -g md-toc
```

Or run directly with npx:

```bash
npx md-toc
```

## Usage

### Basic Usage

Generate TOC for current directory and save to README.md:

```bash
md-toc
```

### Custom Output File

```bash
md-toc -o docs/INDEX.md
```

### Specify Directory

```bash
md-toc ./my-project -o my-project/TOC.md
```

### Dry Run (Preview)

```bash
md-toc --dry-run
```

### Insert at Marker

Insert TOC between markers in existing file:

```bash
md-toc --insert-at "<!-- TOC -->"
```

## Configuration

Create a `.mdtoc` file in your project root:

```yaml
# Patterns to ignore (gitignore-style)
ignore:
  - node_modules/**
  - .git/**
  - dist/**
  - "*.test.md"

# Patterns to include (glob patterns)
include:
  - "**/*.md"
  - "**/*.markdown"

# Maximum directory depth to traverse
maxDepth: 10

# Whether to exclude README.md files
excludeReadme: false

# Title for the table of contents
title: "Table of Contents"

# Marker for inserting TOC
insertMarker: "<!-- TOC -->"
```

### JSON Configuration

You can also use JSON format:

```json
{
  "ignore": ["node_modules/**", "dist/**"],
  "include": ["**/*.md"],
  "maxDepth": 5,
  "excludeReadme": false,
  "title": "Documentation Index"
}
```

## Command Line Options

- `-o, --output <file>` - Output file (default: README.md)
- `-c, --config <file>` - Config file path (default: .mdtoc)
- `-d, --max-depth <depth>` - Maximum directory depth (default: 10)
- `-t, --title <title>` - TOC title (default: "Table of Contents")
- `--dry-run` - Preview without writing files
- `--insert-at <marker>` - Insert at specific marker

## Example Output

```markdown
# Table of Contents

- [README.md](README.md)
  - [Features](README.md#features)
  - [Installation](README.md#installation)
  - [Usage](README.md#usage)
- **docs/**
  - [api.md](docs/api.md)
    - [Classes](docs/api.md#classes)
    - [Functions](docs/api.md#functions)
  - [guide.md](docs/guide.md)
    - [Getting Started](docs/guide.md#getting-started)
    - [Advanced Usage](docs/guide.md#advanced-usage)
```

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Run tests
npm test

# Watch mode
npm run dev
```

## License

MIT