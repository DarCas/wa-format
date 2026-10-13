/*
 * Dario Casertano <dario@casertano.name>
 * Copyright (c) 2026 Casertano Dario – All rights reserved.
 * Licensed under the MIT License.
 */

import facts from '../generated/facts.json'

export interface Stat {
    label: string
    value: string
}

/**
 * Hard numbers for the hero spec strip. These stand in for a logo wall: the library has
 * no customers to name, and inventing them would be the fastest way to lose a technical
 * reader. Every figure here is verifiable from the repository or the registry.
 */
export const STATS: readonly Stat[] = [
    { label: 'core dependencies', value: '0' },
    { label: 'modules', value: 'ESM + CJS' },
    { label: 'tests', value: '80' },
    { label: 'node', value: facts.nodeEngine.replace('>=', '≥ ') },
]

export const INSTALL_COMMAND = 'npm i @darcas/wa-format'