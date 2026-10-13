import type { InlineStyle } from "./ast.js";

/** Bold marker: `*text*`. */
export const BOLD_MARKER = "*";
/** Italic marker: `_text_`. */
export const ITALIC_MARKER = "_";
/** Strikethrough marker: `~text~`. */
export const STRIKE_MARKER = "~";
/** Inline code marker: `` `text` ``. */
export const CODE_MARKER = "`";
/** Code block marker: ` ```text``` `. */
export const CODE_BLOCK_MARKER = "```";
/** Block quote marker: `> text`. */
export const QUOTE_MARKER = ">";
/** Bulleted list markers: `- text` or `* text`. */
export const BULLET_MARKERS = ["-", "*"] as const;

/**
 * Maps an inline marker character to its style.
 * Only `*`, `_` and `~` delimit nestable styles; backticks are handled
 * separately because code is opaque (its content is never re-parsed).
 */
export const STYLE_BY_MARKER: Readonly<Record<string, InlineStyle | undefined>> = {
  [BOLD_MARKER]: "bold",
  [ITALIC_MARKER]: "italic",
  [STRIKE_MARKER]: "strike",
};

const WORD_CHAR = /[\p{L}\p{N}]/u;
const WHITESPACE = /\s/u;

/**
 * True when `ch` is a letter or a digit (Unicode aware).
 * Underscore is deliberately excluded: `_` is a marker, not a word character,
 * so `*_bold italic_*` can nest.
 */
export function isWordChar(ch: string): boolean {
  return WORD_CHAR.test(ch);
}

/** True when `ch` is whitespace (space, tab, newline, ...). */
export function isWhitespace(ch: string): boolean {
  return WHITESPACE.test(ch);
}
