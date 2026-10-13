/*
 * Dario Casertano <dario@casertano.name>
 * Copyright (c) 2026 Casertano Dario – All rights reserved.
 * Licensed under the MIT License.
 */

import { GOTCHAS } from '../data/gotchas'

import { Section } from './ui/Section'

import styles from './Gotchas.module.css'

/** Boundary rules that surprise people: input → output → why. */
export function Gotchas() {
    return (
        <Section
            eyebrow="Gotchas"
            id="gotchas"
            lead="Markers must touch their content, sit outside words, and leave code alone. Seven rules cover most surprises."
            title="Read this before filing a bug."
        >
            <div aria-label="Gotchas table" className={styles.scroll} role="region" tabIndex={0}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th scope="col">Input</th>
                            <th scope="col">Output</th>
                            <th scope="col">Why</th>
                        </tr>
                    </thead>
                    <tbody>
                        {GOTCHAS.map((row) => (
                            <tr key={row.input}>
                                <td>
                                    <code>{row.input}</code>
                                </td>
                                <td>
                                    <code>{row.output}</code>
                                </td>
                                <td>{row.why}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Section>
    )
}
