import "@/styles/globals.css";
import { cal, inter } from "@/styles/fonts";
import { Analytics } from "@vercel/analytics/react";
import { Metadata } from "next";
import { cn } from "@/lib/utils";

export const runtime = 'edge'

const title =
  "Machine Platform";
const description =
  "Modernization Platform - AI guided and built for multitenancy";
const image = "https://res.cloudinary.com/stratmachine/image/upload/v1592332341/machine/icon-48x48_kyouet.png";

export const metadata: Metadata = {
  title,
  description,
  icons: ["https://res.cloudinary.com/stratmachine/image/upload/v1690559826/machine/favicon.ico"],
  openGraph: {
    title,
    description,
    images: [image],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [image],
    creator: "@urban_coder",
  },
  metadataBase: new URL("https://strategicmachines.dev"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={cn('bg-black text-white', cal.variable, inter.variable)}>
       
          {children}
          <Analytics />
      
      </body>
    </html>
  );
}
