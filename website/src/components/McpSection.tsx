/*
 * Dario Casertano <dario@casertano.name>
 * Copyright (c) 2026 Casertano Dario – All rights reserved.
 * Licensed under the MIT License.
 */

import { CodeBlock } from './ui/CodeBlock'
import { Section } from './ui/Section'

import styles from './McpSection.module.css'

const TOOLS = [
    {
        args: "text (required), style, lineBreaks, trim",
        name: "whatsapp_to_html",
        returns: "HTML",
    },
    {
        args: "html (required), bullet",
        name: "html_to_whatsapp",
        returns: "WhatsApp-formatted text",
    },
]

/** MCP server: registration JSON, tool table, and the auto-approve hints. */
export function McpSection() {
    return (
        <Section
            eyebrow="MCP"
            id="mcp"
            lead="The package ships wa-format-mcp: both converters as tools over the stdio transport."
            title="Agents call the same code."
        >
            <div className={styles.layout}>
                <CodeBlock label="MCP client config" snippet="MCP_CLIENT_CONFIG" />
                <div className={styles.side}>
                    <div className={styles.scroll} role="region" aria-label="MCP tools" tabIndex={0}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th scope="col">Tool</th>
                                    <th scope="col">Arguments</th>
                                    <th scope="col">Returns</th>
                                </tr>
                            </thead>
                            <tbody>
                                {TOOLS.map((tool) => (
                                    <tr key={tool.name}>
                                        <td>
                                            <code>{tool.name}</code>
                                        </td>
                                        <td>
                                            <code>{tool.args}</code>
                                        </td>
                                        <td>{tool.returns}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <p className={styles.note}>
                        The arguments mirror the options of <code>toHTML</code> and <code>toWA</code>.
                        Invalid arguments are rejected by the tool schema.
                    </p>
                    <p className={styles.note}>
                        Both tools are advertised as read-only and side-effect free
                        (<code>readOnlyHint: true</code>, <code>destructiveHint: false</code>,{" "}
                        <code>idempotentHint: true</code>, <code>openWorldHint: false</code>), so clients
                        can auto-approve them.
                    </p>
                </div>
            </div>
        </Section>
    )
}
