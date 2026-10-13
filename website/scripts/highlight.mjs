/*
 * Dario Casertano <dario@casertano.name>
 * Copyright (c) 2026 Casertano Dario – All rights reserved.
 * Licensed under the MIT License.
 */

/**
 * Pre-highlights the static code samples with Shiki at build time, so the page ships no
 * highlighter runtime. The snippets themselves live in `src/data/snippets.mjs` as plain
 * data so this script and the components read from the same source.
 *
 * Fail-soft: if Shiki cannot load, an empty map is written and the page falls back to
 * unhighlighted `<pre>` blocks.
 */

import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { createHighlighter } from 'shiki'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

import { SNIPPETS } from '../src/data/snippets.mjs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const target = resolve(root, 'src/generated/snippets.json')

const LANGUAGES = {
    bash: 'bash',
    html: 'html',
    json: 'json',
    ts: 'typescript',
}

async function main() {
    const keys = Object.keys(SNIPPETS)
    const snippets = {}

    if (keys.length > 0) {
        try {
            const languages = [...new Set(Object.values(SNIPPETS).map((s) => s.lang))]
            const highlighter = await createHighlighter({
                langs: languages.map((lang) => LANGUAGES[lang] ?? lang),
                themes: ['vitesse-dark'],
            })

            for (const [key, snippet] of Object.entries(SNIPPETS)) {
                snippets[key] = highlighter.codeToHtml(snippet.code, {
                    lang: LANGUAGES[snippet.lang] ?? snippet.lang,
                    theme: 'vitesse-dark',
                })
            }

            highlighter.dispose()
        } catch (error) {
            console.warn(`highlight: falling back to plain text (${error.message})`)
        }
    }

    await mkdir(dirname(target), { recursive: true })
    await writeFile(target, `${JSON.stringify(snippets, null, 2)}\n`)

    console.log(`highlight: ${Object.keys(snippets).length}/${keys.length} snippets`)
}

await main()