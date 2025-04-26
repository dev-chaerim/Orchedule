import "../../styles/globals.css";
import { notoSansKr } from "../(authenticated)/fonts";

export default function JoinLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body
        className={`bg-blue-50 ${notoSansKr.className}`}
        cz-shortcut-listen="true"
      >
        {children}
      </body>
    </html>
  );
}
