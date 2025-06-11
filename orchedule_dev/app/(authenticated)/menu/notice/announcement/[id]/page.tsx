"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams, notFound } from "next/navigation";
import BackButton from "@/components/BackButton";
import ImagePreview from "@/components/common/ImagePreview";
import PDFPreview from "@/components/common/PDFPreview";
import ConfirmModal from "@/components/modals/ConfirmModal";
import { useUserStore } from "@/lib/store/user";
import LinkifiedContent from "@/components/common/LinkifiedContent";
import LoadingText from "@/components/common/LoadingText";
import ActionButtons from "@/components/common/ActionButtons";
import { isNew } from "@/src/lib/utils/isNew";
import NewBadge from "@/components/common/NewBadge";

interface Attachment {
  url: string;
  publicId: string;
  type: string; // e.g. "image/jpeg", "application/pdf"
  pageCount?: number;
}

interface Notice {
  _id: string;
  title: string;
  content: string;
  date: string;
  author: string;
  pinned: boolean;
  season: string;
  isGlobal: boolean;
  attachments?: Attachment[];
}

export default function NoticeDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const user = useUserStore((state) => state.user);

  const [notice, setNotice] = useState<Notice | null>(null);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const fetchNotice = async () => {
      try {
        const res = await fetch(`/api/notices/${id}`);
        if (!res.ok) throw new Error("공지 없음");
        const data = await res.json();
        setNotice(data);
      } catch (err) {
        console.error("공지 조회 실패:", err);
        router.replace("/menu/notice/announcement");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchNotice();
  }, [id, router]);

  const deleteNotice = async () => {
    const res = await fetch(`/api/notices/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("삭제 실패");
    router.replace("/admin/notice");
  };

  if (loading) {
    return <LoadingText message="공지를 불러오는 중이에요..." />;
  }

  if (!notice) return notFound();

  return (
    <div className="p-3 space-y-4">
      {/* 목록 + 수정/삭제 버튼 */}
      <div className="flex justify-between items-center">
        <BackButton fallbackHref="/menu/notice/announcement" label="목록" />

        {user?.role === "admin" && (
          <ActionButtons
            onEdit={() => router.push(`/admin/notice/${notice._id}/edit`)}
            onDelete={() => setShowConfirm(true)}
          />
        )}
      </div>

      {/* 공지 본문 영역 */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-3">
        <div className="flex items-center gap-2 mb-2">
          <h1 className="text-lg font-bold text-[#3E3232]">{notice.title}</h1>
          {isNew(notice.date) && <NewBadge size={16} fontSize={10} />}
        </div>

        <div className="text-sm text-gray-500">
          {notice.date} · {notice.author}
        </div>

        <LinkifiedContent text={notice.content} />

        {/* 첨부파일 프리뷰 */}
        {notice.attachments && notice.attachments.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {notice.attachments.map((file, i) =>
              file.type === "application/pdf" && file.pageCount ? (
                <PDFPreview
                  key={i}
                  publicId={file.publicId}
                  pageCount={file.pageCount}
                  pdfUrl={file.url} // ✅ S3 URL 넘기기
                />
              ) : (
                <ImagePreview key={i} src={file.url} />
              )
            )}
          </div>
        )}
      </div>

      {/* 확인 모달 */}
      <ConfirmModal
        open={showConfirm}
        onCancel={() => setShowConfirm(false)}
        onConfirm={deleteNotice}
        message="정말 이 공지를 삭제하시겠습니까?"
        confirmLabel="삭제"
        cancelLabel="취소"
        confirmColor="red"
        successMessage="삭제되었습니다."
        errorMessage="삭제 중 오류가 발생했습니다."
      />
    </div>
  );
}
