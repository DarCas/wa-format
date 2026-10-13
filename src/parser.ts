import type { Document } from "./ast.js";
import { parseBlocks } from "./blocks.js";

/**
 * Parses WhatsApp-formatted text into an {@link Document} tree.
 *
 * The input is normalized first (`\r\n` and `\r` become `\n`), then parsed.
 * This function does not trim or validate whitespace; {@link toHTML} applies
 * the `trim` option and the empty-input rule.
 */
export function parse(input: string): Document {
  const normalized = input.replace(/\r\n?/g, "\n");
  return { children: parseBlocks(normalized) };
}
