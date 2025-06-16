"use client";

import React, { useEffect, useState } from "react";
import { PartKey, orderedParts, partLabels } from "@/src/constants/parts";
import { useSeasonStore } from "@/lib/store/season"; // 시즌 전역 상태 가져오기

interface Member {
  _id: string;
  name: string;
  part: PartKey;
  email: string;
}

const MemberListPage = () => {
  const { selectedSeason } = useSeasonStore(); // ✅ 현재 선택된 시즌
  const seasonId = selectedSeason?._id;

  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!seasonId) return;

    const fetchSeasonMembers = async () => {
      try {
        const res = await fetch(`/api/seasons/${seasonId}/members`);
        if (!res.ok) throw new Error("서버 응답 실패");
        const data = await res.json();
        setMembers(data);
      } catch (err) {
        console.error("시즌 단원 데이터를 불러오지 못했습니다", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSeasonMembers();
  }, [seasonId]);

  return (
    <div className="px-4 pb-24 bg-[#FAF9F6]">
      <h1 className="text-lg font-bold text-[#3E3232] mb-4 px-1">단원 명단</h1>

      {loading ? (
        <div className="text-center text-[#a79c90] text-sm py-6">
          ⏳ 단원명단을 불러오는 중이에요...
        </div>
      ) : (
        <div className="space-y-6">
          {orderedParts.map((part) => {
            const partMembers = members.filter((m) => m.part === part);

            return (
              <div
                key={part}
                className="bg-white rounded-xl p-4 border border-[#ece7e2]"
              >
                <h2 className="text-md font-semibold text-[#5a4a42] mb-2">
                  {partLabels[part]}
                </h2>

                {partMembers.length > 0 ? (
                  <ul className="flex flex-wrap gap-2 text-sm text-[#3E3232]">
                    {partMembers.map((m) => (
                      <li
                        key={m._id}
                        className="px-2 py-1 bg-[#f3efea] rounded-full"
                      >
                        {m.name}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-400">
                    등록된 단원이 없습니다.
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MemberListPage;
