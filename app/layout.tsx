import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Providers } from "./providers";


// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: "🗄️Drofyl",
  description: "Store on the Cloud ☁️",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>

    <html lang="en">
      <body
        // className={`${geistSans.variable} ${geistMono.variable} antialiased w-[100vw] h-[100vh]`}
        className={` antialiased w-[100vw] h-[100vh]`}
        >
          <Providers>
            {children}
          </Providers>
      </body>
    </html>
    </ClerkProvider>
  );
}
