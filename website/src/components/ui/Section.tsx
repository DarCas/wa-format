/*
 * Dario Casertano <dario@casertano.name>
 * Copyright (c) 2026 Casertano Dario – All rights reserved.
 * Licensed under the MIT License.
 */

import type { ReactNode } from 'react'

import styles from './Section.module.css'

interface SectionProps {
    children: ReactNode
    eyebrow?: string
    id: string
    lead?: string
    title: string
    wide?: boolean
}

/**
 * Shared section shell: hairline-separated band, mono eyebrow, display heading.
 * Keeps every section at the same rhythm without a component library.
 */
export function Section({ children, eyebrow, id, lead, title, wide = false }: SectionProps) {
    return (
        <section aria-labelledby={`${id}-title`} className={styles.section} id={id}>
            <div className={wide ? 'container container--wide' : 'container'}>
                {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
                <h2 className={styles.title} id={`${id}-title`}>
                    {title}
                </h2>
                {lead ? <p className={styles.lead}>{lead}</p> : null}
                {children}
            </div>
        </section>
    )
}
