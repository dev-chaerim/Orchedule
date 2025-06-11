"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import BackButton from "@/components/BackButton";
import { useUserStore } from "@/lib/store/user";
import ConfirmModal from "@/components/modals/ConfirmModal";
import ActionButtons from "@/components/common/ActionButtons";
import ImagePreview from "@/components/common/ImagePreview";
import type { Sheet } from "@/src/lib/types/sheet";
import LinkifiedContent from "@/components/common/LinkifiedContent";

export default function ScoreCheckDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const user = useUserStore((state) => state.user);

  const [sheet, setSheet] = useState<Sheet | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const fetchSheet = async () => {
      try {
        const res = await fetch(`/api/score-checks/${id}`);
        if (!res.ok) throw new Error("악보를 찾을 수 없습니다.");
        const data = await res.json();
        console.log("sheet data", data);
        setSheet(data);
      } catch (err) {
        console.error(err);
        router.push("/menu/sheetmusic/bowing");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchSheet();
  }, [id, router]);

  const handleDelete = async () => {
    const res = await fetch(`/api/score-checks/${sheet?._id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("삭제 실패");
    router.push("/menu/sheetmusic/bowing");
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

  const pdfFiles = sheet.attachments.filter(
    (file) => file.type === "application/pdf"
  );
  const imageFiles = sheet.attachments.filter((file) =>
    file.type?.startsWith("image/")
  );

  const getFileNameFromUrl = (url: string) => {
    try {
      const decodedUrl = decodeURIComponent(url);
      const parts = decodedUrl.split("/");
      const last = parts[parts.length - 1]; // v숫자-파일명.확장자

      // "v숫자-" 제거
      const dashIndex = last.indexOf("-");
      if (dashIndex !== -1) {
        return last.substring(dashIndex + 1);
      }
      return last;
    } catch {
      return "파일명 없음";
    }
  };

  return (
    <div className="space-y-4 px-4 max-w-3xl mx-auto -mt-2">
      {/* 상단: 목록 버튼 + 수정/삭제 */}
      <div className="flex justify-between items-center">
        <BackButton fallbackHref="/menu/sheetmusic/bowing" label="목록" />

        {user?.name === sheet.author && (
          <ActionButtons
            onEdit={() =>
              router.push(`/menu/sheetmusic/bowing/${sheet._id}/edit`)
            }
            onDelete={() => setShowDeleteConfirm(true)}
          />
        )}
      </div>
      <h2 className="text-lg font-bold text-[#3E3232] leading-snug mt-1 pb-1">
        {sheet.title}
      </h2>

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
        <LinkifiedContent text={sheet.content} />

        {/* 이미지 프리뷰 */}
        {imageFiles.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            {imageFiles.map((file, idx) => (
              <ImagePreview key={idx} src={file.url} onDelete={undefined} />
            ))}
          </div>
        )}

        {/* PDF 다운로드 박스 */}
        {pdfFiles.length > 0 && (
          <div>
            <span className="block text-sm font-semibold text-[#3E3232] mb-3">
              첨부파일
            </span>
            <div className="space-y-4">
              {pdfFiles.map((file, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between border border-[#e0dada] rounded-lg p-3 bg-[#fcfbf9]"
                >
                  <div>
                    <div className="text-sm text-[#3E3232] mt-1">
                      📃 {getFileNameFromUrl(file.url)}
                    </div>
                  </div>

                  <a
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 border border-gray-300 rounded-md hover:bg-gray-100"
                    title="다운로드"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.6A1 1 0 0 0 2.5 14h11a1 1 0 0 0 1-1v-2.6a.5.5 0 0 1 1 0v2.6A2 2 0 0 1 13.5 15h-11A2 2 0 0 1 .5 13v-2.6a.5.5 0 0 1 .5-.5z" />
                      <path d="M7.646 10.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 1 0-.708-.708L8.5 9.293V1.5a.5.5 0 0 0-1 0v7.793L5.354 7.146a.5.5 0 1 0-.708.708l3 3z" />
                    </svg>
                  </a>
                </div>
              ))}
            </div>
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
