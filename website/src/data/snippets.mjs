/*
 * Dario Casertano <dario@casertano.name>
 * Copyright (c) 2026 Casertano Dario – All rights reserved.
 * Licensed under the MIT License.
 */

/**
 * Static code samples shared by the build-time highlighter and the page components.
 *
 * Plain `.mjs` on purpose: `scripts/highlight.mjs` imports this file directly under Node,
 * with no loader or transpile step in between, so the highlighted output can never drift
 * from the code the page shows.
 *
 * `key` maps to the entry in `src/generated/snippets.json`; `lang` selects the Shiki
 * grammar and must be one of the keys in `LANGUAGES` there.
 */

export const SNIPPETS = {
    BROWSER: {
        code: `<script type="module">
    import {toHTML} from "https://esm.sh/@darcas/wa-format"

    document.querySelector("#message").innerHTML = toHTML("*Hello* _world_")
</script>`,
        lang: 'html',
    },
    INSTALL_BUN: {
        code: 'bun add @darcas/wa-format',
        lang: 'bash',
    },
    INSTALL_NPM: {
        code: 'npm i @darcas/wa-format',
        lang: 'bash',
    },
    INSTALL_PNPM: {
        code: 'pnpm add @darcas/wa-format',
        lang: 'bash',
    },
    INSTALL_YARN: {
        code: 'yarn add @darcas/wa-format',
        lang: 'bash',
    },
    MCP_CLIENT_CONFIG: {
        code: JSON.stringify(
            {
                mcpServers: {
                    'wa-format': {
                        args: ['-y', '-p', '@darcas/wa-format', 'wa-format-mcp'],
                        command: 'npx',
                    },
                },
            },
            null,
            4,
        ),
        lang: 'json',
    },
    ROUND_TRIP: {
        code: `import {toHTML, toWA} from "@darcas/wa-format"

toHTML("*Hello* _world_")         // "<b>Hello</b> <i>world</i>"
toWA("<b>Hello</b> <i>world</i>") // "*Hello* _world_"

toWA("<blockquote>a<br>b</blockquote>")  // "> a\\n> b"
toWA("<ul><li>one</li><li>two</li></ul>") // "- one\\n- two"`,
        lang: 'ts',
    },
    USAGE: {
        code: `import {toHTML, toWA} from "@darcas/wa-format"

toHTML("*Bold*, _italic_, ~strike~ and \\\`code\\\`.")`,
        lang: 'ts',
    },
}