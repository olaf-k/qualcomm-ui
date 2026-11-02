// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

/**
 * Source of the `@qualcomm-ui/docs-plugin/openapi` virtual module: a route
 * loader returning the operation for the requested pathname. Client
 * navigations request `<pathname>.data`.
 */
export function getOpenApiModuleCode(
  operations: Record<string, unknown>,
): string {
  return [
    `const operations = ${JSON.stringify(operations)}`,
    "export function loader({request}) {",
    String.raw`  const pathname = new URL(request.url).pathname.replace(/\.data$/, "")`,
    "  return operations[pathname] ?? null",
    "}",
  ].join("\n")
}
