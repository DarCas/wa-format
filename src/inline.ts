import type { InlineNode, InlineStyle } from "./ast.js";
import { isWhitespace, isWordChar, STYLE_BY_MARKER } from "./constants.js";

interface OpenFrame {
  style: InlineStyle;
  marker: string;
  /** Array that receives this frame's finished style node. */
  parent: InlineNode[];
  /** Array that receives the frame's children while it is open. */
  children: InlineNode[];
}

/** Appends text to `target`, merging with a preceding text node when possible. */
function addText(target: InlineNode[], value: string): void {
  if (value === "") return;
  const last = target[target.length - 1];
  if (last !== undefined && last.type === "text") {
    last.value += value;
  } else {
    target.push({ type: "text", value });
  }
}

/** Number of consecutive backticks starting at `start`. */
function backtickRun(text: string, start: number): number {
  let n = 0;
  while (start + n < text.length && text[start + n] === "`") n++;
  return n;
}

/** Index of the next run of at least `min` backticks at or after `from`, or -1. */
function findBacktickRun(text: string, from: number, min: number): number {
  let i = from;
  while (i < text.length) {
    if (text[i] === "`") {
      const run = backtickRun(text, i);
      if (run >= min) return i;
      i += run;
    } else {
      i++;
    }
  }
  return -1;
}

/**
 * Parses inline WhatsApp formatting (bold, italic, strikethrough, inline code,
 * code blocks, and line breaks) from a single text fragment.
 *
 * `\n` characters become line breaks. Code spans/blocks are opaque: their
 * content is captured verbatim and never re-parsed.
 */
export function parseInline(text: string): InlineNode[] {
  const root: InlineNode[] = [];
  const stack: OpenFrame[] = [];
  const n = text.length;
  let i = 0;

  const current = (): InlineNode[] =>
    stack.length > 0 ? (stack[stack.length - 1] as OpenFrame).children : root;

  while (i < n) {
    const ch = text[i] as string;

    if (ch === "`") {
      const run = backtickRun(text, i);
      const closing = findBacktickRun(text, i + run, run);
      if (closing === -1) {
        addText(current(), text.slice(i, i + run));
        i += run;
        continue;
      }
      const value = text.slice(i + run, closing);
      const node: InlineNode =
        run >= 3 ? { type: "codeBlock", value } : { type: "code", value };
      current().push(node);
      i = closing + backtickRun(text, closing);
      continue;
    }

    const style = STYLE_BY_MARKER[ch];
    if (style !== undefined) {
      const prev = i > 0 ? (text[i - 1] as string) : undefined;
      const next = i + 1 < n ? (text[i + 1] as string) : undefined;
      const top = stack.length > 0 ? (stack[stack.length - 1] as OpenFrame) : undefined;

      const canClose =
        top !== undefined &&
        top.style === style &&
        prev !== undefined &&
        !isWhitespace(prev) &&
        (next === undefined || !isWordChar(next));

      if (canClose) {
        const frame = stack.pop() as OpenFrame;
        if (frame.children.length === 0) {
          // Empty span (`**`, `__`, `~~`): keep both markers as literal text
          // instead of emitting an empty element that would render as nothing.
          addText(frame.parent, frame.marker);
          addText(frame.parent, ch);
        } else {
          frame.parent.push({ type: "style", style, children: frame.children });
        }
        i++;
        continue;
      }

      const canOpen =
        (prev === undefined || !isWordChar(prev)) &&
        next !== undefined &&
        !isWhitespace(next);

      if (canOpen) {
        stack.push({ style, marker: ch, parent: current(), children: [] });
        i++;
        continue;
      }

      addText(current(), ch);
      i++;
      continue;
    }

    if (ch === "\n") {
      current().push({ type: "br" });
      i++;
      continue;
    }

    addText(current(), ch);
    i++;
  }

  // Any style left open was never closed: emit its marker back as literal text
  // and splice its children into the parent, preserving order.
  while (stack.length > 0) {
    const frame = stack.pop() as OpenFrame;
    addText(frame.parent, frame.marker);
    for (const child of frame.children) frame.parent.push(child);
  }

  return root;
}
