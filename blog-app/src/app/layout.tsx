import type { Metadata, Viewport } from "next";
import { JetBrains_Mono } from "next/font/google";
import "pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css";
import "./globals.css";
import { BASE_PATH, BASE_URL } from "@/constants/config";
import { PwaBootstrap } from "@/components/pwa/PwaBootstrap";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  applicationName: "Inside React Study",
  manifest: `${BASE_PATH}/manifest.webmanifest`,
  title: {
    default: "Inside React Study — 다시 깊게 익히는 인사이드 리액트 북스터디",
    template: "%s | Inside React Study",
  },
  description:
    "React의 내부 동작 원리를 구조 중심으로 이해하는 스터디 아카이브. 주차별 요약(Summary), 토론 질문(Questions), 확장 인사이트(Insights)를 함께 모았습니다.",
  keywords: [
    "React",
    "인사이드 리액트",
    "리액트 스터디",
    "리액트 내부 동작",
    "Fiber",
    "리액트 렌더링",
    "프론트엔드 스터디",
    "북스터디",
  ],
  authors: [{ name: "Inside React Study Group" }],
  creator: "Inside React Study Group",
  appleWebApp: {
    capable: true,
    title: "Inside React Study",
    statusBarStyle: "black-translucent",
  },
  icons: {
    apple: [
      {
        url: `${BASE_PATH}/apple-touch-icon.png`,
        sizes: "180x180",
        type: "image/png",
      },
    ],
    icon: [
      { url: `${BASE_PATH}/favicon.ico` },
      {
        url: `${BASE_PATH}/pwa-192x192.png`,
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: `${BASE_PATH}/pwa-512x512.png`,
        sizes: "512x512",
        type: "image/png",
      },
    ],
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: BASE_URL,
    siteName: "Inside React Study",
    title: "Inside React Study — 다시 깊게 익히는 인사이드 리액트 북스터디",
    description:
      "React의 내부 동작 원리를 구조 중심으로 이해하는 스터디 아카이브. 주차별 요약, 질문, 인사이트를 모았습니다.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Inside React Study",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Inside React Study",
    description:
      "React의 내부 동작 원리를 구조 중심으로 이해하는 스터디 아카이브.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0a0e1a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={jetbrainsMono.variable}>
      <head>
        {/* JSON-LD: WebSite 구조화 데이터 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Inside React Study",
              url: BASE_URL,
              description:
                "React의 내부 동작 원리를 구조 중심으로 이해하는 스터디 아카이브",
              inLanguage: "ko-KR",
            }),
          }}
        />
      </head>
      <body>
        <PwaBootstrap />
        {children}
      </body>
    </html>
  );
}
