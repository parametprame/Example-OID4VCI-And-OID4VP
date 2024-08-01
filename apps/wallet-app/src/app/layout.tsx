import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SessionWrapper from "@/components/SessionWrapper";
import LayoutWrapper from "@/components/LayoutWrapper";
import ReactQueryProvider from "@/utils/ReactQueryProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Digital Wallet",
  description: "Demo: receive and verify vc",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionWrapper>
          <ReactQueryProvider>
            <LayoutWrapper>{children}</LayoutWrapper>
          </ReactQueryProvider>
        </SessionWrapper>
      </body>
    </html>
  );
}
