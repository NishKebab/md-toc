import { parseMarkdown } from '../parser';

describe('parseMarkdown', () => {
  it('should parse headers correctly', () => {
    const content = `# Header 1
## Header 2
### Header 3
#### Header 4
##### Header 5
###### Header 6`;

    const result = parseMarkdown(content, 'test.md');
    
    expect(result.path).toBe('test.md');
    expect(result.headers).toHaveLength(6);
    expect(result.headers[0]).toEqual({
      level: 1,
      text: 'Header 1',
      anchor: 'header-1'
    });
    expect(result.headers[5]).toEqual({
      level: 6,
      text: 'Header 6',
      anchor: 'header-6'
    });
  });

  it('should ignore headers in code blocks', () => {
    const content = `# Real Header
\`\`\`
# This is not a header
\`\`\`
## Another Real Header`;

    const result = parseMarkdown(content, 'test.md');
    
    expect(result.headers).toHaveLength(2);
    expect(result.headers[0].text).toBe('Real Header');
    expect(result.headers[1].text).toBe('Another Real Header');
  });

  it('should handle duplicate header names', () => {
    const content = `# Test
## Test
### Test`;

    const result = parseMarkdown(content, 'test.md');
    
    expect(result.headers[0].anchor).toBe('test');
    expect(result.headers[1].anchor).toBe('test-1');
    expect(result.headers[2].anchor).toBe('test-2');
  });

  it('should sanitize special characters in anchors', () => {
    const content = `# Hello, World!
## What's New?
### 100% Complete`;

    const result = parseMarkdown(content, 'test.md');
    
    expect(result.headers[0].anchor).toBe('hello-world');
    expect(result.headers[1].anchor).toBe('whats-new');
    expect(result.headers[2].anchor).toBe('100-complete');
  });

  it('should return empty headers array for content without headers', () => {
    const content = `This is just plain text.
No headers here.`;

    const result = parseMarkdown(content, 'test.md');
    
    expect(result.headers).toHaveLength(0);
  });
});