// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactNode} from "react"

import type {NavBadge} from "@qualcomm-ui/mdx-common"
import {useMdxDocsContext} from "@qualcomm-ui/react-mdx/context"
import {Badge, type BadgeProps} from "@qualcomm-ui/react/badge"
import {defined} from "@qualcomm-ui/utils/guard"

/**
 * Badge colors of HTTP methods, shared by the side nav and OpenAPI pages.
 */
export const httpMethodBadges: Record<string, BadgeProps> = {
  delete: {emphasis: "red"},
  get: {emphasis: "green"},
  patch: {emphasis: "orange"},
  post: {emphasis: "blue"},
  put: {emphasis: "yellow"},
}

const navBadges: Record<string, BadgeProps | null> = {
  ...httpMethodBadges,
  alpha: {emphasis: "orange"},
  beta: {emphasis: "purple"},
  since: null,
}

const headerBadges: Record<string, BadgeProps> = {
  alpha: {emphasis: "orange"},
  beta: {emphasis: "purple"},
  since: {emphasis: "brand"},
}

/**
 * Default side nav badge renderer. Unknown ids render as neutral badges; `since`
 * is hidden.
 */
export function SideNavBadges({badges}: {badges: NavBadge[]}): ReactNode {
  return badges
    .filter(
      (badge) =>
        navBadges[badge.id] !== null &&
        !(defined(badge.sideNavLabel) && !badge.sideNavLabel),
    )
    .map((badge) => (
      <Badge key={badge.id} size="sm" {...navBadges[badge.id]}>
        {badge.sideNavLabel || badge.label}
      </Badge>
    ))
}

/**
 * Default page header badge renderer. Unknown ids render as neutral badges.
 */
export function PageHeaderBadges({badges}: {badges: NavBadge[]}): ReactNode {
  const {renderLink: RenderLink} = useMdxDocsContext()

  return badges.map((badge) => {
    const url = badge.url ?? ""
    const render = url.startsWith("/") ? (
      <RenderLink href={url} />
    ) : url.startsWith("http") ? (
      <a href={url} rel="noreferrer" target="_blank" />
    ) : (
      <div />
    )
    return (
      <Badge
        key={badge.id}
        render={render}
        size="sm"
        style={{height: 20, marginTop: 8}}
        {...headerBadges[badge.id]}
      >
        {badge.label}
      </Badge>
    )
  })
}
