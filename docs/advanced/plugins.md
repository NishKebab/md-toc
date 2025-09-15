# Plugin System

## Overview

### What are Plugins?
Plugins extend the functionality of md-toc with custom processing.

### Why Use Plugins?
- Add custom formatting
- Integrate with other tools
- Extend parsing capabilities

## Creating Plugins

### Plugin Structure
A basic plugin follows this structure:

```javascript
module.exports = {
  name: 'my-plugin',
  process: (toc, config) => {
    // Process the TOC
    return modifiedToc;
  }
}
```

### Plugin Lifecycle
1. Configuration loading
2. File scanning
3. Markdown parsing
4. TOC generation
5. Plugin processing
6. Output writing

## Available Plugins

### Official Plugins
- Sort plugin - Alphabetically sort entries
- Filter plugin - Advanced filtering options
- Format plugin - Custom formatting

### Community Plugins
Check our GitHub wiki for community-contributed plugins.

## Plugin Development

### Best Practices
- Keep plugins focused on a single task
- Provide clear documentation
- Include tests with your plugin

### Testing Plugins
Use the test harness to validate your plugin:

```bash
npm run test-plugin my-plugin
```