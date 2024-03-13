import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { API_KEY } from "@/utils/constants";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Drizzle",
  description: "A to the point weather app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  if (!API_KEY || API_KEY === "") {
    return (
      <div
        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
        role="alert"
      >
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline">
          API Key is missing which needs to be set first
        </span>
      </div>
    );
  }
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
