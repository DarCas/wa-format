/*
 * Dario Casertano <dario@casertano.name>
 * Copyright (c) 2026 Casertano Dario – All rights reserved.
 * Licensed under the MIT License.
 */

const ESCAPES: Readonly<Record<string, string>> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
}

/**
 * HTML-escapes text so that it can be embedded in element content without
 * being interpreted as markup. All user input passes through this function;
 * no raw input is ever emitted into the output.
 */
export function escapeHtml(value: string): string {
    return value.replace(/[&<>"']/g, (ch) => ESCAPES[ ch ] as string)
}
