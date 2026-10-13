/*
 * Dario Casertano <dario@casertano.name>
 * Copyright (c) 2026 Casertano Dario – All rights reserved.
 * Licensed under the MIT License.
 */

import snippets from '../../generated/snippets.json'
import { copyText } from '../../lib/copy'

import { useCallback, useEffect, useRef, useState } from 'react'

import styles from './CodeBlock.module.css'

type SnippetKey = keyof typeof snippets

interface CodeBlockProps {
    label: string
    snippet: SnippetKey
}

/**
 * Static pre-highlighted code sample. Highlighting runs at build time (Shiki →
 * `snippets.json`); the page ships no highlighter runtime. Copy is wired in an
 * event handler so the prerender stays SSR-safe.
 */
export function CodeBlock({ label, snippet }: CodeBlockProps) {
    const html = snippets[snippet] as string | undefined
    const [done, setDone] = useState(false)
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

    useEffect(() => () => {
        if (timer.current) {
            clearTimeout(timer.current)
        }
    }, [])

    const handleCopy = useCallback(async () => {
        const el = document.querySelector(`[data-snippet="${snippet}"] code`)

        const ok = await copyText(el?.textContent ?? "")

        setDone(ok)

        if (timer.current) {
            clearTimeout(timer.current)
        }

        timer.current = setTimeout(() => setDone(false), 2000)
    }, [snippet])

    if (!html) {
        return null
    }

    return (
        <figure className={styles.block}>
            <div className={styles.bar}>
                <span className={styles.label}>{label}</span>
                <button className={styles.copy} onClick={handleCopy} type="button">
                    {done ? "Copied" : "Copy"}
                </button>
            </div>
            <div className={styles.code} dangerouslySetInnerHTML={{ __html: html }} data-snippet={snippet} />
            <span aria-live="polite" className="visually-hidden" role="status">
                {done ? `${label} copied to clipboard` : ""}
            </span>
        </figure>
    )
}
