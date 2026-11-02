// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {describe, expect, test} from "vitest"

import {getOpenApiModuleCode} from "../open-api/get-module-code.js"

async function getLoader(operations: Record<string, unknown>) {
  const code = getOpenApiModuleCode(operations)
  const module = (await import(
    /* @vite-ignore */ `data:text/javascript,${encodeURIComponent(code)}`
  )) as {loader: (args: {request: Request}) => unknown}
  return (url: string) =>
    module.loader({request: new Request(`http://localhost${url}`)})
}

describe("getOpenApiModuleCode", () => {
  test("returns the operation for page and data requests", async () => {
    const loader = await getLoader({"/api/getMetadata": {slug: "getMetadata"}})
    expect(loader("/api/getMetadata")).toEqual({slug: "getMetadata"})
    expect(loader("/api/getMetadata.data")).toEqual({slug: "getMetadata"})
  })

  test("returns null for unknown operations", async () => {
    const loader = await getLoader({})
    expect(loader("/api/nope")).toBeNull()
  })
})
