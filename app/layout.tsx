import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://sakuraretreat.vn"),
  title: {
    default: "SĀKURĀ RETREAT | Private Botanical Skin & Body Retreat",
    template: "%s | SĀKURĀ RETREAT",
  },
  description:
    "SĀKURĀ Retreat tại villa phủ xanh giữa Trung Sơn – Him Lam. Signature Welcome cho khách lần đầu: Body 399K, Face 599K hoặc Face & Body 999K trong không gian riêng.",
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
    description: "Ba Signature Welcome cho khách lần đầu tại SĀKURĀ: Body 399K, Face 599K hoặc Face & Body 999K trong không gian riêng.",
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
    description: "Signature Welcome tại SĀKURĀ Retreat: Body 399K, Face 599K hoặc Face & Body 999K dành cho khách lần đầu trải nghiệm.",
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
  viewportFit: "cover",
  themeColor: "#283722",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
