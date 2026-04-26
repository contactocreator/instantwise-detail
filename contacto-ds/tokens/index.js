/**
 * CONTACTO Design System — JS Tokens v2.0.0
 * Source of truth: Figma "⭐️ real contacto" (2ofJEZzVoCk4jtcfKkiZEb)
 * 마지막 동기화: 2026-03-22
 *
 * CSS 변수와 1:1 매핑.
 * JS 환경(React Native, Canvas, inline style 등)에서 사용.
 *
 * ⚠️  FONT LICENSE WARNING
 *   FK Raster Roman Compact Trial / ABC Diatype Unlicensed Trial
 *   → 상업 배포 전 정식 라이선스 구매 또는 대체 폰트 확정 필요
 */

/* ─────────────────────────────────────────────────────────
   Primitive Colors (직접 사용 금지 — semantic 통해 참조)
   ───────────────────────────────────────────────────────── */
export const _primitive = {
  white:      '#ffffff',
  black:      '#000000',
  offWhite:   '#fefefe',
  grey100:    '#dcdddd',
  grey300:    '#c8c8c8',
  grey500:    '#909090',
  grey900:    '#16191c',

  catPink:    '#f5dfdb',
  catOrange:  '#f9af55',
  catYellow:  '#fff629',
  catYG:      '#dae000',
  catBlue:    '#2ea7e0',

  filterBlue:   '#1a76ff',
  filterPink:   '#ef62c7',
  filterRed:    '#fe3843',
  filterYellow: '#ffdb1c',
  filterGreen:  '#98fe68',

  accentGreen: '#17db4e',
  accentBrown: '#c2986d',
  accentBlush: '#e4d5d5',

  iosBlue: '#007aff',
};


/* ─────────────────────────────────────────────────────────
   Semantic Tokens — Light Mode (기본)
   ───────────────────────────────────────────────────────── */
export const tokens = {

  // Surface
  surface: {
    base:    _primitive.white,
    raised:  '#f8f8f8',
    overlay: _primitive.white,
    muted:   _primitive.grey100,
  },

  // Border
  border: {
    subtle:  _primitive.grey100,
    default: _primitive.grey300,
    strong:  _primitive.grey500,
    focus:   _primitive.black,
  },

  // Text
  text: {
    primary:   _primitive.grey900,
    secondary: _primitive.grey500,
    disabled:  _primitive.grey300,
    inverse:   _primitive.white,
    onAccent:  _primitive.white,
  },

  // Accent
  accent: {
    base:   _primitive.black,
    hover:  '#333333',
    subtle: 'rgba(0, 0, 0, 0.05)',
    muted:  'rgba(0, 0, 0, 0.10)',
    border: 'rgba(0, 0, 0, 0.20)',
  },

  // Category Backgrounds (카드/섹션 배경)
  category: {
    pink:   _primitive.catPink,
    orange: _primitive.catOrange,
    yellow: _primitive.catYellow,
    yg:     _primitive.catYG,
    blue:   _primitive.catBlue,
    grey:   _primitive.grey100,
  },

  // Filter / Tag Colors (필터 칩, 태그)
  filter: {
    blue:   _primitive.filterBlue,
    pink:   _primitive.filterPink,
    red:    _primitive.filterRed,
    yellow: _primitive.filterYellow,
    green:  _primitive.filterGreen,
  },

  // Feedback
  feedback: {
    success: {
      base:   _primitive.accentGreen,
      subtle: 'rgba(23, 219, 78, 0.10)',
      border: 'rgba(23, 219, 78, 0.25)',
    },
    warning: {
      base:   _primitive.filterYellow,
      subtle: 'rgba(255, 219, 28, 0.15)',
      border: 'rgba(255, 219, 28, 0.30)',
    },
    error: {
      base:   _primitive.filterRed,
      subtle: 'rgba(254, 56, 67, 0.10)',
      border: 'rgba(254, 56, 67, 0.25)',
    },
    info: {
      base:   _primitive.iosBlue,
      subtle: 'rgba(0, 122, 255, 0.10)',
      border: 'rgba(0, 122, 255, 0.25)',
    },
  },

  // Spacing (px values, 4pt grid)
  space: {
    xs:   4,
    sm:   8,
    md:  12,
    lg:  16,
    xl:  24,
    '2xl': 32,
    '3xl': 40,
  },

  // Border Radius
  radius: {
    sm:   4,
    md:   8,
    lg:  12,
    xl:  16,
    '2xl': 24,
    full: 9999,
  },

  // Typography
  // [!] Figma 원본 이름-값 불일치 수정:
  //   "subtitle_blended_27" → 실제값 26px
  //   "body_middle 16"      → 실제값 15px, weight: bold(700)
  fontSize: {
    display:          90,
    subtitleDisplay:  26,  // [!] Figma 원본명 27이나 실제값 26
    titleLg:          37,
    titleMd:          32,
    subtitle:         14,
    bodyDisplay:      20,
    bodyLg:           16,
    bodyMd:           15,  // [!] Figma 원본명 16이나 실제값 15
    bodyBlended:      16,
    bodyKr:           15,
    bodyKrSm:         13,
    captionDisplay:   13,
    caption:          10,
    button:           16,
  },

  lineHeight: {
    display:          1,
    subtitleDisplay:  1,
    titleLg:          1.13,
    titleMd:          1.4,
    subtitle:         1,
    bodyDisplay:      1,     // [!] Figma lh:100 → 100% = 1
    bodyLg:           1.375, // 22px / 16px
    bodyMd:           1.3,
    bodyBlended:      1,     // [!] Figma lh:100 → 1
    bodyKr:           1.3,
    bodyKrSm:         1.308, // 17px / 13px
    captionDisplay:   1.5,
    caption:          1,
    button:           1.5,
  },

  letterSpacing: {
    display:          5,   // [!] 단위 확인 필요 (px? %)
    subtitleDisplay:  5,
    bodyDisplay:      5,
    bodyBlended:      5,
    captionDisplay:   5,
    // 나머지: 0
  },

  fontWeight: {
    regular:  400,
    medium:   500,
    semibold: 600,
    bold:     700,
    black:    900,
  },

  fontFamily: {
    display:  '"FK Raster Roman Compact", "Space Mono", monospace',
    ui:       '"ABC Diatype", "Inter", "Pretendard", sans-serif',
    bodyKr:   '"Pretendard", "Apple SD Gothic Neo", "Noto Sans KR", sans-serif',
    system:   '-apple-system, BlinkMacSystemFont, "Pretendard", sans-serif',
    mono:     '"SF Mono", "JetBrains Mono", "Fira Code", monospace',
  },

  // Transition (ms)
  duration: {
    fast: 150,
    base: 250,
    slow: 400,
  },

  // Z-index
  z: {
    base:    0,
    raised:  10,
    sticky:  50,
    overlay: 100,
    modal:   1000,
    toast:   2000,
    tooltip: 3000,
  },

  // Icon Size
  icon: {
    sm: 16,
    md: 24,
    lg: 32,
    xl: 48,
  },
};


/* ─────────────────────────────────────────────────────────
   Dark Mode Overrides
   ⚠️  Figma에 다크모드 디자인 없음 — 디자이너 확인 필요
   ───────────────────────────────────────────────────────── */
export const tokensDark = {
  ...tokens,
  surface: {
    base:    '#0a0a0f',
    raised:  '#13131a',
    overlay: '#1c1c28',
    muted:   '#2a2a3d',
  },
  border: {
    subtle:  '#2a2a3d',
    default: '#4a4a6a',
    strong:  '#6a6a8a',
    focus:   _primitive.white,
  },
  text: {
    primary:   '#f0f0f5',
    secondary: '#8888aa',
    disabled:  '#4a4a6a',
    inverse:   _primitive.black,
    onAccent:  _primitive.black,
  },
  accent: {
    base:   _primitive.white,
    hover:  '#cccccc',
    subtle: 'rgba(255, 255, 255, 0.05)',
    muted:  'rgba(255, 255, 255, 0.10)',
    border: 'rgba(255, 255, 255, 0.20)',
  },
};


/* ─────────────────────────────────────────────────────────
   Helper Functions
   ───────────────────────────────────────────────────────── */

/** 피드백 타입에 따라 스타일 객체 반환 */
export function feedbackStyle(type) {
  const f = tokens.feedback[type];
  if (!f) throw new Error(`Unknown feedback type: "${type}". Use: success | warning | error | info`);
  return {
    background: f.subtle,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: f.border,
    color: f.base,
  };
}

/** 카테고리 이름으로 배경색 반환 */
export function categoryColor(name) {
  const c = tokens.category[name];
  if (!c) throw new Error(`Unknown category: "${name}". Use: pink | orange | yellow | yg | blue | grey`);
  return c;
}

/** 필터 이름으로 색상 반환 */
export function filterColor(name) {
  const c = tokens.filter[name];
  if (!c) throw new Error(`Unknown filter: "${name}". Use: blue | pink | red | yellow | green`);
  return c;
}

export default tokens;
