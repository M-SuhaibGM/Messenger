import type { Metadata } from "next";
import "./globals.css";
import SessionWrapper from "../components/ui/SessionWrapper"
import ToastaerContext from "@/context/ToastaerContext";
import ActiveStatus from "@/components/ui/ActiveStatus";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body >
        <SessionWrapper>
          <ToastaerContext />
          <ActiveStatus/>
          {children}
        </SessionWrapper>
      </body>
    </html>
  );
}
