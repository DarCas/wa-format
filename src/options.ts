/*
 * Dario Casertano <dario@casertano.name>
 * Copyright (c) 2026 Casertano Dario – All rights reserved.
 * Licensed under the MIT License.
 */

/** Options accepted by {@link toHTML}. */
export interface FormatOptions {
    /** Render `\n` as `<br>`. When `false`, newlines are kept as `\n`. Default `true`. */
    lineBreaks?: boolean
    /**
     * Which tags to emit for bold and italic:
     * - `"semantic"` (default): `<b>`, `<i>`, `<s>`
     * - `"legacy"`: `<strong>`, `<em>`, `<s>`
     */
    style?: "semantic" | "legacy"
    /** Trim leading/trailing whitespace from the input before parsing. Default `false`. */
    trim?: boolean
}

/** {@link FormatOptions} with every field required (defaults applied). */
export interface ResolvedOptions {
    lineBreaks: boolean
    style: "semantic" | "legacy"
    trim: boolean
}

export const DEFAULT_OPTIONS: ResolvedOptions = {
    lineBreaks: true,
    style: "semantic",
    trim: false,
}

/** Applies defaults to user-supplied options. */
export function resolveOptions(options?: FormatOptions): ResolvedOptions {
    if (options === undefined) return {...DEFAULT_OPTIONS}

    return {
        lineBreaks: options.lineBreaks ?? DEFAULT_OPTIONS.lineBreaks,
        style: options.style ?? DEFAULT_OPTIONS.style,
        trim: options.trim ?? DEFAULT_OPTIONS.trim,
    }
}
