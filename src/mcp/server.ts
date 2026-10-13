/*
 * Dario Casertano <dario@casertano.name>
 * Copyright (c) 2026 Casertano Dario – All rights reserved.
 * Licensed under the MIT License.
 */

import { McpServer } from "@modelcontextprotocol/server"
import type { CallToolResult } from "@modelcontextprotocol/server"
import { createRequire } from "node:module"
import { z } from "zod"
import type { ToWAOptions } from "../html/to-wa.js"
import { toHTML } from "../index.js"
import { toWA } from "../index.js"
import type { FormatOptions } from "../options.js"

/** Tool that converts WhatsApp-formatted text into HTML. */
export const WHATSAPP_TO_HTML = "whatsapp_to_html"

/** Tool that converts HTML into WhatsApp-formatted text. */
export const HTML_TO_WHATSAPP = "html_to_whatsapp"

const SERVER_NAME = "wa-format"

/** Used when `package.json` cannot be read, for example from a bundle. */
const FALLBACK_VERSION = "0.5.0"

/** Reads the package version so the advertised server info never drifts. */
function serverVersion(): string {
    try {
        const require = createRequire(import.meta.url)
        const pkg = require("../../../package.json") as { version?: unknown }

        return typeof pkg.version === "string" ? pkg.version : FALLBACK_VERSION
    } catch {
        return FALLBACK_VERSION
    }
}

/** Arguments accepted by the {@link WHATSAPP_TO_HTML} tool. */
export interface WhatsappToHtmlArgs {
    lineBreaks?: boolean
    style?: "legacy" | "semantic"
    text: string
    trim?: boolean
}

/** Arguments accepted by the {@link HTML_TO_WHATSAPP} tool. */
export interface HtmlToWhatsappArgs {
    bullet?: "-" | "*"
    html: string
}

const WHATSAPP_TO_HTML_SCHEMA = z.object({
    lineBreaks: z.boolean().optional().describe("Render line breaks as `<br>`. Default true."),
    style: z.enum(["legacy", "semantic"]).optional().describe(
        "`semantic` emits <b>/<i>/<s>; `legacy` emits <strong>/<em>/<s>. Default `semantic`.",
    ),
    text: z.string().describe("WhatsApp-formatted message to convert."),
    trim: z.boolean().optional().describe("Trim leading and trailing whitespace before parsing. Default true."),
})

const HTML_TO_WHATSAPP_SCHEMA = z.object({
    bullet: z.enum(["-", "*"]).optional().describe("Marker used for bulleted lists. Default `-`."),
    html: z.string().describe("HTML fragment to convert."),
})

function textResult(value: string): CallToolResult {
    return {
        content: [{type: "text", text: value}],
    }
}

function failure(error: unknown): CallToolResult {
    const message = error instanceof Error ? error.message : "wa-format: unexpected error"

    return {
        content: [{type: "text", text: message}],
        isError: true,
    }
}

/** Converts a WhatsApp message to HTML, returning an MCP tool result. */
export function runWhatsappToHtml(args: WhatsappToHtmlArgs): CallToolResult {
    try {
        const options: FormatOptions = {
            lineBreaks: args.lineBreaks,
            style: args.style,
            trim: args.trim,
        }

        return textResult(toHTML(args.text, options))
    } catch (error) {
        return failure(error)
    }
}

/** Converts an HTML fragment to WhatsApp markup, returning an MCP tool result. */
export function runHtmlToWhatsapp(args: HtmlToWhatsappArgs): CallToolResult {
    try {
        const options: ToWAOptions = {
            bullet: args.bullet,
        }

        return textResult(toWA(args.html, options))
    } catch (error) {
        return failure(error)
    }
}

/** Creates the MCP server with the `toHTML` and `toWA` tools registered. */
export function createServer(): McpServer {
    const server = new McpServer({name: SERVER_NAME, version: serverVersion()})

    server.registerTool(
        WHATSAPP_TO_HTML,
        {
            annotations: {
                destructiveHint: false,
                idempotentHint: true,
                openWorldHint: false,
                readOnlyHint: true,
            },
            description: "Convert WhatsApp-formatted text into HTML. Supports bold, italic, "
                + "strikethrough, inline code, code blocks, block quotes and lists.",
            inputSchema: WHATSAPP_TO_HTML_SCHEMA,
            title: "WhatsApp to HTML",
        },
        (args) => runWhatsappToHtml(args),
    )

    server.registerTool(
        HTML_TO_WHATSAPP,
        {
            annotations: {
                destructiveHint: false,
                idempotentHint: true,
                openWorldHint: false,
                readOnlyHint: true,
            },
            description: "Convert an HTML fragment into WhatsApp-formatted text. Best-effort "
                + "inverse of the WhatsApp to HTML tool.",
            inputSchema: HTML_TO_WHATSAPP_SCHEMA,
            title: "HTML to WhatsApp",
        },
        (args) => runHtmlToWhatsapp(args),
    )

    return server
}
