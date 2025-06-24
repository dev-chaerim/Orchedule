import "@/styles/globals.css";
import { notoSansKr } from "../src/lib/fonts";
import Toast from "@/components/common/Toast";
import ClientWrapper from "./ClientWrapper";

// ✅ 여기에 metadata 설정 추가
export const metadata = {
  title: "Orchedule",
  description: "오케스트라 연습 도우미 앱",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png",
  },
  appleWebApp: {
    title: "Orchedule",
    capable: true,
    statusBarStyle: "default",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
      </head>
      <body className={`bg-[#FAF9F6] ${notoSansKr.className}`}>
        <Toast />
        <ClientWrapper>{children}</ClientWrapper>
      </body>
    </html>
  );
}
