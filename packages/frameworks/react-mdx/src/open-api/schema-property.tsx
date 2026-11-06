// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type ReactNode, useMemo, useState} from "react"

import {ChevronRight} from "lucide-react"

import {selectCollection} from "@qualcomm-ui/core/select"
import {Collapsible} from "@qualcomm-ui/react/collapsible"
import {Icon} from "@qualcomm-ui/react/icon"
import {Select} from "@qualcomm-ui/react/select"

import {getExpandable} from "./get-expandable.js"
import {mergeAllOf} from "./merge-all-of.js"
import {getSchemaTypeLabel, type JsonSchema} from "./schema-type.js"

export interface SchemaPropertyProps {
  deprecated?: boolean
  description?: string
  name: string
  required?: boolean
  schema?: JsonSchema
}

/**
 * One property: its name and type on one line, then its description.
 * Rows with nested properties expand when their header is clicked.
 */
export function SchemaProperty({
  deprecated,
  description,
  name,
  required,
  schema: rawSchema,
}: SchemaPropertyProps): ReactNode {
  const schema = rawSchema && mergeAllOf(rawSchema)
  const defaultValue = schema?.default
  const text = description ?? schema?.description
  const expandable = getExpandable(schema)

  const header = (
    <>
      {expandable ? (
        <Icon
          className="qui-docs-openapi__field-indicator"
          icon={ChevronRight}
        />
      ) : null}
      <span>
        <code className="qui-docs-openapi__field-name">{name}</code>
        {required ? (
          <span className="doc-props-item__required-indicator">*</span>
        ) : null}
        {deprecated || schema?.deprecated ? (
          <span className="doc-props-item__deprecated-indicator">*</span>
        ) : null}
      </span>
      <code className="qui-docs-code qui-docs-openapi__field-type">
        {getSchemaTypeLabel(schema)}
      </code>
      {expandable?.kind === "object" ? (
        <code className="qui-docs-openapi__field-preview">
          {getKeysPreview(expandable.schema)}
        </code>
      ) : null}
    </>
  )
  const details = (
    <>
      {text ? (
        <div className="qui-docs-openapi__description">{text}</div>
      ) : null}
      {defaultValue !== undefined ? (
        <div className="qui-docs-openapi__field-default">
          Default <code>{JSON.stringify(defaultValue)}</code>
        </div>
      ) : null}
    </>
  )

  if (!expandable) {
    return (
      <div className="qui-docs-openapi__field">
        <div className="qui-docs-openapi__field-header">{header}</div>
        {details}
      </div>
    )
  }

  return (
    <Collapsible.Root className="qui-docs-openapi__field">
      <Collapsible.Trigger className="qui-docs-openapi__field-header">
        {header}
      </Collapsible.Trigger>
      {details}
      <Collapsible.Content className="qui-docs-openapi__field-children">
        {expandable.kind === "variants" ? (
          <SchemaVariants
            schema={expandable.schema}
            variants={expandable.variants}
          />
        ) : (
          <SchemaProperties schema={expandable.schema} />
        )}
      </Collapsible.Content>
    </Collapsible.Root>
  )
}

function getSortedEntries(schema: JsonSchema): [string, JsonSchema][] {
  const required = schema.required ?? []
  return Object.entries(schema.properties ?? {}).sort(
    ([a], [b]) => Number(required.includes(b)) - Number(required.includes(a)),
  )
}

function getKeysPreview(schema: JsonSchema): string {
  const keys = getSortedEntries(schema).map(([name]) => name)
  const shown = keys.slice(0, 3)
  if (keys.length > shown.length) {
    shown.push(`+${keys.length - shown.length}`)
  }
  return `{ ${shown.join(", ")} }`
}

/**
 * The properties of an object schema, required ones first.
 */
export function SchemaProperties({schema}: {schema: JsonSchema}): ReactNode {
  const required = schema.required ?? []
  const entries = getSortedEntries(schema)

  return (
    <div className="qui-docs-openapi__fields">
      {entries.map(([name, property]) => (
        <SchemaProperty
          key={name}
          name={name}
          required={required.includes(name)}
          schema={property}
        />
      ))}
    </div>
  )
}

/**
 * One table at a time for the alternatives of a `oneOf`/`anyOf`, picked with a
 * Select.
 */
export function SchemaVariants({
  schema,
  variants,
}: {
  schema: JsonSchema
  variants: JsonSchema[]
}): ReactNode {
  const collection = useMemo(
    () =>
      selectCollection({
        items: variants.map((variant, index) => ({
          label: variant.title ?? `Option ${index + 1}`,
          value: String(index),
        })),
      }),
    [variants],
  )
  const [value, setValue] = useState(["0"])
  // The same instance can be handed fewer alternatives, e.g. another response.
  const index = Number(value[0]) < variants.length ? Number(value[0]) : 0
  const variant = variants[index]
  const propertyName = schema.discriminator?.propertyName

  return (
    <div className="qui-docs-openapi__variants">
      <div className="qui-docs-openapi__variants-header">
        <Select
          clearable={false}
          collection={collection}
          controlProps={{"aria-label": schema.oneOf ? "One of" : "Any of"}}
          onValueChange={(next) => next.length && setValue(next)}
          size="sm"
          value={[String(index)]}
        />
        {propertyName ? (
          <span>
            Picked by <code className="qui-docs-code">{propertyName}</code>
          </span>
        ) : null}
      </div>
      {variant?.properties ? <SchemaProperties schema={variant} /> : null}
    </div>
  )
}
