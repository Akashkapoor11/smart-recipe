import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-dvh">
        {/* Fixed header */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur border-b shadow-sm">
          <div className="w-full max-w-screen-2xl mx-auto px-6 py-3 flex items-center gap-4">
            <a href="/" className="font-semibold text-lg text-black">🍳 Smart Recipe</a>
            <nav className="ml-auto flex gap-3">
              <a className="btn" href="/recipes">All Recipes</a>
              <a className="btn" href="/favorites">Favorites</a>
              <a className="btn" href="https://github.com/yourname/smart-recipe" target="_blank">GitHub</a>
            </nav>
          </div>
        </header>

        {/* Push content below fixed header (adjust if you change header height) */}
        <main className="pt-20 w-full max-w-screen-2xl mx-auto px-6 py-6">
          {children}
        </main>

        <footer className="w-full max-w-screen-2xl mx-auto px-6 py-10 text-sm text-gray-500">
          © {new Date().getFullYear()} Smart Recipe
        </footer>
      </body>
    </html>
  );
}
