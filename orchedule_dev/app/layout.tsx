import "../styles/globals.css";
import { notoSansKr } from "./(authenticated)/fonts";
import Toast from "@/components/Toast";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body
        cz-shortcut-listen="true"
        className={`bg-[#FAF9F6] ${notoSansKr.className}`}
      >
        <Toast />
        {children}
      </body>
    </html>
  );
}
