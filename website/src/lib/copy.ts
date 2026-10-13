/*
 * Dario Casertano <dario@casertano.name>
 * Copyright (c) 2026 Casertano Dario – All rights reserved.
 * Licensed under the MIT License.
 */

/**
 * Clipboard helper. Only ever called from an event handler, so it is safe to touch
 * `navigator` here — nothing runs during server rendering.
 */

export async function copyText(value: string): Promise<boolean> {
    if (typeof navigator === 'undefined' || !navigator.clipboard) {
        return false
    }

    try {
        await navigator.clipboard.writeText(value)
        return true
    } catch {
        return false
    }
}