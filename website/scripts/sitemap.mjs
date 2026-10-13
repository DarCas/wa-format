/*
 * Dario Casertano <dario@casertano.name>
 * Copyright (c) 2026 Casertano Dario – All rights reserved.
 * Licensed under the MIT License.
 */

/**
 * Stamps today's date as `<lastmod>` into the built `dist/sitemap.xml`.
 * Runs after `vite build` (which copies `public/` to `dist/`), so the source
 * file stays free of a hardcoded date.
 */

import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const target = resolve(root, 'dist/sitemap.xml')

async function main() {
    const today = new Date().toISOString().slice(0, 10)

    const xml = await readFile(target, 'utf8')

    const stamped = xml.includes('<lastmod>')
        ? xml.replace(/<lastmod>[^<]*<\/lastmod>/, `<lastmod>${today}</lastmod>`)
        : xml.replace(/<loc>([^<]*)<\/loc>/, `<loc>$1</loc>\n        <lastmod>${today}</lastmod>`)

    await writeFile(target, stamped)

    console.log(`sitemap: lastmod ${today}`)
}

try {
    await main()
} catch (error) {
    console.warn(`sitemap: skipped (${error.message})`)
}
