export interface Header {
  level: number;
  text: string;
  anchor: string;
}

export interface MarkdownFile {
  path: string;
  headers: Header[];
}

export function parseMarkdown(content: string, filePath: string): MarkdownFile {
  const headers: Header[] = [];
  const lines = content.split('\n');
  const seenAnchors = new Set<string>();
  let inCodeBlock = false;

  for (const line of lines) {
    if (line.startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      continue;
    }

    if (inCodeBlock) {
      continue;
    }

    const hashMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (hashMatch) {
      const level = hashMatch[1].length;
      const text = hashMatch[2].trim();
      const anchor = generateAnchor(text, seenAnchors);
      headers.push({ level, text, anchor });
    }
  }

  return {
    path: filePath,
    headers
  };
}

function generateAnchor(text: string, seenAnchors: Set<string>): string {
  let anchor = text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/^-+|-+$/g, '');

  if (seenAnchors.has(anchor)) {
    let counter = 1;
    while (seenAnchors.has(`${anchor}-${counter}`)) {
      counter++;
    }
    anchor = `${anchor}-${counter}`;
  }

  seenAnchors.add(anchor);
  return anchor;
}