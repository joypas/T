import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "덕스클럽",
  description: "매장 QR 한 번이면, 휴대폰이 가챠머신이 된다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${inter.className} max-w-md mx-auto bg-gray-100 min-h-screen shadow-2xl relative overflow-x-hidden`}>
        {children}
      </body>
    </html>
  );
}
