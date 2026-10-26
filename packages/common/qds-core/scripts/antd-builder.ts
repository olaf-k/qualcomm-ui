import {mkdir, readFile, writeFile} from "node:fs/promises"
import {dirname, resolve} from "node:path"
import {fileURLToPath} from "node:url"
import type {TransformedToken} from "style-dictionary"

import {
  type AntdCssOverride,
  antdComponentTokens,
  antdCssOverrides,
  antdGlobalTokens,
  type AntdTokenMapping,
  type AntdValueSpec,
} from "./antd-mapping"
import {type Brand, type Theme, themes} from "./utils"

const antdBrands: Brand[] = ["qualcomm"]

const __dirname = dirname(fileURLToPath(import.meta.url))

const tempDir = resolve(__dirname, "./temp")
const themesOutputFile = resolve(__dirname, "../src/theme/antd-themes.ts")
const cssOutputDir = resolve(__dirname, "../src/styles/antd")

type TokenValues = Map<string, string>

type AntdValue = string | number | boolean

async function readTokenValues(
  brand: Brand,
  theme: Theme,
): Promise<TokenValues> {
  const tokenMap = JSON.parse(
    await readFile(
      resolve(tempDir, `${brand}-${theme}-token-map.json`),
      "utf-8",
    ),
  ) as Record<string, TransformedToken>
  return new Map(
    Object.values(tokenMap).map((token) => [token.name, String(token.$value)]),
  )
}

function lookup(values: TokenValues, name: string): string {
  const value = values.get(name)
  if (value === undefined) {
    throw new Error(`Unknown QDS token in antd mapping: ${name}`)
  }
  return value
}

function toPixels(value: string, name: string): number {
  const match = /^(-?[\d.]+)px$/.exec(value)
  if (!match) {
    throw new Error(`${name} is not a px value: ${value}`)
  }
  return Number(match[1])
}

function fontSizeOfShorthand(value: string, name: string): number {
  const match = /(\d+(?:\.\d+)?)px\s*\//.exec(value)
  if (!match) {
    throw new Error(`${name} has no font size: ${value}`)
  }
  return Number(match[1])
}

function toNumberIfNumeric(value: string): AntdValue {
  return /^-?\d+(\.\d+)?$/.test(value) ? Number(value) : value
}

function evaluate(values: TokenValues, spec: AntdValueSpec): AntdValue {
  switch (spec.kind) {
    case "color":
    case "raw":
      return toNumberIfNumeric(lookup(values, spec.name))
    case "px":
      return toPixels(lookup(values, spec.name), spec.name)
    case "fontSize":
      return fontSizeOfShorthand(lookup(values, spec.name), spec.name)
    case "ratio":
      return (
        toPixels(lookup(values, spec.lineHeight), spec.lineHeight) /
        toPixels(lookup(values, spec.fontSize), spec.fontSize)
      )
    case "cellPadding": {
      // antd sizes a cell as text line + 2 × padding + 1px bottom border. The line
      // height is the global ratio (fontSize + 8) / fontSize applied to the cell's
      // own font size, so a 12px cell gets 18.86px, not 22px.
      const fontSize = evaluate(values, antdGlobalTokens.fontSize) as number
      const cellFontSize = fontSizeOfShorthand(
        lookup(values, spec.cellFont),
        spec.cellFont,
      )
      const height = toPixels(lookup(values, spec.height), spec.height)
      const lineHeight = (cellFontSize * (fontSize + 8)) / fontSize
      return (height - lineHeight - 1) / 2
    }
    case "focusRing":
      return `0 0 0 1px ${lookup(values, spec.name)}`
    case "inset":
      return `inset 0 0 0 1px ${lookup(values, spec.name)}`
    case "optionPadding":
      return `0 ${lookup(values, spec.name)}`
    case "literal":
      return spec.value
  }
}

function evaluateAll(
  values: TokenValues,
  mapping: AntdTokenMapping,
): Record<string, AntdValue> {
  return Object.fromEntries(
    Object.entries(mapping).map(([key, spec]) => [key, evaluate(values, spec)]),
  )
}

function toCss(values: TokenValues, overrides: AntdCssOverride[]): string {
  return overrides
    .map(({declarations, selector}) => {
      const body = Object.entries(declarations)
        .map(([property, spec]) => `  ${property}: ${evaluate(values, spec)};`)
        .join("\n")
      return `${selector} {\n${body}\n}`
    })
    .join("\n\n")
}

/**
 * Builds antd theme objects and override stylesheets for every brand/theme from
 * the token maps written by the Figma token builder.
 */
export async function buildAntdThemes(): Promise<void> {
  await mkdir(cssOutputDir, {recursive: true})

  const generated: Record<string, unknown> = {}

  for (const brand of antdBrands) {
    for (const theme of themes) {
      const values = await readTokenValues(brand, theme)

      generated[`${brand}-${theme}`] = {
        components: Object.fromEntries(
          Object.entries(antdComponentTokens).map(([component, mapping]) => [
            component,
            evaluateAll(values, mapping),
          ]),
        ),
        token: evaluateAll(values, antdGlobalTokens),
      }

      await writeFile(
        resolve(cssOutputDir, `${brand}-${theme}-antd.css`),
        `/**\n * This file was generated automatically. Do not edit it directly.\n */\n/* stylelint-disable */\n\n${toCss(values, antdCssOverrides)}\n`,
        "utf-8",
      )
    }
  }

  await writeFile(
    themesOutputFile,
    [
      "/* eslint-disable */",
      "// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.",
      "// SPDX-License-Identifier: BSD-3-Clause-Clear",
      "",
      "/** This file was generated automatically. Do not edit it directly. */",
      "",
      `export const antdThemes = ${JSON.stringify(generated, null, 2)} as const`,
      "",
    ].join("\n"),
    "utf-8",
  )
}
