// app/reset-password/page.tsx
import { Suspense } from "react";
import ResetPasswordPageContent from "./ResetPasswordPageContent";

export default function Page() {
  return (
    <Suspense fallback={<div className="text-center mt-20">로딩 중...</div>}>
      <ResetPasswordPageContent />
    </Suspense>
  );
}
