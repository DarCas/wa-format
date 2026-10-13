/*
 * Dario Casertano <dario@casertano.name>
 * Copyright (c) 2026 Casertano Dario – All rights reserved.
 * Licensed under the MIT License.
 */

import { FEATURES } from '../data/features'

import { Section } from './ui/Section'

import styles from './Features.module.css'

/**
 * Six borderless cells on the canvas. No card fills — depth comes from type
 * scale and the accent glyph, per the dark-devtools lineage.
 */
export function Features() {
    return (
        <Section eyebrow="Features" id="features" title="Small surface, strict contract.">
            <ul className={styles.grid}>
                {FEATURES.map((feature) => (
                    <li className={styles.cell} key={feature.title}>
                        <span aria-hidden="true" className={styles.glyph}>
                            {feature.glyph}
                        </span>
                        <h3 className={styles.title}>{feature.title}</h3>
                        <p className={styles.copy}>{feature.copy}</p>
                    </li>
                ))}
            </ul>
        </Section>
    )
}
