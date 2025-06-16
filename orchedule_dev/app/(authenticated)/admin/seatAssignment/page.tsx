"use client";

import { useEffect, useState } from "react";
import { useSeasonStore } from "@/lib/store/season";
import { orderedParts, partLabels } from "@/constants/parts";
import ConfirmModal from "@/components/modals/ConfirmModal";
import AlertModal from "@/components/modals/AlertModal";

interface Member {
  _id: string;
  name: string;
  part: string;
}

interface SeatAssignment {
  _id?: string;
  memberId:
    | {
        _id: string;
        name: string;
        part: string;
      }
    | string; // populate 안 된 경우 대비
  seatNumber?: number;
  seatSide?: "left" | "right";
}

export default function AdminSeatAssignmentsPage() {
  const { selectedSeason } = useSeasonStore();
  const seasonId = selectedSeason?._id;

  const [members, setMembers] = useState<Member[]>([]);
  const [assignments, setAssignments] = useState<
    Record<string, SeatAssignment>
  >({});
  const [duplicateAssignments, setDuplicateAssignments] = useState<
    Record<string, boolean>
  >({});
  const [isLoading, setIsLoading] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  // 시즌 멤버 가져오기
  useEffect(() => {
    if (!seasonId) return;

    const fetchSeasonMembers = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/seasons/${seasonId}`);
        const data = await res.json();
        setMembers(data.members || []);
      } catch (error) {
        console.error("시즌 멤버 불러오기 오류:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSeasonMembers();
  }, [seasonId]);

  // seat-assignments 가져오기
  useEffect(() => {
    if (!seasonId) return;

    const fetchAssignments = async () => {
      try {
        const res = await fetch(`/api/seat-assignments?seasonId=${seasonId}`);
        const data = await res.json();
        const seatMap: Record<string, SeatAssignment> = {};

        data.forEach((s: SeatAssignment) => {
          const memberIdObj =
            typeof s.memberId === "string" ? { _id: s.memberId } : s.memberId;

          seatMap[memberIdObj._id] = {
            _id: s._id,
            memberId: memberIdObj._id,
            seatNumber: s.seatNumber,
            seatSide: s.seatSide,
          };
        });

        setAssignments(seatMap);
      } catch (error) {
        console.error("seat-assignments 가져오기 오류:", error);
      }
    };

    fetchAssignments();
  }, [seasonId]);

  // 중복 검사
  const checkForDuplicates = (
    memberId: string,
    seatNumber?: number,
    seatSide?: "left" | "right"
  ) => {
    const memberPart = members.find((m) => m._id === memberId)?.part;
    if (!memberPart) return;

    const isDuplicate = Object.entries(assignments).some(
      ([otherMemberId, otherAssignment]) => {
        if (otherMemberId === memberId) return false;

        const otherMemberPart = members.find(
          (m) => m._id === otherMemberId
        )?.part;
        if (otherMemberPart !== memberPart) return false; // 👈 파트 다르면 제외

        return (
          otherAssignment.seatNumber === seatNumber &&
          otherAssignment.seatSide === seatSide
        );
      }
    );

    setDuplicateAssignments((prev) => ({
      ...prev,
      [memberId]: isDuplicate,
    }));
  };

  const handlePreCheck = () => {
    const updatedAssignments = Object.values(assignments);

    for (const assignment of updatedAssignments) {
      const hasSide = assignment.seatSide != null;
      const hasNumber =
        assignment.seatNumber != null && !Number.isNaN(assignment.seatNumber);

      if (hasSide && !hasNumber) {
        setAlertMessage("풀트와 좌/우는\n둘 다 입력해야 저장할 수 있습니다.");

        return;
      }
      if (hasNumber && !hasSide) {
        setAlertMessage("풀트와 좌/우는\n둘 다 입력해야 저장할 수 있습니다.");

        return;
      }
    }

    // 유효성 통과 시 확인 모달 띄움
    setShowConfirmModal(true);
  };

  const handleSaveAll = async () => {
    if (!seasonId) return;

    try {
      const updatedAssignments = Object.values(assignments);

      await Promise.all(
        updatedAssignments.map((assignment) => {
          // PATCH
          if (assignment._id && assignment._id.length === 24) {
            return fetch(`/api/seat-assignments/${assignment._id}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                seatNumber: assignment.seatNumber ?? 1,
                seatSide: assignment.seatSide ?? "left",
              }),
            });
          }

          // POST (유효성 검사는 이미 통과했으므로 바로 저장)
          if (
            assignment.seatNumber != null &&
            !Number.isNaN(assignment.seatNumber) &&
            assignment.seatSide != null &&
            typeof assignment.memberId !== "undefined"
          ) {
            return fetch(`/api/seat-assignments`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                seasonId,
                memberId:
                  typeof assignment.memberId === "string"
                    ? assignment.memberId
                    : "_id" in assignment.memberId
                    ? assignment.memberId._id
                    : "",
                seatNumber: assignment.seatNumber,
                seatSide: assignment.seatSide,
              }),
            });
          }

          // 저장 대상 아님 → resolve 처리
          return Promise.resolve();
        })
      );

      setIsDirty(false);
    } catch (error) {
      console.error("자리배치 저장 오류:", error);
      throw error; // ConfirmModal에서 catch 후 토스트 띄우기 위해
    }
  };

  const handleSeatNumberChange = (
    memberId: string,
    value: string,
    currentSeatSide?: "left" | "right"
  ) => {
    if (value === "") {
      setAssignments((prev) => ({
        ...prev,
        [memberId]: {
          ...prev[memberId],
          memberId,
          seatNumber: undefined,
          seatSide: prev[memberId]?.seatSide,
        },
      }));
      checkForDuplicates(memberId, undefined, currentSeatSide);
      setIsDirty(true);
      return;
    }

    const newSeatNumber = parseInt(value, 10);
    if (isNaN(newSeatNumber) || newSeatNumber < 1 || newSeatNumber > 20) return;

    setAssignments((prev) => ({
      ...prev,
      [memberId]: {
        ...prev[memberId],
        memberId,
        seatNumber: newSeatNumber,
        seatSide: prev[memberId]?.seatSide,
      },
    }));
    checkForDuplicates(memberId, newSeatNumber, currentSeatSide);
    setIsDirty(true);
  };

  const handleSeatSideChange = (
    memberId: string,
    selectedSide: "left" | "right",
    currentSeatNumber?: number,
    currentSeatSide?: "left" | "right"
  ) => {
    const newSeatSide =
      currentSeatSide === selectedSide ? undefined : selectedSide;

    setAssignments((prev) => ({
      ...prev,
      [memberId]: {
        ...prev[memberId],
        seatSide: newSeatSide,
      },
    }));

    checkForDuplicates(memberId, currentSeatNumber, newSeatSide);
    setIsDirty(true);
  };

  return (
    <div className="p-6">
      <h2 className="text-lg font-bold mb-6 text-[#3e3232]">자리배치 관리</h2>
      <div className="flex justify-end pt-4">
        <button
          onClick={handlePreCheck}
          disabled={!isDirty}
          className={`text-sm px-6 py-2 rounded transition font-medium ${
            isDirty
              ? "bg-[#EEE4DA] text-[#3E3232] hover:bg-[#E3D7CC]"
              : "bg-[#E0DBD6] text-[#A79C90] cursor-not-allowed"
          }`}
        >
          저장
        </button>
      </div>

      {isLoading ? (
        <div className="text-center text-[#a79c90] text-sm py-6">
          ⏳ 멤버 정보를 불러오는 중이에요...
        </div>
      ) : (
        orderedParts.map((part) => {
          const partMembers = members.filter((m) => m.part === part);
          if (partMembers.length === 0) return null;

          return (
            <div key={part} className="mb-8">
              <h3 className="text-base font-bold flex items-center gap-2 mb-2">
                🎻 {partLabels[part]}
              </h3>

              <table className="w-full table-auto border border-[#e0dada] bg-white text-sm mb-4">
                <thead className="bg-[#f9f7f5] text-[#7e6a5c]">
                  <tr>
                    <th className="border border-[#e0dada] px-3 py-2 text-left">
                      이름
                    </th>
                    <th className="border border-[#e0dada] px-3 py-2 text-left">
                      풀트
                    </th>
                    <th className="border border-[#e0dada] px-3 py-2 text-left">
                      좌/우
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {partMembers.map((member) => {
                    const assignment = assignments[member._id] ?? {
                      memberId: member._id,
                      seatNumber: undefined,
                      seatSide: undefined,
                    };

                    return (
                      <tr
                        key={member._id}
                        className="border-t border-[#e0dada]"
                      >
                        <td className="px-3 py-2">{member.name}</td>
                        <td className="px-3 py-2">
                          <input
                            type="number"
                            min="1"
                            max="20"
                            value={assignment?.seatNumber ?? ""}
                            onChange={(e) =>
                              handleSeatNumberChange(
                                member._id,
                                e.target.value,
                                assignment.seatSide
                              )
                            }
                            className="w-16 border border-[#ccc] rounded px-2 py-1 text-right"
                          />
                          {duplicateAssignments[member._id] && (
                            <div className="text-xs text-red-500 mt-1">
                              이미 동일한 좌석 번호 + 좌/우가 존재합니다.
                            </div>
                          )}
                        </td>
                        <td className="px-3 py-2">
                          <div className="flex items-center gap-3">
                            {(["left", "right"] as const).map((side) => (
                              <label
                                key={side}
                                className="flex items-center gap-1 text-xs cursor-pointer"
                              >
                                <input
                                  type="checkbox"
                                  checked={assignment?.seatSide === side}
                                  onChange={() =>
                                    handleSeatSideChange(
                                      member._id,
                                      side,
                                      assignment.seatNumber,
                                      assignment.seatSide
                                    )
                                  }
                                />
                                {side === "left" ? "In (Left)" : "Out (Right)"}
                              </label>
                            ))}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          );
        })
      )}
      {alertMessage && (
        <AlertModal
          message={alertMessage}
          onClose={() => setAlertMessage("")}
        />
      )}
      <ConfirmModal
        open={showConfirmModal}
        message="변경사항을 저장할까요?"
        onConfirm={handleSaveAll}
        onCancel={() => setShowConfirmModal(false)}
        confirmLabel="저장"
        cancelLabel="취소"
        successMessage="자리배치가 저장되었습니다."
        errorMessage="자리배치 저장 실패!"
      />
    </div>
  );
}
