/*
 * Dario Casertano <dario@casertano.name>
 * Copyright (c) 2026 Casertano Dario – All rights reserved.
 * Licensed under the MIT License.
 */

import { toHTML, toWA } from '@darcas/wa-format'
import type { FormatOptions, ToWAOptions } from '@darcas/wa-format'

export type Direction = 'to-html' | 'to-wa'
export type StyleOption = NonNullable<FormatOptions['style']>
export type BulletOption = NonNullable<ToWAOptions['bullet']>

export interface ConverterState {
    bullet: BulletOption
    direction: Direction
    input: string
    lineBreaks: boolean
    style: StyleOption
    trim: boolean
}

/** Shown on first paint. Deterministic, so the prerendered markup matches hydration. */
export const DEFAULT_INPUT = [
    '*Bold* _italic_ ~strike~ and `code`.',
    '',
    '> a quoted line',
    '',
    '- first item',
    '- second item',
    '',
    '1. numbered',
].join('\n')

export const DEFAULT_STATE: ConverterState = {
    bullet: '-',
    direction: 'to-html',
    input: DEFAULT_INPUT,
    lineBreaks: true,
    style: 'semantic',
    trim: true,
}

/** Above this size conversion stops feeling instant, so we ask the user to trim down. */
export const INPUT_LIMIT = 2000

/**
 * Runs the real library. Pure and synchronous: the same input yields the same output on
 * the server and on the client, which is what makes the prerender safe.
 */
export function convert(state: ConverterState): string {
    if (state.direction === 'to-wa') {
        return toWA(state.input, { bullet: state.bullet })
    }

    return toHTML(state.input, {
        lineBreaks: state.lineBreaks,
        style: state.style,
        trim: state.trim,
    })
}