// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import SideNav from "../components/SideNav";
import { notoSansKr } from "./fonts";
import ClientWrapper from "./ClientWrapper";// 👈 클라이언트 전용 영역 감싸는 컴포넌트

export const metadata: Metadata = {
  title: "Orchedule",
  description: "Generated by create next app",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className={`${notoSansKr.className} min-h-screen `} cz-shortcut-listen="true">
        <div className="flex flex-col md:flex-row min-h-screen">
          <div className="hidden md:block">
            <SideNav />
          </div>
          <ClientWrapper>{children}</ClientWrapper>
        </div>
      </body>
    </html>
  );
}
