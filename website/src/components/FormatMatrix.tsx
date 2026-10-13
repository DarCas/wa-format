/*
 * Dario Casertano <dario@casertano.name>
 * Copyright (c) 2026 Casertano Dario – All rights reserved.
 * Licensed under the MIT License.
 */

import { BULLET_NOTE, FORMATS } from '../data/formats'

import { Section } from './ui/Section'

import styles from './FormatMatrix.module.css'

/**
 * The README formatting table, rendered as a terminal table. HTML cells show
 * escaped literal markup plus a rendered sample, so the table teaches the
 * mapping instead of assuming it.
 */
export function FormatMatrix() {
    return (
        <Section
            eyebrow="Formats"
            id="formats"
            lead="Eight constructs. Each row shows the WhatsApp syntax, the exact HTML output, and a rendered sample."
            title="What it parses."
        >
            <div aria-label="Supported formatting table" className={styles.scroll} role="region" tabIndex={0}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th scope="col">Format</th>
                            <th scope="col">WhatsApp syntax</th>
                            <th scope="col">HTML output</th>
                            <th scope="col">Renders as</th>
                        </tr>
                    </thead>
                    <tbody>
                        {FORMATS.map((row) => (
                            <tr key={row.format}>
                                <th scope="row">{row.format}</th>
                                <td>
                                    <code>{row.whatsapp}</code>
                                </td>
                                <td>
                                    <code>{row.html}</code>
                                </td>
                                <td>
                                    <span dangerouslySetInnerHTML={{ __html: row.html.replace("text", row.format) }} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <p className={styles.note}>
                <code>{BULLET_NOTE}</code>
            </p>
        </Section>
    )
}
