/*
 * Dario Casertano <dario@casertano.name>
 * Copyright (c) 2026 Casertano Dario – All rights reserved.
 * Licensed under the MIT License.
 */

/**
 * Injects `<link rel="preload">` for the hashed font files into `dist/index.html`.
 *
 * The woff2 names contain a content hash, so `index.html` cannot reference them
 * statically. Fonts are otherwise discovered only after the CSS downloads and
 * parses; preloading them in `<head>` removes that round trip from LCP.
 *
 * Runs after `vite build` (assets exist) and before `prerender.mjs` (which only
 * touches the `#root` mount point). Idempotent: skips files already preloaded.
 */

import { readdir, readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const indexFile = resolve(root, 'dist/index.html')
const assetsDir = resolve(root, 'dist/assets')

const files = (await readdir(assetsDir)).filter((file) => file.endsWith('.woff2')).sort()

let html = await readFile(indexFile, 'utf8')
let injected = 0

for (const file of files) {
    const href = `/assets/${file}`

    if (html.includes(href) && html.includes('rel="preload"')) {
        continue
    }

    const tag = `<link rel="preload" href="${href}" as="font" type="font/woff2" crossorigin>`
    const anchor = '<script type="module"'

    if (!html.includes(anchor)) {
        throw new Error(`preload: module script tag not found in ${indexFile}`)
    }

    html = html.replace(anchor, `${tag}\n        ${anchor}`)
    injected++
}

await writeFile(indexFile, html)

console.log(`preload: ${injected} font(s) preloaded in dist/index.html`)
