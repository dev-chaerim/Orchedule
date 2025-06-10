"use client";

import { useState } from "react";
import type { Comment } from "@/src/lib/types/sheet";
import { X } from "lucide-react";
import ConfirmModal from "../modals/ConfirmModal";
import Image from "next/image";

interface CommentsProps {
  resourceId: string;
  resourceType: string;
  initialComments: Comment[];
  currentUserId?: string;
  currentUserName?: string;
}

export default function Comments({
  resourceId,
  resourceType,
  initialComments,
  currentUserId,
  currentUserName,
}: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    if (!currentUserId || !currentUserName) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      const res = await fetch(`/api/${resourceType}s/${resourceId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "addComment",
          authorId: currentUserId,
          authorName: currentUserName,
          content: newComment.trim(),
        }),
      });

      if (!res.ok) throw new Error("댓글 등록 실패");

      const added: Comment = await res.json();

      setComments((prev) => [...prev, added]);
      setNewComment("");
    } catch (err) {
      console.error(err);
      alert("댓글 등록 중 오류가 발생했습니다.");
    }
  };

  const handleDeleteComment = async () => {
    if (!commentToDelete) return;

    try {
      const res = await fetch(`/api/${resourceType}s/${resourceId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "deleteComment",
          commentId: commentToDelete,
        }),
      });

      if (!res.ok) throw new Error("댓글 삭제 실패");

      setComments((prev) =>
        prev.filter((comment) => comment._id !== commentToDelete)
      );

      setShowConfirm(false);
      setCommentToDelete(null);
    } catch (err) {
      console.error(err);
      alert("댓글 삭제 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="space-y-4 mt-6">
      <h3 className="text-sm font-semibold text-[#3E3232]">댓글</h3>

      {/* 댓글 작성 폼 */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="댓글을 입력하세요"
          className="flex-1 bg-white border border-[#D5CAC3] rounded-md px-3 py-2 text-sm"
        />
        <button
          onClick={handleAddComment}
          className="bg-[#7E6363] text-white px-4 py-2 rounded-md text-sm hover:bg-[#5c4f4f]"
        >
          등록
        </button>
      </div>

      {/* 댓글 리스트 */}
      <div className="space-y-2">
        {comments.length === 0 && (
          <p className="text-sm text-[#7e6a5c] text-center py-6 border border-[#e0dada] rounded-md">
            아직 작성된 댓글이 없어요. 첫 댓글을 남겨보세요!
          </p>
        )}
        {comments.map((comment) => (
          <div
            key={comment._id}
            className="flex gap-3 items-start bg-white border border-[#e0dada] rounded-md px-4 py-3 text-sm text-gray-700 relative"
          >
            {/* 유저 아이콘 */}
            <Image
              src="/icons/userIcon.svg"
              alt="프로필 아이콘"
              width={32}
              height={32}
              className="rounded-full mt-1"
            />

            <div className="flex-1 space-y-1">
              {/* 이름 */}
              <div className="font-semibold text-[#3E3232]">
                {comment.authorName}
              </div>

              {/* 내용 */}
              <div className="whitespace-pre-line">{comment.content}</div>

              {/* 날짜 */}
              <div className="text-xs text-gray-400 mt-1">
                {new Date(comment.createdAt).toLocaleDateString("ko-KR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </div>

            {/* 삭제 버튼 (오른쪽 상단) */}
            {comment.authorId === currentUserId && (
              <button
                onClick={() => {
                  setCommentToDelete(comment._id);
                  setShowConfirm(true);
                }}
                className="absolute top-2 right-2 w-5 h-5 flex items-center justify-center text-[#9c8f87] hover:text-[#7E6363]"
                title="삭제"
              >
                <X size={16} strokeWidth={1.5} />
              </button>
            )}
          </div>
        ))}
      </div>
      <ConfirmModal
        open={showConfirm}
        message="정말 이 댓글을 삭제하시겠습니까?"
        onConfirm={handleDeleteComment}
        onCancel={() => {
          setShowConfirm(false);
          setCommentToDelete(null);
        }}
      />
    </div>
  );
}
