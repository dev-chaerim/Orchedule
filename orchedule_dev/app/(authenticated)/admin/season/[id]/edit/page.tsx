"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams, notFound } from "next/navigation";
import BackButton from "@/components/ui/BackButton";
import LoadingText from "@/components/common/LoadingText";
import Select from "react-select";

interface Member {
  _id: string;
  name: string;
  part: string;
}

interface Option {
  value: string;
  label: string;
}

interface Season {
  _id: string;
  name: string;
  startDate: string;
  endDate?: string;
  pieces: string[];
  members: Member[];
}

export default function SeasonEditPage() {
  const { id } = useParams();
  const router = useRouter();
  const [season, setSeason] = useState<Season | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [pieces, setPieces] = useState<string[]>([]);
  const [newPiece, setNewPiece] = useState("");

  const [allMembers, setAllMembers] = useState<Member[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<Option[]>([]);

  const SELECT_ALL_OPTION = { value: "__all__", label: "전체 선택" };

  const allMemberOptions = allMembers.map((m) => ({
    value: m._id,
    label: `${m.name} (${m.part})`,
  }));

  const optionsWithSelectAll = [SELECT_ALL_OPTION, ...allMemberOptions];

  // 시즌 데이터 불러오기
  useEffect(() => {
    if (!id) return;

    const fetchSeason = async () => {
      try {
        const res = await fetch(`/api/seasons/${id}`);
        if (!res.ok) throw new Error("시즌 정보를 불러오지 못했습니다.");
        const data = await res.json();
        setSeason(data);

        setName(data.name);
        setStartDate(data.startDate?.slice(0, 10));
        setEndDate(data.endDate ? data.endDate.slice(0, 10) : "");
        setPieces(data.pieces || []);

        const initialSelected = data.members.map((m: Member) => ({
          value: m._id,
          label: `${m.name} (${m.part})`,
        }));
        setSelectedMembers(initialSelected);
      } catch (error) {
        console.error("시즌 상세 정보 불러오기 실패:", error);
        notFound();
      } finally {
        setIsLoading(false);
      }
    };

    fetchSeason();
  }, [id]);

  // 전체 members 불러오기
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await fetch("/api/members");
        const data = await res.json();
        setAllMembers(data);
      } catch (error) {
        console.error("전체 members 불러오기 오류:", error);
      }
    };
    fetchMembers();
  }, []);

  // 시즌 수정 요청
  const handleSave = async () => {
    try {
      const res = await fetch(`/api/seasons/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          startDate,
          endDate: endDate || null,
          pieces,
          members: selectedMembers.map((m) => m.value),
        }),
      });

      if (!res.ok) throw new Error("시즌 수정 실패");

      router.push("/admin/season");
    } catch (error) {
      console.error("시즌 수정 오류:", error);
      alert("시즌 수정에 실패했습니다.");
    }
  };

  // 곡 추가
  const handleAddPiece = () => {
    if (newPiece.trim() !== "") {
      setPieces([...pieces, newPiece.trim()]);
      setNewPiece("");
    }
  };

  // 곡 삭제
  const handleRemovePiece = (index: number) => {
    const updatedPieces = [...pieces];
    updatedPieces.splice(index, 1);
    setPieces(updatedPieces);
  };

  // 참여 단원 MultiSelect 핸들링
  const handleChange = (selected: unknown) => {
    const selectedOptions = selected as Option[];

    const isSelectAllSelected = selectedOptions.some(
      (option) => option.value === SELECT_ALL_OPTION.value
    );

    if (isSelectAllSelected) {
      setSelectedMembers(allMemberOptions);
    } else {
      setSelectedMembers(selectedOptions);
    }
  };

  // Custom MultiValueContainer (드롭다운 안에 선택값 표시 안 함)
  const CustomMultiValueContainer = () => {
    return null;
  };

  // 로딩 중 표시
  if (isLoading) {
    return (
      <main className="max-w-3xl mx-auto p-6">
        <LoadingText message="시즌 정보를 불러오는 중이에요..." />
      </main>
    );
  }

  // 시즌이 없을 때 처리
  if (!season) return notFound();

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      <BackButton fallbackHref="/admin/season" label="목록" />

      <h1 className="text-xl font-bold text-[#3E3232] mb-4">시즌 수정</h1>

      {/* 전체 큰 박스 */}
      <div className="bg-white border border-[#E0D6CD] rounded-lg p-5 space-y-6">
        {/* 시즌명 / 날짜 */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#3E3232] mb-1">
              시즌명
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-[#3E3232] mb-1">
                시작일
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              />
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-[#3E3232] mb-1">
                종료일
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              />
            </div>
          </div>
        </div>

        {/* 등록된 곡 */}
        <div>
          <label className="block text-sm font-medium text-[#3E3232] mb-1">
            🎵 등록된 곡
          </label>

          {/* input은 아래쪽으로 배치 */}
          <div className="flex gap-2 mt-2">
            <input
              type="text"
              value={newPiece}
              onChange={(e) => setNewPiece(e.target.value)}
              className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
              placeholder="곡명을 입력하세요"
            />
            <button
              onClick={handleAddPiece}
              className="text-sm bg-[#F4ECE7] text-[#3E3232] px-4 py-2 rounded hover:bg-[#e3dcd7] transition"
            >
              추가
            </button>
          </div>
          <ul className="list-none text-sm text-gray-700 mt-3 ml-1">
            {pieces.map((piece, index) => (
              <li
                key={index}
                className="flex items-center justify-between py-1"
              >
                <div className="flex items-center gap-1">
                  <span className="text-[#645858] text-base">•</span>{" "}
                  {/* 원하는 아이콘 */}
                  <span>{piece}</span>
                </div>
                <button
                  onClick={() => handleRemovePiece(index)}
                  className="text-xs text-[#a67b7b] hover:text-[#7e6a6a] font-bold mr-2"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* 참여 단원 */}
        <div>
          <label className="block text-sm font-medium text-[#3E3232] mb-1">
            👥 참여 단원
          </label>
          <Select
            isMulti
            options={optionsWithSelectAll}
            value={selectedMembers}
            onChange={handleChange}
            placeholder="참여 단원을 선택하세요"
            className="text-sm"
            menuPortalTarget={
              typeof window !== "undefined" ? document.body : null
            }
            styles={{
              menuPortal: (base) => ({ ...base, zIndex: 9999 }),
              control: (provided, state) => ({
                ...provided,
                boxShadow: "none",
                borderColor: state.isFocused ? "#D5CAC3" : "#ccc",
              }),
            }}
            components={{
              MultiValueContainer: CustomMultiValueContainer,
            }}
          />
          <div className="mt-2 flex flex-wrap gap-2">
            {selectedMembers.map((member) => (
              <div
                key={member.value}
                className="flex items-center bg-[#F0F0F0] text-[#3E3232] px-2 py-1 rounded text-xs"
              >
                {member.label}
                <button
                  onClick={() =>
                    setSelectedMembers((prev) =>
                      prev.filter((m) => m.value !== member.value)
                    )
                  }
                  className="ml-1 text-[#a67b7b] hover:text-[#7e6a6a] font-bold"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 저장 버튼 */}
        <div className="flex justify-end pt-4">
          <button
            onClick={handleSave}
            className="text-sm bg-[#F4ECE7] text-[#3E3232] px-6 py-2 rounded hover:bg-[#e3dcd7] transition"
          >
            저장
          </button>
        </div>
      </div>
    </main>
  );
}
