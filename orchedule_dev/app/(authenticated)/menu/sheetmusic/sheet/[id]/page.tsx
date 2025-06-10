"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import BackButton from "@/components/BackButton";
import { useUserStore } from "@/lib/store/user";
import ConfirmModal from "@/components/modals/ConfirmModal";
import Linkify from "linkify-react";
import ActionButtons from "@/components/common/ActionButtons";
import PDFPreview from "@/components/common/PDFPreview";
import ImagePreview from "@/components/common/ImagePreview";
import type { AttachmentInput } from "@/src/lib/types/sheet";

interface Sheet {
  _id: string;
  title: string;
  date: string;
  author: string;
  content: string;
  attachments: AttachmentInput[];
  parts: string[];
}

export default function SeasonSheetDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const user = useUserStore((state) => state.user);

  const [sheet, setSheet] = useState<Sheet | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const fetchSheet = async () => {
      try {
        const res = await fetch(`/api/season-scores/${id}`);
        if (!res.ok) throw new Error("악보를 찾을 수 없습니다.");
        const data = await res.json();
        console.log("sheet data", data);
        setSheet(data);
      } catch (err) {
        console.error(err);
        router.push("/menu/sheetmusic/sheet");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchSheet();
  }, [id, router]);

  const handleDelete = async () => {
    const res = await fetch(`/api/season-scores/${sheet?._id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("삭제 실패");
    router.push("/menu/sheetmusic/sheet");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[300px] text-[#a79c90] text-sm">
        ⏳ 악보를 불러오는 중이에요...
      </div>
    );
  }

  if (!sheet) {
    return (
      <div className="text-center text-sm text-gray-500">
        악보를 찾을 수 없습니다.
      </div>
    );
  }

  const dateObj = new Date(sheet.date);

  const pdfAttachment = sheet.attachments.find(
    (file) => file.type === "application/pdf"
  );

  const linkifyOptions = {
    target: "_blank",
    rel: "noopener noreferrer",
    className: "text-blue-600 hover:underline break-words",
  };

  return (
    <div className="space-y-4 px-4 max-w-3xl mx-auto -mt-2">
      {/* 상단: 목록 버튼 + 수정/삭제 */}
      <div className="flex justify-between items-center">
        <BackButton fallbackHref="/menu/sheetmusic/sheet" label="목록" />

        {user?.name === sheet.author && (
          <ActionButtons
            onEdit={() =>
              router.push(`/menu/sheetmusic/sheet/${sheet._id}/edit`)
            }
            onDelete={() => setShowDeleteConfirm(true)}
          />
        )}
      </div>

      {/* 제목 + 날짜 + 작성자 */}
      <div className="text-xs text-gray-400 flex items-center gap-2 ml-2">
        <span>
          {dateObj.toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
        <span>
          {dateObj.toLocaleTimeString("ko-KR", {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          })}
        </span>
        <span className="text-gray-400">·</span>
        <span>{sheet.author}</span>
      </div>

      {/* 본문 영역 */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4 -mt-1">
        <Linkify options={linkifyOptions}>
          <div className="whitespace-pre-line text-sm text-gray-700">
            {sheet.content || "파트보를 확인해주세요."}
          </div>
        </Linkify>

        {/* PDF 다운로드 버튼 */}
        {pdfAttachment && (
          <a
            href={pdfAttachment.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 bg-[#7E6363] text-white text-sm px-4 py-2 rounded-md hover:bg-[#5c4f4f] transition"
          >
            <span>📄</span> 악보 다운로드
          </a>
        )}

        {/* 첨부 파일 프리뷰 */}
        {sheet.attachments.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            {sheet.attachments.map((file, idx) =>
              file.type === "application/pdf" ? (
                <PDFPreview
                  key={idx}
                  publicId={file.publicId}
                  pdfUrl={file.url}
                  pageCount={file.pageCount ?? 1}
                  onDelete={undefined}
                />
              ) : (
                <ImagePreview key={idx} src={file.url} onDelete={undefined} />
              )
            )}
          </div>
        )}
      </div>

      {/* 파트 태그 */}
      {sheet.parts && sheet.parts.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4 ml-1">
          {sheet.parts.map((part, idx) => (
            <span
              key={idx}
              className="text-xs text-[#7e6a5c] bg-[#f4ece7] px-2 py-1 rounded-full"
            >
              #{part}
            </span>
          ))}
        </div>
      )}

      {/* 삭제 확인 모달 */}
      <ConfirmModal
        open={showDeleteConfirm}
        onCancel={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        message="정말 삭제하시겠습니까?"
        confirmLabel="삭제"
        confirmColor="red"
        successMessage="삭제되었습니다."
        errorMessage="삭제 중 오류가 발생했습니다."
      />
    </div>
  );
}
