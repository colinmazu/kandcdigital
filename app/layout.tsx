import "./globals.css";

export const metadata = {
  title: "Spanish → English Quiz",
  description: "Practice Spanish vocabulary using a local JSON dictionary.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <div className="mx-auto max-w-2xl px-6 py-10">
          <header className="mb-8 flex items-center justify-between">
            <h1 className="text-2xl font-semibold tracking-tight">Spanish → English Quiz</h1>
            <a
              href="https://github.com/"
              target="_blank"
              rel="noreferrer"
              className="text-sm opacity-70 hover:opacity-100"
            >
              Edit the dictionary
            </a>
          </header>
          {children}
          <footer className="mt-12 text-center text-sm opacity-60">
            © K and C Digital Studio 2025
          </footer>
        </div>
      </body>
    </html>
  );
}