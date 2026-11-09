/**
 * Maps antd 5 theme tokens to QDS token names. The builder resolves each name
 * against every brand/theme dictionary, so one table yields all themes.
 *
 * Global tokens drive most antd components. Component tokens cover places where
 * QUI's own component CSS picks a different QDS token than antd would derive.
 * Overrides cover styling antd exposes no token for.
 */

export type AntdValueSpec =
  | {kind: "color" | "raw" | "px" | "fontSize"; name: string}
  | {fontSize: string; kind: "ratio"; lineHeight: string}
  | {cellFont: string; height: string; kind: "cellPadding"}
  | {kind: "focusRing" | "inset" | "optionPadding"; name: string}
  | {kind: "literal"; value: string | number | boolean}

export type AntdTokenMapping = Record<string, AntdValueSpec>

export interface AntdCssOverride {
  declarations: Record<string, AntdValueSpec>
  selector: string
}

const color = (name: string): AntdValueSpec => ({kind: "color", name})
const px = (name: string): AntdValueSpec => ({kind: "px", name})
const raw = (name: string): AntdValueSpec => ({kind: "raw", name})
const fontSizeOf = (name: string): AntdValueSpec => ({kind: "fontSize", name})
const ratio = (lineHeight: string, fontSize: string): AntdValueSpec => ({
  fontSize,
  kind: "ratio",
  lineHeight,
})
const literal = (value: string | number | boolean): AntdValueSpec => ({
  kind: "literal",
  value,
})
const cellPadding = (height: string, cellFont: string): AntdValueSpec => ({
  cellFont,
  height,
  kind: "cellPadding",
})
const focusRing = (name: string): AntdValueSpec => ({kind: "focusRing", name})
const optionPadding = (name: string): AntdValueSpec => ({
  kind: "optionPadding",
  name,
})
const inset = (name: string): AntdValueSpec => ({kind: "inset", name})

export const antdGlobalTokens = {
  borderRadius: px("border-radius-100"),
  borderRadiusLG: px("border-radius-150"),
  borderRadiusSM: px("border-radius-75"),
  borderRadiusXS: px("border-radius-50"),
  boxShadow: raw("shadow-high"),
  boxShadowSecondary: raw("shadow-medium"),
  boxShadowTertiary: raw("shadow-low"),
  colorBgBase: color("color-background-neutral-00"),
  colorBgContainer: color("color-surface-primary"),
  colorBgContainerDisabled: color("color-utility-disabled-background"),
  colorBgElevated: color("color-surface-overlay"),
  colorBgLayout: color("color-surface-secondary"),
  colorBgMask: color("color-utility-scrim-default"),
  colorBgSpotlight: color("color-background-neutral-10"),
  colorBgTextActive: color("color-interactive-background-ghost-pressed"),

  colorBgTextHover: color("color-interactive-background-ghost-hover"),
  colorBorder: color("color-interactive-border-neutral-idle"),
  colorBorderSecondary: color("color-border-neutral-01"),
  colorError: color("color-interactive-background-danger-idle"),
  colorErrorActive: color("color-interactive-background-danger-pressed"),
  colorErrorBg: color("color-background-support-danger-subtle"),
  colorErrorBorder: color("color-border-support-danger-medium"),
  colorErrorHover: color("color-interactive-background-danger-hover"),
  colorErrorOutline: color("color-interactive-border-danger-idle"),
  colorErrorText: color("color-text-support-danger"),
  colorFill: color("color-utility-opacity-neutral-05"),
  colorFillQuaternary: color("color-utility-opacity-neutral-02"),
  colorFillSecondary: color("color-interactive-background-ghost-pressed"),
  colorFillTertiary: color("color-interactive-background-ghost-hover"),
  colorIcon: color("color-icon-neutral-secondary"),
  colorIconHover: color("color-icon-neutral-primary"),
  colorInfo: color("color-background-support-info"),
  colorInfoBg: color("color-background-support-info-subtle"),
  colorInfoBorder: color("color-border-support-info-medium"),
  colorInfoText: color("color-text-support-info"),
  colorLink: color("color-interactive-text-link-default-idle"),
  colorLinkActive: color("color-interactive-text-link-default-pressed"),
  colorLinkHover: color("color-interactive-text-link-default-hover"),
  colorPrimary: color("color-interactive-background-primary-idle"),

  colorPrimaryActive: color("color-interactive-background-primary-pressed"),
  colorPrimaryBg: color("color-utility-opacity-brand-03"),
  colorPrimaryBgHover: color("color-utility-opacity-brand-04"),
  colorPrimaryBorder: color("color-utility-focus-border"),
  colorPrimaryBorderHover: color("color-border-brand-primary-subtle"),
  colorPrimaryHover: color("color-interactive-background-primary-hover"),
  colorPrimaryText: color("color-interactive-text-primary-idle"),
  colorPrimaryTextActive: color("color-interactive-text-primary-pressed"),
  colorPrimaryTextHover: color("color-interactive-text-primary-hover"),
  colorSplit: color("color-border-neutral-01"),
  colorSuccess: color("color-background-support-success"),
  colorSuccessBg: color("color-background-support-success-subtle"),
  colorSuccessBorder: color("color-border-support-success-medium"),
  colorSuccessText: color("color-text-support-success"),
  colorText: color("color-text-neutral-primary"),
  colorTextBase: color("color-text-neutral-primary"),
  colorTextDisabled: color("color-utility-disabled-text"),
  colorTextLightSolid: color("component-button-variant-fill-primary-text"),
  colorTextPlaceholder: color("color-utility-placeholder-text"),
  colorTextSecondary: color("color-text-neutral-secondary"),
  colorTextTertiary: color("color-utility-placeholder-text"),
  colorWarning: color("color-background-support-warning"),
  colorWarningBg: color("color-background-support-warning-subtle"),
  colorWarningBorder: color("color-border-support-warning-medium"),
  colorWarningOutline: color("color-border-support-warning"),

  // antd derives SM/LG as 0.75x/1.25x, which lands on QUI's 24/32/40 heights.
  controlHeight: px("sizing-800"),
  controlHeightLG: px("sizing-1000"),
  controlHeightSM: px("sizing-600"),
  // QUI marks selected options with an indicator only; antd always paints a
  // background, so use the faintest brand tint.
  controlItemBgActive: color("color-utility-opacity-brand-03"),
  controlItemBgHover: color("color-interactive-background-ghost-hover"),
  // With a 1px width, antd's input focus shadow reproduces QUI's border + outline.
  controlOutline: color("color-utility-focus-border"),
  controlOutlineWidth: literal(1),
  fontFamily: raw("type-font-family-secondary"),
  fontFamilyCode: raw("type-font-family-tertiary"),
  fontSize: fontSizeOf("font-static-body-sm-default"),
  fontSizeHeading1: fontSizeOf("font-static-heading-lg-default"),
  fontSizeHeading2: fontSizeOf("font-static-heading-md-default"),
  fontSizeHeading3: fontSizeOf("font-static-heading-sm-default"),
  fontSizeHeading4: fontSizeOf("font-static-heading-xs-default"),
  fontSizeHeading5: fontSizeOf("font-static-heading-xxs-default"),
  fontSizeLG: fontSizeOf("font-static-body-md-default"),
  fontSizeSM: fontSizeOf("font-static-body-xs-default"),
  fontWeightStrong: raw("type-font-weight-body-bold"),
  lineWidth: px("border-width-sm"),
  lineWidthFocus: literal(1),
  wireframe: literal(false),
} satisfies AntdTokenMapping

export const antdComponentTokens = {
  Button: {
    borderColorDisabled: color("color-utility-disabled-border"),
    borderRadius: px("component-button-global-border-radius"),
    borderRadiusLG: px("component-button-global-border-radius"),
    borderRadiusSM: px("component-button-global-border-radius"),
    contentFontSize: px("component-button-type-md-font-size"),
    contentFontSizeLG: px("component-button-type-md-font-size"),
    contentFontSizeSM: px("component-button-type-sm-font-size"),
    contentLineHeight: ratio(
      "component-button-type-md-line-height",
      "component-button-type-md-font-size",
    ),
    contentLineHeightLG: ratio(
      "component-button-type-md-line-height",
      "component-button-type-md-font-size",
    ),
    contentLineHeightSM: ratio(
      "component-button-type-sm-line-height",
      "component-button-type-sm-font-size",
    ),
    dangerColor: color("component-button-variant-fill-danger-text"),
    dangerShadow: literal("none"),
    defaultActiveBg: color("color-interactive-background-ghost-pressed"),
    defaultActiveBorderColor: color(
      "component-button-variant-outline-neutral-border-pressed",
    ),
    defaultActiveColor: color("color-interactive-text-neutral-pressed"),
    defaultBg: color("color-interactive-background-ghost-idle"),
    defaultBorderColor: color(
      "component-button-variant-outline-neutral-border-idle",
    ),
    // antd's default button maps to QUI's outline/neutral.
    defaultColor: color("color-interactive-text-neutral-idle"),
    defaultHoverBg: color("color-interactive-background-ghost-hover"),
    defaultHoverBorderColor: color(
      "component-button-variant-outline-neutral-border-hover",
    ),
    defaultHoverColor: color("color-interactive-text-neutral-hover"),
    defaultShadow: literal("none"),
    fontWeight: raw("component-button-type-md-font-weight"),
    iconGap: px("spacing-100"),
    paddingInline: px("spacing-300"),
    paddingInlineLG: px("spacing-400"),
    paddingInlineSM: px("spacing-250"),
    primaryColor: color("component-button-variant-fill-primary-text"),
    primaryShadow: literal("none"),
    textHoverBg: color("color-interactive-background-ghost-hover"),
    textTextActiveColor: color("color-interactive-text-neutral-pressed"),
    textTextColor: color("color-interactive-text-neutral-idle"),
    textTextHoverColor: color("color-interactive-text-neutral-hover"),
  },
  Card: {
    actionsBg: color("color-background-neutral-00"),
    bodyPadding: px("spacing-600"),
    bodyPaddingSM: px("spacing-400"),
    borderRadiusLG: px("border-radius-100"),
    extraColor: color("color-text-neutral-secondary"),
    headerBg: color("color-background-neutral-01"),
    headerFontSize: fontSizeOf("font-static-heading-xs-default"),
    headerFontSizeSM: fontSizeOf("font-static-heading-xxs-default"),
    headerPadding: px("spacing-600"),
    headerPaddingSM: px("spacing-400"),
  },
  Checkbox: {
    borderRadiusSM: px("border-radius-50"),
    colorBorder: color("color-interactive-border-neutral-idle"),
    colorPrimaryHover: color("color-interactive-background-primary-hover"),
  },
  Input: {
    activeBg: color("color-background-neutral-00"),
    activeBorderColor: color("color-utility-focus-border"),
    activeShadow: focusRing("color-utility-focus-border"),
    addonBg: color("color-background-neutral-02"),
    errorActiveShadow: focusRing("color-interactive-border-danger-idle"),
    hoverBg: color("color-background-neutral-00"),
    hoverBorderColor: color("color-interactive-border-neutral-hover"),
    inputFontSize: fontSizeOf("font-static-body-sm-default"),
    inputFontSizeLG: fontSizeOf("font-static-body-md-default"),
    inputFontSizeSM: fontSizeOf("font-static-body-xs-default"),
    paddingInline: px("spacing-300"),
    paddingInlineLG: px("spacing-400"),
    paddingInlineSM: px("spacing-200"),
    warningActiveShadow: focusRing("color-border-support-warning"),
  },
  InputNumber: {
    activeBg: color("color-background-neutral-00"),
    activeBorderColor: color("color-utility-focus-border"),
    activeShadow: focusRing("color-utility-focus-border"),
    errorActiveShadow: focusRing("color-interactive-border-danger-idle"),
    hoverBg: color("color-background-neutral-00"),
    hoverBorderColor: color("color-interactive-border-neutral-hover"),
    inputFontSize: fontSizeOf("font-static-body-sm-default"),
    inputFontSizeLG: fontSizeOf("font-static-body-md-default"),
    inputFontSizeSM: fontSizeOf("font-static-body-xs-default"),
    paddingInline: px("spacing-300"),
    paddingInlineLG: px("spacing-400"),
    paddingInlineSM: px("spacing-200"),
    warningActiveShadow: focusRing("color-border-support-warning"),
  },
  Modal: {
    borderRadiusLG: px("border-radius-100"),
    contentBg: color("color-surface-overlay"),
    footerBg: literal("transparent"),
    headerBg: color("color-surface-overlay"),
    titleColor: color("color-text-neutral-primary"),
    titleFontSize: fontSizeOf("font-static-heading-xs-default"),
  },
  Radio: {
    buttonCheckedBg: color("color-background-neutral-00"),
    buttonSolidCheckedActiveBg: color(
      "color-interactive-background-primary-pressed",
    ),
    buttonSolidCheckedBg: color("color-interactive-background-primary-idle"),
    buttonSolidCheckedHoverBg: color(
      "color-interactive-background-primary-hover",
    ),
    colorBorder: color("color-interactive-border-neutral-idle"),
    dotSize: px("sizing-200"),
    radioSize: px("sizing-400"),
  },
  Select: {
    activeBorderColor: color("color-utility-focus-border"),
    activeOutlineColor: color("color-utility-focus-border"),
    hoverBorderColor: color("color-interactive-border-neutral-hover"),
    multipleItemBg: literal("transparent"),
    multipleItemBorderColor: color("color-interactive-border-neutral-idle"),
    multipleItemHeight: px("sizing-600"),
    multipleItemHeightLG: px("sizing-700"),
    multipleItemHeightSM: px("sizing-500"),
    multipleSelectorBgDisabled: color("color-utility-disabled-background"),
    optionActiveBg: color("color-interactive-background-ghost-hover"),
    optionFontSize: fontSizeOf("font-static-body-sm-default"),
    optionHeight: px("sizing-1000"),
    optionPadding: optionPadding("spacing-400"),
    optionSelectedBg: color("color-utility-opacity-brand-03"),
    optionSelectedColor: color("color-text-neutral-primary"),
    optionSelectedFontWeight: raw("type-font-weight-body-default"),
    selectorBg: color("color-background-neutral-00"),
  },
  Steps: {
    errorIconBorderColor: color("color-icon-support-danger"),
    finishIconBgColor: color("color-interactive-background-ghost-idle"),
    finishIconBorderColor: color("color-background-brand-primary"),
    finishIconColor: color("color-background-brand-primary"),
    finishTailColor: color("color-background-brand-primary"),
    lineWidth: literal(2),
    processIconBgColor: color("color-background-brand-primary"),
    processIconBorderColor: color("color-background-brand-primary"),
    processIconColor: color("color-utility-persistent-white"),
    processTailColor: color("cross-component-track-default"),
    waitIconBgColor: color("color-interactive-background-ghost-idle"),
    waitIconBorderColor: color("color-border-support-neutral-medium"),
    waitIconColor: color("color-text-neutral-secondary"),
    waitTailColor: color("cross-component-track-default"),
  },
  Switch: {
    colorPrimary: color("color-interactive-background-primary-idle"),
    colorPrimaryHover: color("color-interactive-background-primary-hover"),
    handleShadow: literal("none"),
    handleSize: literal(14),
    handleSizeSM: literal(10),
    trackHeight: px("sizing-500"),
    trackHeightSM: px("sizing-400"),
    trackMinWidth: literal(34),
    trackMinWidthSM: literal(28),
    trackPadding: literal(3),
  },
  Table: {
    bodySortBg: color("color-background-neutral-01"),
    borderColor: color("color-border-neutral-01"),
    cellFontSize: fontSizeOf("font-static-body-sm-default"),
    cellFontSizeMD: fontSizeOf("font-static-body-xs-default"),
    cellFontSizeSM: fontSizeOf("font-static-body-xs-default"),
    cellPaddingBlock: cellPadding("sizing-1400", "font-static-body-sm-default"),
    cellPaddingBlockMD: cellPadding(
      "sizing-1200",
      "font-static-body-xs-default",
    ),
    cellPaddingBlockSM: cellPadding(
      "sizing-1000",
      "font-static-body-xs-default",
    ),
    // QUI's large table uses 20px, but antd's default size is the everyday one:
    // 16px keeps text from wrapping earlier than in existing antd apps.
    cellPaddingInline: px("spacing-400"),
    cellPaddingInlineMD: px("spacing-400"),
    cellPaddingInlineSM: px("spacing-300"),
    fixedHeaderSortActiveBg: color("color-background-neutral-03"),
    footerBg: color("color-background-neutral-02"),
    footerColor: color("color-text-neutral-primary"),
    headerBg: color("color-background-neutral-02"),
    headerBorderRadius: px("border-radius-100"),
    headerColor: color("color-text-neutral-primary"),
    headerFilterHoverBg: color("color-interactive-background-ghost-hover"),
    headerSortActiveBg: color("color-background-neutral-03"),
    headerSortHoverBg: color("color-background-neutral-03"),
    headerSplitColor: color("color-border-neutral-01"),
    rowExpandedBg: color("color-background-neutral-01"),
    rowHoverBg: color("color-interactive-background-ghost-hover"),
    rowSelectedBg: color("color-utility-opacity-brand-03"),
    rowSelectedHoverBg: color("color-utility-opacity-brand-04"),
  },
  Tag: {
    borderRadiusSM: px("border-radius-100"),
    colorBorder: color("color-interactive-border-neutral-idle"),
    defaultBg: literal("transparent"),
    defaultColor: color("color-interactive-text-neutral-idle"),
  },
} satisfies Record<string, AntdTokenMapping>

const clickableStep =
  ".ant-steps .ant-steps-item:not(.ant-steps-item-active) > .ant-steps-item-container[role='button']"

export const antdCssOverrides: AntdCssOverride[] = [
  {
    declarations: {
      background: color("color-interactive-background-ghost-hover"),
    },
    selector: `${clickableStep}:hover .ant-steps-item-icon`,
  },
  {
    declarations: {
      background: color("color-interactive-background-ghost-pressed"),
    },
    selector: `${clickableStep}:active .ant-steps-item-icon`,
  },
  // QUI's unchecked switch is a white track with a border and a dark thumb;
  // antd only exposes one handle color and a grey track.
  {
    declarations: {
      background: color("color-background-neutral-00"),
      "box-shadow": inset("color-border-neutral-03"),
    },
    selector: ".ant-switch:not(.ant-switch-checked)",
  },
  {
    declarations: {background: color("color-background-neutral-00")},
    selector:
      ".ant-switch:not(.ant-switch-checked):hover:not(.ant-switch-disabled)",
  },
  {
    declarations: {
      "background-color": color("color-interactive-icon-neutral-idle"),
    },
    selector: ".ant-switch:not(.ant-switch-checked) .ant-switch-handle::before",
  },
  {
    declarations: {
      "background-color": color("color-interactive-icon-neutral-hover"),
    },
    selector:
      ".ant-switch:not(.ant-switch-checked):hover .ant-switch-handle::before",
  },
  {
    declarations: {color: color("color-text-neutral-primary")},
    selector:
      ".ant-switch:not(.ant-switch-checked) .ant-switch-inner .ant-switch-inner-unchecked",
  },
  // antd's Steps style hard-codes these from colorTextDescription, so their
  // component tokens are ignored.
  {
    declarations: {color: color("color-text-neutral-primary")},
    selector:
      ".ant-steps .ant-steps-item-wait > .ant-steps-item-container > .ant-steps-item-content > .ant-steps-item-title",
  },
  {
    declarations: {color: color("color-text-neutral-secondary")},
    selector:
      ".ant-steps .ant-steps-item:is(.ant-steps-item-wait, .ant-steps-item-finish) > .ant-steps-item-container > .ant-steps-item-content > .ant-steps-item-description",
  },
  {
    declarations: {"align-items": literal("center")},
    selector: ".ant-select-dropdown .ant-select-item-option",
  },
]
