/**
 * EL-Design System — Tailwind Extension
 * Use with: extend in tailwind.config.ts
 */

export const elColors = {
  // Foundation scales
  'el-blue': {
    50: 'hsl(var(--el-blue-50))',
    100: 'hsl(var(--el-blue-100))',
    200: 'hsl(var(--el-blue-200))',
    300: 'hsl(var(--el-blue-300))',
    400: 'hsl(var(--el-blue-400))',
    500: 'hsl(var(--el-blue-500))',
    600: 'hsl(var(--el-blue-600))',
    700: 'hsl(var(--el-blue-700))',
    800: 'hsl(var(--el-blue-800))',
    900: 'hsl(var(--el-blue-900))',
    950: 'hsl(var(--el-blue-950))',
  },
  'el-purple': {
    50: 'hsl(var(--el-purple-50))',
    100: 'hsl(var(--el-purple-100))',
    200: 'hsl(var(--el-purple-200))',
    300: 'hsl(var(--el-purple-300))',
    400: 'hsl(var(--el-purple-400))',
    500: 'hsl(var(--el-purple-500))',
    600: 'hsl(var(--el-purple-600))',
    700: 'hsl(var(--el-purple-700))',
    800: 'hsl(var(--el-purple-800))',
    900: 'hsl(var(--el-purple-900))',
    950: 'hsl(var(--el-purple-950))',
  },
  'el-neutral': {
    white: 'hsl(var(--el-neutral-white))',
    50: 'hsl(var(--el-neutral-50))',
    '50-alt': 'hsl(var(--el-neutral-50-alt))',
    100: 'hsl(var(--el-neutral-100))',
    200: 'hsl(var(--el-neutral-200))',
    300: 'hsl(var(--el-neutral-300))',
    400: 'hsl(var(--el-neutral-400))',
    500: 'hsl(var(--el-neutral-500))',
    600: 'hsl(var(--el-neutral-600))',
    700: 'hsl(var(--el-neutral-700))',
    800: 'hsl(var(--el-neutral-800))',
    900: 'hsl(var(--el-neutral-900))',
    950: 'hsl(var(--el-neutral-950))',
    black: 'hsl(var(--el-neutral-black))',
  },
  'el-green': {
    50: 'hsl(var(--el-green-50))',
    100: 'hsl(var(--el-green-100))',
    200: 'hsl(var(--el-green-200))',
    300: 'hsl(var(--el-green-300))',
    400: 'hsl(var(--el-green-400))',
    500: 'hsl(var(--el-green-500))',
    600: 'hsl(var(--el-green-600))',
    700: 'hsl(var(--el-green-700))',
    800: 'hsl(var(--el-green-800))',
    900: 'hsl(var(--el-green-900))',
  },
  'el-red': {
    50: 'hsl(var(--el-red-50))',
    100: 'hsl(var(--el-red-100))',
    200: 'hsl(var(--el-red-200))',
    300: 'hsl(var(--el-red-300))',
    400: 'hsl(var(--el-red-400))',
    500: 'hsl(var(--el-red-500))',
    600: 'hsl(var(--el-red-600))',
    700: 'hsl(var(--el-red-700))',
    800: 'hsl(var(--el-red-800))',
    900: 'hsl(var(--el-red-900))',
  },
  'el-orange': {
    50: 'hsl(var(--el-orange-50))',
    100: 'hsl(var(--el-orange-100))',
    200: 'hsl(var(--el-orange-200))',
    300: 'hsl(var(--el-orange-300))',
    400: 'hsl(var(--el-orange-400))',
    500: 'hsl(var(--el-orange-500))',
    600: 'hsl(var(--el-orange-600))',
    700: 'hsl(var(--el-orange-700))',
    800: 'hsl(var(--el-orange-800))',
    900: 'hsl(var(--el-orange-900))',
  },

  // Semantic tokens
  'el-brand': {
    DEFAULT: 'hsl(var(--el-brand))',
    foreground: 'hsl(var(--el-brand-foreground))',
    hover: 'hsl(var(--el-brand-hover))',
    pressed: 'hsl(var(--el-brand-pressed))',
    selected: 'hsl(var(--el-brand-selected))',
  },
  'el-joule': {
    DEFAULT: 'hsl(var(--el-joule))',
    foreground: 'hsl(var(--el-joule-foreground))',
    hover: 'hsl(var(--el-joule-hover))',
    pressed: 'hsl(var(--el-joule-pressed))',
    surface: 'hsl(var(--el-joule-surface))',
    border: 'hsl(var(--el-joule-border))',
  },
  'el-success': {
    DEFAULT: 'hsl(var(--el-success))',
    foreground: 'hsl(var(--el-success-foreground))',
    surface: 'hsl(var(--el-success-surface))',
  },
  'el-warning': {
    DEFAULT: 'hsl(var(--el-warning))',
    foreground: 'hsl(var(--el-warning-foreground))',
    surface: 'hsl(var(--el-warning-surface))',
  },
  'el-error': {
    DEFAULT: 'hsl(var(--el-error))',
    foreground: 'hsl(var(--el-error-foreground))',
    surface: 'hsl(var(--el-error-surface))',
  },
  'el-info': {
    DEFAULT: 'hsl(var(--el-info))',
    foreground: 'hsl(var(--el-info-foreground))',
    surface: 'hsl(var(--el-info-surface))',
  },
  'el-surface': {
    DEFAULT: 'hsl(var(--el-surface))',
    elevated: 'hsl(var(--el-surface-elevated))',
  },
  'el-background': {
    DEFAULT: 'hsl(var(--el-background))',
    alt: 'hsl(var(--el-background-alt))',
  },
  'el-foreground': {
    DEFAULT: 'hsl(var(--el-foreground))',
    muted: 'hsl(var(--el-foreground-muted))',
    subtle: 'hsl(var(--el-foreground-subtle))',
  },
  'el-border': {
    DEFAULT: 'hsl(var(--el-border))',
    strong: 'hsl(var(--el-border-strong))',
    focus: 'hsl(var(--el-border-focus))',
  },
  'el-icon': {
    primary: 'hsl(var(--el-icon-primary))',
    muted: 'hsl(var(--el-icon-muted))',
  },
};

export const elSpacing = {
  'el-0': 'var(--el-space-0)',
  'el-1': 'var(--el-space-1)',
  'el-2': 'var(--el-space-2)',
  'el-3': 'var(--el-space-3)',
  'el-4': 'var(--el-space-4)',
  'el-5': 'var(--el-space-5)',
  'el-6': 'var(--el-space-6)',
  'el-8': 'var(--el-space-8)',
  'el-10': 'var(--el-space-10)',
  'el-12': 'var(--el-space-12)',
};

export const elBorderRadius = {
  'el-none': 'var(--el-radius-none)',
  'el-xs': 'var(--el-radius-xs)',
  'el-sm': 'var(--el-radius-sm)',
  'el-md': 'var(--el-radius-md)',
  'el-lg': 'var(--el-radius-lg)',
  'el-xl': 'var(--el-radius-xl)',
  'el-2xl': 'var(--el-radius-2xl)',
  'el-3xl': 'var(--el-radius-3xl)',
  'el-full': 'var(--el-radius-full)',
};

export const elBoxShadow = {
  'el-sm': 'var(--el-shadow-sm)',
  'el-md': 'var(--el-shadow-md)',
  'el-lg': 'var(--el-shadow-lg)',
  'el-xl': 'var(--el-shadow-xl)',
};

export const elFontSize = {
  'el-xs': ['var(--el-font-size-xs)', { lineHeight: '1rem' }],
  'el-sm': ['var(--el-font-size-sm)', { lineHeight: '1.3125rem' }],
  'el-base': ['var(--el-font-size-base)', { lineHeight: '1.5rem' }],
  'el-lg': ['var(--el-font-size-lg)', { lineHeight: '1.75rem' }],
  'el-xl': ['var(--el-font-size-xl)', { lineHeight: '1.875rem' }],
  'el-2xl': ['var(--el-font-size-2xl)', { lineHeight: '2rem' }],
  'el-3xl': ['var(--el-font-size-3xl)', { lineHeight: '2.5rem' }],
} as const;
