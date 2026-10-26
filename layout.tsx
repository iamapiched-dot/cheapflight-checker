import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "CheapFlight Checker",
  description: "Compare flight prices and find lower-cost trips.",
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="th"><body>{children}</body></html>;
}
