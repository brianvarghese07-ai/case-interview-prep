import './globals.css'
import ThemeToggle from './components/ThemeToggle'
import { Analytics } from '@vercel/analytics/react'

export const metadata = {
  title: 'Case Prep — IFSA Casebooks 2023-2025',
  description:
    'A searchable library of consulting case interviews from the IFSA 2023, 2024, and 2025 casebooks. Filter by year, company, industry, and difficulty to practise your case frameworks.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var stored = localStorage.getItem('caseprep-theme');
                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  var theme = stored || (prefersDark ? 'dark' : 'light');
                  document.documentElement.dataset.theme = theme;
                  document.documentElement.style.colorScheme = theme === 'dark' ? 'dark' : 'light';
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen">
        {/* Top Navigation Bar */}
        <header className="sticky top-0 z-50 border-b border-[color:var(--border)] bg-[color:var(--header)]/95 backdrop-blur-md">
          <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
            {/* Logo / Brand */}
            <a href="/" className="flex items-center gap-2.5 group min-w-0">
              <div className="w-8 h-8 rounded-lg bg-[color:var(--brand)] flex items-center justify-center flex-shrink-0">
                <svg viewBox="0 0 20 20" fill="white" className="w-4 h-4">
                  <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                </svg>
              </div>
              <p className="text-sm sm:text-base font-semibold tracking-tight text-[color:var(--ink)] truncate">
                Case Interview Prep
              </p>
            </a>

            {/* Right side links */}
            <nav className="flex items-center gap-1 sm:gap-2">
              <a
                href="/"
                className="rounded-lg px-2 py-1.5 text-sm font-medium text-[color:var(--ink-soft)] transition-colors hover:bg-[color:var(--brand-soft)] hover:text-[color:var(--brand)] sm:px-3"
              >
                Cases
              </a>
              <a
                href="/practice"
                className="rounded-lg px-2 py-1.5 text-sm font-medium text-[color:var(--ink-soft)] transition-colors hover:bg-[color:var(--brand-soft)] hover:text-[color:var(--brand)] sm:px-3"
              >
                Practice
              </a>
              <ThemeToggle />
              <a href="/practice" className="btn-primary hidden md:inline-flex ml-1">
                Start practice
              </a>
            </nav>
          </div>
        </header>

        <main className="relative">{children}</main>
        <Analytics />
      </body>
    </html>
  )
}
