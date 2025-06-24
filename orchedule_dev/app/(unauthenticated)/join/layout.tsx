import "@/styles/globals.css";
import { notoSansKr } from "@/src/lib/fonts";

export default function JoinLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`bg-[#FAF9F6] ${notoSansKr.className}`}
      cz-shortcut-listen="true"
    >
      {children}
    </div>
  );
}
