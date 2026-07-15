import React from "react";

const LINK_PATTERN = /\[([^\]]+)\]\(([^)]+)\)/g;

export function parseLinks(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  LINK_PATTERN.lastIndex = 0;

  while ((match = LINK_PATTERN.exec(text)) !== null) {
    const [fullMatch, displayText, url] = match;
    const start = match.index;

    if (start > lastIndex) {
      parts.push(text.slice(lastIndex, start));
    }

    parts.push(
      <a
        key={`link-${key++}`}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-brand underline underline-offset-2 hover:opacity-80"
      >
        {displayText}
      </a>
    );

    lastIndex = start + fullMatch.length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}