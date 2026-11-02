// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

export function resolvePointer(document: unknown, ref: string): unknown {
  return ref
    .slice(2)
    .split("/")
    .map((segment) => segment.replaceAll("~1", "/").replaceAll("~0", "~"))
    .reduce<unknown>(
      (node, key) =>
        node && typeof node === "object"
          ? (node as Record<string, unknown>)[key]
          : undefined,
      document,
    )
}

const schemaRefPrefix = "#/components/schemas/"

/**
 * Inlines the local `$ref`s of `node`, so the result is plain JSON. A ref back
 * to a schema that is already being inlined is kept as
 * `{$ref, circular: true}` instead of recursing forever. Refs to other files
 * and unknown targets are left untouched. Inlined component schemas without a
 * `title` get their component name as one, so they can still be labelled.
 */
export function dereference<T>(
  node: T,
  document: unknown,
  ancestors: ReadonlySet<string> = new Set(),
): T {
  if (Array.isArray(node)) {
    return node.map((item: unknown) =>
      dereference(item, document, ancestors),
    ) as T
  }
  if (!node || typeof node !== "object") {
    return node
  }

  const {$ref, ...siblings} = node as Record<string, unknown>
  if (typeof $ref === "string" && $ref.startsWith("#/")) {
    if (ancestors.has($ref)) {
      return {$ref, circular: true} as T
    }
    const target = resolvePointer(document, $ref)
    if (target !== undefined) {
      const resolved = dereference(
        target,
        document,
        new Set([...ancestors, $ref]),
      )
      const title = $ref.startsWith(schemaRefPrefix)
        ? {title: $ref.slice(schemaRefPrefix.length)}
        : {}
      // OpenAPI 3.1 lets keys like `description` sit next to `$ref` and override it.
      return {
        ...title,
        ...(resolved as object),
        ...dereference(siblings, document, ancestors),
      } as T
    }
  }

  return Object.fromEntries(
    Object.entries(node).map(([key, value]) => [
      key,
      dereference(value, document, ancestors),
    ]),
  ) as T
}
