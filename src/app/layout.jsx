import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavBar from "../components/shared/NavBar";
import Footer from "@/components/shared/Footer";
import { Toaster } from "react-hot-toast";
import NextThemeProvider from "@/providers/NextThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "SpiceBook — Recipe Sharing Platform",
  description: "SpiceBook is a recipe sharing platform where users can share and discover delicious recipes from around the world. Join our community and explore a variety of culinary delights!",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.className} ${geistSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">

        <NextThemeProvider>
          <header className="sticky top-0 z-50">
            <NavBar />
          </header>
          <main className="min-h-screen bg-background text-foreground flex-1">
            {children}
          </main>
          <Footer />
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 2000,
            }}
          />
        </NextThemeProvider>

      </body>
    </html>
  );
}
