/*
 * Dario Casertano <dario@casertano.name>
 * Copyright (c) 2026 Casertano Dario – All rights reserved.
 * Licensed under the MIT License.
 */

import { ROUND_TRIP_LIMITS, TAG_MAPPINGS } from '../data/tags'

import { CodeBlock } from './ui/CodeBlock'
import { Section } from './ui/Section'

import styles from './RoundTrip.module.css'

/**
 * The `toWA` direction: tag mapping, stated lossiness, and the one highlighted
 * sample the plan requires. Honesty about lossiness is the point.
 */
export function RoundTrip() {
    return (
        <Section
            eyebrow="Round trip"
            id="roundtrip"
            lead="toWA maps supported tags back to WhatsApp markers. It is best-effort and lossy — the guaranteed property is HTML idempotence, not byte equality."
            title="…and back."
        >
            <div className={styles.layout}>
                <div aria-label="HTML to WhatsApp tag mapping" className={styles.scroll} role="region" tabIndex={0}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th scope="col">HTML</th>
                                <th scope="col">WhatsApp</th>
                            </tr>
                        </thead>
                        <tbody>
                            {TAG_MAPPINGS.map((row) => (
                                <tr key={row.html}>
                                    <td>
                                        <code>{row.html}</code>
                                    </td>
                                    <td>
                                        <code>{row.whatsapp}</code>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className={styles.side}>
                    <p className={styles.note}>
                        Unknown tags are unwrapped and entities are decoded. What cannot round-trip:
                    </p>
                    <ul className={styles.limits}>
                        {ROUND_TRIP_LIMITS.map((limit) => (
                            <li key={limit}>{limit}</li>
                        ))}
                    </ul>
                    <CodeBlock label="Round trip" snippet="ROUND_TRIP" />
                </div>
            </div>
        </Section>
    )
}
