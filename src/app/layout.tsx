import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/common/components/layout/Navbar";
import { Footer } from "@/common/components/layout/Footer";
import { ThemeProvider } from "@/common/components/providers/ThemeProvider";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Anuvrat Joshi | Senior Full Stack Developer",
  description:
    "Senior Full Stack Developer with 3+ years of MERN stack expertise. Specializing in scalable APIs, AI-enhanced workflows, and high-performance web applications.",
  keywords: [
    "Anuvrat Joshi",
    "Full Stack Developer",
    "MERN Stack",
    "React Developer",
    "Node.js",
    "Next.js",
    "TypeScript",
    "Senior Developer",
    "Ahmedabad",
  ],
  authors: [{ name: "Anuvrat Joshi", url: "https://github.com/Anuvratjoshi" }],
  openGraph: {
    type: "website",
    title: "Anuvrat Joshi | Senior Full Stack Developer",
    description:
      "Senior Full Stack Developer specializing in MERN stack, scalable architecture, and AI-assisted development.",
    siteName: "Anuvrat Joshi Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Anuvrat Joshi | Senior Full Stack Developer",
    description:
      "Senior Full Stack Developer specializing in MERN stack, scalable architecture, and AI-assisted development.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
        <ThemeProvider>
          <Navbar />
          <div className="flex-1">{children}</div>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
