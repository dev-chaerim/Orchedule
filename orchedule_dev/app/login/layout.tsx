import "../../styles/globals.css";
import { notoSansKr } from "../(authenticated)/fonts";

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className={`bg-blue-50 ${notoSansKr.className}`}>{children}</div>;
}
