/** Options accepted by {@link toHTML}. */
export interface FormatOptions {
  /**
   * Which tags to emit for bold and italic:
   * - `"semantic"` (default): `<b>`, `<i>`, `<s>`
   * - `"legacy"`: `<strong>`, `<em>`, `<s>`
   */
  style?: "semantic" | "legacy";
  /** Render `\n` as `<br>`. When `false`, newlines are kept as `\n`. Default `true`. */
  lineBreaks?: boolean;
  /** Trim leading/trailing whitespace from the input before parsing. Default `false`. */
  trim?: boolean;
}

/** {@link FormatOptions} with every field required (defaults applied). */
export interface ResolvedOptions {
  style: "semantic" | "legacy";
  lineBreaks: boolean;
  trim: boolean;
}

export const DEFAULT_OPTIONS: ResolvedOptions = {
  style: "semantic",
  lineBreaks: true,
  trim: false,
};

/** Applies defaults to user-supplied options. */
export function resolveOptions(options?: FormatOptions): ResolvedOptions {
  if (options === undefined) return { ...DEFAULT_OPTIONS };
  return {
    style: options.style ?? DEFAULT_OPTIONS.style,
    lineBreaks: options.lineBreaks ?? DEFAULT_OPTIONS.lineBreaks,
    trim: options.trim ?? DEFAULT_OPTIONS.trim,
  };
}
