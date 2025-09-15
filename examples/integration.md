# Integration Examples

## CI/CD Integration

### GitHub Actions
Automate TOC generation in your GitHub workflow:

```yaml
name: Update TOC
on:
  push:
    paths:
      - '**.md'
jobs:
  update-toc:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: npx md-toc
      - run: git commit -am "Update TOC"
```

### GitLab CI
Integration with GitLab CI/CD:

```yaml
update-toc:
  script:
    - npx md-toc
    - git add README.md
    - git commit -m "Update TOC"
```

## Build Tool Integration

### npm Scripts
Add to your package.json:

```json
{
  "scripts": {
    "toc": "md-toc",
    "toc:check": "md-toc --dry-run"
  }
}
```

### Pre-commit Hooks
Using husky for automatic TOC updates:

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "npm run toc && git add README.md"
    }
  }
}
```

## Documentation Generators

### Docusaurus Integration
Use md-toc with Docusaurus projects.

### MkDocs Integration
Integrate with MkDocs documentation sites.

### VuePress Integration
Add automatic TOC generation to VuePress builds.