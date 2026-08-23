import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://sakuraretreat.vn"),
  title: {
    default: "SĀKURĀ RETREAT | Private Botanical Skin & Body Retreat",
    template: "%s | SĀKURĀ RETREAT",
  },
  description:
    "Rời nhịp phố và bước vào một khoảng riêng tại SĀKURĀ — Private Botanical Skin & Body Retreat trong villa phủ xanh giữa Trung Sơn, Hồ Chí Minh.",
  keywords: [
    "SĀKURĀ RETREAT",
    "chăm sóc da Trung Sơn",
    "chăm sóc cơ thể Trung Sơn",
    "private retreat Hồ Chí Minh",
    "facial retreat",
    "body retreat",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "https://sakuraretreat.vn",
    siteName: "SĀKURĀ RETREAT",
    title: "SĀKURĀ RETREAT — The Signature Private Retreat",
    description: "Rời nhịp phố. Bước vào một khoảng riêng. Khám phá Facial & Body Retreat và đặt lịch trực tiếp cùng SĀKURĀ Concierge.",
    images: [
      {
        url: "/og-sakura-retreat.jpg",
        width: 1200,
        height: 630,
        alt: "SĀKURĀ RETREAT — The Signature Private Retreat",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SĀKURĀ RETREAT — The Signature Private Retreat",
    description: "Rời nhịp phố. Bước vào một khoảng riêng tại Private Botanical Skin & Body Retreat ở Trung Sơn, Hồ Chí Minh.",
    images: ["/og-sakura-retreat.jpg"],
  },
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#283722",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
