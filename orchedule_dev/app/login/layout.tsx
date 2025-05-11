import "../../styles/globals.css";
import { notoSansKr } from "../(authenticated)/fonts";

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className={` ${notoSansKr.className}`}>{children}</div>;
}
