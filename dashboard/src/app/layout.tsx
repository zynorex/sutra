import type { Metadata } from "next";
import "./globals.css";
import Banner from "../components/Banner";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import ThemeListener from "../components/ThemeListener";

export const metadata: Metadata = {
  title: "S.U.T.R.A. | Secure Unjammable Tactical Resilient Array",
  description: "Secure Unjammable Tactical Resilient Array monitoring interface.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (isDark) {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body>
        <ThemeListener />
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--color-canvas)', transition: 'background-color 0.3s' }}>
          <Banner />
          <Navigation />
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
