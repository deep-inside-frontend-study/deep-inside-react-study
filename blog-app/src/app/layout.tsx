import type { Metadata } from "next";
import "./globals.css";

// GitHub Pages 배포 시 GITHUB_REPO_NAME 환경변수로 실제 URL이 결정됩니다.
// 로컬 개발 환경에서는 localhost를 사용합니다.
const REPO_NAME = process.env.GITHUB_REPO_NAME ?? "";
const BASE_URL = REPO_NAME
  ? `https://[YOUR_GITHUB_ID].github.io/${REPO_NAME}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
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
      <body>{children}</body>
    </html>
  );
}
