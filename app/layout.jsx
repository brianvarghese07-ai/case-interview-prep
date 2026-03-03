import './globals.css'

export const metadata = {
  title: 'Case Prep — IFSA SSC Casebook 2025',
  description:
    'A searchable library of consulting case interviews from the IFSA St. Stephen\'s Casebook 2025. Filter by company, industry, and difficulty to practise your case frameworks.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        {/* Top Navigation Bar */}
        <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/85 backdrop-blur-md">
          <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            {/* Logo / Brand */}
            <a href="/" className="flex items-center gap-3 group">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center flex-shrink-0 shadow-md shadow-brand-200/80">
                <svg viewBox="0 0 20 20" fill="white" className="w-4 h-4">
                  <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                </svg>
              </div>
              <div className="leading-tight">
                <p className="text-base font-semibold text-slate-900 group-hover:text-brand-700 transition-colors">
                  Case Interview Prep
                </p>
                <p className="text-xs text-slate-500 hidden sm:block">IFSA SSC Casebook 2025</p>
              </div>
            </a>

            {/* Right side links */}
            <nav className="flex items-center gap-2">
              <a
                href="/"
                className="text-sm font-medium text-slate-700 hover:text-brand-700 px-3 py-1.5 rounded-lg hover:bg-brand-50 transition-colors"
              >
                Cases
              </a>
              <a
                href="/#about"
                className="text-sm font-medium text-slate-700 hover:text-brand-700 px-3 py-1.5 rounded-lg hover:bg-brand-50 transition-colors"
              >
                About
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 btn-primary"
              >
                GitHub
              </a>
            </nav>
          </div>
        </header>

        <main className="relative">{children}</main>
      </body>
    </html>
  )
}
