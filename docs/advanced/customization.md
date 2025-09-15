# Customization Guide

## Configuration File Formats

### YAML Configuration
YAML is the recommended format for configuration files.

#### Basic Example
```yaml
ignore:
  - node_modules/**
  - dist/**
```

#### Advanced Example
```yaml
ignore:
  - "*.test.md"
  - "**/*.draft.md"
include:
  - "docs/**/*.md"
maxDepth: 5
```

### JSON Configuration
JSON format is also supported for configuration.

## Ignore Patterns

### Gitignore-style Patterns
The ignore patterns follow gitignore syntax:
- `*` matches any sequence of characters
- `**` matches any number of directories
- `!` negates a pattern

### Common Patterns
- `node_modules/**` - Ignore all node_modules
- `*.test.md` - Ignore test files
- `build/**` - Ignore build directory

## Custom Markers

### Inserting at Specific Locations
Use custom markers to control where the TOC is inserted.

### Marker Syntax
The default marker is `<!-- TOC -->` but you can customize it.

## Programmatic Usage

### Using as a Library
You can also use md-toc programmatically in your Node.js applications.

### Example Integration
```javascript
const { generateToc } = require('md-toc');
```