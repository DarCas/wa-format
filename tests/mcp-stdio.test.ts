/*
 * Dario Casertano <dario@casertano.name>
 * Copyright (c) 2026 Casertano Dario – All rights reserved.
 * Licensed under the MIT License.
 */

import { test } from "node:test"
import assert from "node:assert/strict"
import { spawn } from "node:child_process"
import { fileURLToPath } from "node:url"

const BIN = fileURLToPath(new URL("../dist/esm/mcp/bin.js", import.meta.url))

interface JsonRpcMessage {
    error?: { message: string }
    id?: number
    result?: unknown
}

interface StdioClient {
    child: ReturnType<typeof spawn>
    notify: (method: string) => void
    request: (id: number, method: string, params: unknown) => Promise<JsonRpcMessage>
}

function startClient(): StdioClient {
    const child = spawn(process.execPath, [BIN], {stdio: ["pipe", "pipe", "ignore"]})
    const pending = new Map<number, (message: JsonRpcMessage) => void>()
    let buffer = ""

    child.stdout?.on("data", (chunk: Buffer) => {
        buffer += chunk.toString()
        let index = buffer.indexOf("\n")
        while (index !== -1) {
            const line = buffer.slice(0, index).trim()
            buffer = buffer.slice(index + 1)
            index = buffer.indexOf("\n")

            if (line === "") continue

            const message = JSON.parse(line) as JsonRpcMessage
            const resolve = message.id === undefined ? undefined : pending.get(message.id)
            if (resolve !== undefined && message.id !== undefined) {
                pending.delete(message.id)
                resolve(message)
            }
        }
    })

    const write = (message: unknown): void => {
        child.stdin?.write(JSON.stringify(message) + "\n")
    }

    return {
        child,
        notify: (method) => write({jsonrpc: "2.0", method}),
        request: (id, method, params) => new Promise((resolve) => {
            pending.set(id, resolve)
            write({jsonrpc: "2.0", id, method, params})
        }),
    }
}

test("stdio server exposes and runs the tools", {timeout: 10000}, async () => {
    const client = startClient()

    try {
        const init = await client.request(1, "initialize", {
            capabilities: {},
            clientInfo: {name: "wa-format-test", version: "1.0.0"},
            protocolVersion: "2025-06-18",
        })
        assert.equal(( init.result as {
            serverInfo: { name: string }
        } ).serverInfo.name, "wa-format")

        client.notify("notifications/initialized")

        const list = await client.request(2, "tools/list", {})
        const tools = ( list.result as {
            tools: {
                annotations?: {
                    destructiveHint?: boolean
                    idempotentHint?: boolean
                    openWorldHint?: boolean
                    readOnlyHint?: boolean
                }
                name: string
            }[]
        } ).tools

        assert.deepEqual(tools.map((tool) => tool.name), ["whatsapp_to_html", "html_to_whatsapp"])

        for (const tool of tools) {
            assert.equal(tool.annotations?.readOnlyHint, true)
            assert.equal(tool.annotations?.destructiveHint, false)
            assert.equal(tool.annotations?.idempotentHint, true)
            assert.equal(tool.annotations?.openWorldHint, false)
        }

        const toHtml = await client.request(3, "tools/call", {
            arguments: {text: "*Hello* _world_"},
            name: "whatsapp_to_html",
        })
        assert.equal(
            ( toHtml.result as { content: { text: string }[] } ).content[ 0 ].text,
            "<b>Hello</b> <i>world</i>",
        )

        const toWa = await client.request(4, "tools/call", {
            arguments: {html: "<ul><li>one</li><li>two</li></ul>"},
            name: "html_to_whatsapp",
        })
        assert.equal(
            ( toWa.result as { content: { text: string }[] } ).content[ 0 ].text,
            "- one\n- two",
        )

        const invalid = await client.request(5, "tools/call", {
            arguments: {text: 42},
            name: "whatsapp_to_html",
        })
        if (invalid.error === undefined) {
            assert.equal(( invalid.result as { isError?: boolean } ).isError, true)
        } else {
            assert.notEqual(invalid.error, undefined)
        }
    } finally {
        client.child.kill()
    }
})
