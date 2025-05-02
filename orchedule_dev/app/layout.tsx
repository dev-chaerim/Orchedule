export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body cz-shortcut-listen="true">{children}</body>
    </html>
  );
}
