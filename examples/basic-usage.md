# Basic Usage Examples

## Simple Project Structure

### Flat Structure
For projects with all markdown files in the root:

```
project/
├── README.md
├── CONTRIBUTING.md
├── LICENSE.md
└── CHANGELOG.md
```

### Nested Structure
For projects with organized documentation:

```
project/
├── README.md
├── docs/
│   ├── guide.md
│   └── api.md
└── examples/
    └── tutorial.md
```

## Command Examples

### Generate Default TOC
```bash
md-toc
```

### Custom Output File
```bash
md-toc -o INDEX.md
```

### Dry Run Mode
```bash
md-toc --dry-run
```

## Configuration Examples

### Minimal Configuration
```yaml
ignore:
  - node_modules/**
```

### Complex Configuration
```yaml
ignore:
  - node_modules/**
  - "*.draft.md"
include:
  - "docs/**/*.md"
  - "guides/**/*.md"
maxDepth: 3
title: "Project Documentation"
```