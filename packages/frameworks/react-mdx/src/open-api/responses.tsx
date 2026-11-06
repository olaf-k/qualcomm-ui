// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactNode} from "react"

import {ChevronRight} from "lucide-react"

import {Collapsible} from "@qualcomm-ui/react/collapsible"
import {Icon} from "@qualcomm-ui/react/icon"

import {MediaContent, type OpenApiContent} from "./media-content.js"

export interface OpenApiResponse {
  content?: OpenApiContent
  description?: string
}

/**
 * Every response as a row, collapsed to its status code and description. Rows
 * with a body expand into its schema.
 */
export function Responses({
  responses,
}: {
  responses?: Record<string, OpenApiResponse>
}): ReactNode {
  const entries = Object.entries(responses ?? {})
  if (!entries.length) {
    return null
  }

  return (
    <section>
      <h2 className="mdx">Responses</h2>
      <div className="qui-docs-openapi__fields">
        {entries.map(([code, {content, description}]) => {
          const header = (
            <>
              <code className="qui-docs-openapi__field-name">{code}</code>
              {description ? (
                <span className="qui-docs-openapi__response-description">
                  {description}
                </span>
              ) : null}
            </>
          )
          if (!Object.keys(content ?? {}).length) {
            return (
              <div key={code} className="qui-docs-openapi__field">
                <div className="qui-docs-openapi__field-header">{header}</div>
              </div>
            )
          }
          return (
            <Collapsible.Root key={code} className="qui-docs-openapi__field">
              <Collapsible.Trigger className="qui-docs-openapi__field-header">
                <Icon
                  className="qui-docs-openapi__field-indicator"
                  icon={ChevronRight}
                />
                {header}
              </Collapsible.Trigger>
              <Collapsible.Content className="qui-docs-openapi__field-children">
                <MediaContent content={content} />
              </Collapsible.Content>
            </Collapsible.Root>
          )
        })}
      </div>
    </section>
  )
}
