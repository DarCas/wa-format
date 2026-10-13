/*
 * Dario Casertano <dario@casertano.name>
 * Copyright (c) 2026 Casertano Dario – All rights reserved.
 * Licensed under the MIT License.
 */

import { useCallback, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'

import { API_ENTRIES, API_FOOTNOTE } from '../data/api'

import { Section } from './ui/Section'

import styles from './ApiReference.module.css'

/**
 * Tabbed reference, one panel per export. Prerendered with `toHTML` active and
 * every panel present in the DOM (`hidden` when inactive) so the content stays
 * indexable and there is no layout shift on first switch.
 */
export function ApiReference() {
    const [active, setActive] = useState(API_ENTRIES[0].id)
    const tabRefs = useRef<Array<HTMLButtonElement | null>>([])

    const onKeyDown = useCallback((event: KeyboardEvent) => {
        if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") {
            return
        }

        event.preventDefault()

        const index = API_ENTRIES.findIndex((entry) => entry.id === active)
        const delta = event.key === "ArrowRight" ? 1 : -1
        const next = API_ENTRIES[(index + delta + API_ENTRIES.length) % API_ENTRIES.length]

        setActive(next.id)
        tabRefs.current[API_ENTRIES.findIndex((entry) => entry.id === next.id)]?.focus()
    }, [active])

    return (
        <Section
            eyebrow="API"
            id="api"
            lead="Five exports. Two converters, two parsers, one renderer."
            title="Reference."
        >
            <div className={styles.tabs} onKeyDown={onKeyDown} role="tablist" aria-label="API exports">
                {API_ENTRIES.map((entry, index) => (
                    <button
                        aria-controls={`panel-${entry.id}`}
                        aria-selected={active === entry.id}
                        className={styles.tab}
                        data-active={active === entry.id}
                        id={`tab-${entry.id}`}
                        key={entry.id}
                        onClick={() => setActive(entry.id)}
                        ref={(el) => {
                            tabRefs.current[index] = el
                        }}
                        role="tab"
                        tabIndex={active === entry.id ? 0 : -1}
                        type="button"
                    >
                        {entry.label}
                    </button>
                ))}
            </div>
            {API_ENTRIES.map((entry) => (
                <div
                    aria-labelledby={`tab-${entry.id}`}
                    className={styles.panel}
                    hidden={active !== entry.id}
                    id={`panel-${entry.id}`}
                    key={entry.id}
                    role="tabpanel"
                >
                    <p className={styles.signature}>
                        <code>{entry.signature}</code>
                    </p>
                    <p className={styles.example}>
                        <code>{entry.example}</code>
                    </p>
                    {entry.options.length > 0 ? (
                        <div className={styles.scroll} role="region" aria-label={`${entry.label} options`} tabIndex={0}>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th scope="col">Option</th>
                                        <th scope="col">Type</th>
                                        <th scope="col">Default</th>
                                        <th scope="col">Description</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {entry.options.map((option) => (
                                        <tr key={option.name}>
                                            <td>
                                                <code>{option.name}</code>
                                            </td>
                                            <td>
                                                <code>{option.type}</code>
                                            </td>
                                            <td>
                                                <code>{option.def}</code>
                                            </td>
                                            <td>{option.desc}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : null}
                    <p className={styles.note}>{entry.optionsNote}</p>
                </div>
            ))}
            <p className={styles.footnote}>{API_FOOTNOTE}</p>
        </Section>
    )
}
