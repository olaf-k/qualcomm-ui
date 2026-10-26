// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {antdThemes} from "./antd-themes.js"
import type {QdsTheme} from "./theme.types.js"

export {antdThemes}

const seedColorKeys = [
  "colorPrimary",
  "colorSuccess",
  "colorWarning",
  "colorError",
  "colorInfo",
  "colorLink",
  "colorTextBase",
  "colorBgBase",
] as const

type SeedColorKey = (typeof seedColorKeys)[number]

/**
 * The parts of an antd `ThemeConfig` produced from QDS tokens. Spread it into the
 * `theme` prop of antd's `ConfigProvider`.
 *
 * @since 1.40.0
 */
export interface QdsAntdThemeConfig {
  components: Record<string, Record<string, string | number | boolean>>
  token: Record<string, string | number | boolean>
}

/**
 * Returns the antd theme tokens for the Qualcomm brand.
 *
 * For dark themes, combine with antd's dark algorithm and
 * {@link restoreQdsSeedColors}:
 *
 * ```tsx
 * <ConfigProvider
 *   theme={{
 *     ...getQdsAntdTheme({theme: "dark"}),
 *     algorithm: [theme.darkAlgorithm, restoreQdsSeedColors],
 *   }}
 * />
 * ```
 *
 * @since 1.40.0
 */
export function getQdsAntdTheme({
  theme = "light",
}: {theme?: QdsTheme} = {}): QdsAntdThemeConfig {
  return antdThemes[`qualcomm-${theme}`]
}

/**
 * An antd theme algorithm that puts the QDS seed colors back after antd's dark
 * algorithm has dimmed them. QDS dark colors are already tuned for dark surfaces,
 * and `ConfigProvider` token overrides cannot win over an algorithm for seed keys.
 *
 * @since 1.40.0
 */
export function restoreQdsSeedColors<
  Seed extends Record<SeedColorKey, string>,
  Map extends Record<string, unknown>,
>(seed: Seed, mapToken?: Map): Map {
  const restored = {...mapToken} as Record<string, unknown>
  for (const key of seedColorKeys) {
    restored[key] = seed[key]
  }
  return restored as Map
}
