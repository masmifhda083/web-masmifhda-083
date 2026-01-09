// FILE: lib/theme-tina.ts

export interface ThemeSettings {
  colors: {
    primaryColor: string;
    bodyBgColor: string;
    fontColor: string;
    headingColor: string;
    linkColor: string;
    linkHoverColor: string;
    borderColor: string;
    blockquoteColor: string;
  };
  header: {
    bgColor: string;
    fontColor: string;
    borderColor: string;
  };
  typography: {
    bodyFont: string;
    headingFont: string;
    h2Size: string;
    h3Size: string;
    h4Size: string;
    h5Size: string;
    h6Size: string;
  };
  logo: {
    maxWidth: number;
    mobileWidth: number;
  };
}

// Hapus fungsi generateThemeCSS, kita akan gunakan cara langsung
// export function generateThemeCSS(theme: ThemeSettings): string {
//   return `
//     :root {
//       /* Colors */
//       --primary-color: ${theme.colors.primaryColor};
//       --body-bg-color: ${theme.colors.bodyBgColor};
//       --font-color: ${theme.colors.fontColor};
//       --heading-color: ${theme.colors.headingColor};
//       --link-color: ${theme.colors.linkColor};
//       --link-hover-color: ${theme.colors.linkHoverColor};
//       --border-color: ${theme.colors.borderColor};
//       --blockquote-color: ${theme.colors.blockquoteColor};
      
//       /* Header */
//       --header-bg-color: ${theme.header.bgColor};
//       --header-font-color: ${theme.header.fontColor};
//       --header-border-color: ${theme.header.borderColor};
      
//       /* Typography */
//       --body-font: ${theme.typography.bodyFont};
//       --heading-font: ${theme.typography.headingFont};
//       --h2-size: ${theme.typography.h2Size};
//       --h3-size: ${theme.typography.h3Size};
//       --h4-size: ${theme.typography.h4Size};
//       --h5-size: ${theme.typography.h5Size};
//       --h6-size: ${theme.typography.h6Size};
      
//       /* Logo */
//       --logo-max-width: ${theme.logo.maxWidth}px;
//       --logo-mobile-width: ${theme.logo.mobileWidth}px;
//     }
//   `;
// }

// Fungsi getThemeSettings yang lebih sederhana
export function getThemeSettings(): ThemeSettings {
  // Default values saja dulu
  return {
    colors: {
      primaryColor: '#3b82f6',
      bodyBgColor: '#ffffff',
      fontColor: '#1f2937',
      headingColor: '#111827',
      linkColor: '#2563eb',
      linkHoverColor: '#1d4ed8',
      borderColor: '#d1d5db',
      blockquoteColor: '#e5e7eb',
    },
    header: {
      bgColor: '#ffffff',
      fontColor: '#111827',
      borderColor: '#e5e7eb',
    },
    typography: {
      bodyFont: "'Inter', sans-serif",
      headingFont: "'Inter', sans-serif",
      h2Size: '1.75rem',
      h3Size: '1.5rem',
      h4Size: '1.25rem',
      h5Size: '1.125rem',
      h6Size: '1rem',
    },
    logo: {
      maxWidth: 200,
      mobileWidth: 150,
    },
  };
}