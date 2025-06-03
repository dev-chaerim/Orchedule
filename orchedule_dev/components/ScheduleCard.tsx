"use client";

import React from "react";

interface OrchestraPiece {
  title: string;
  movements?: string[];
  note?: string;
}

interface ScheduleCardProps {
  time: string;
  description: string;
  pieces?: OrchestraPiece[];
  color?: string;
}

export default function ScheduleCard({
  time,
  description,
  pieces,
  color = "#a08e8e",
}: ScheduleCardProps) {
  return (
    <div className="flex flex-col items-start mb-4">
      {/* 시간 박스 */}
      <div
        className="text-white text-xs font-semibold px-3 py-[6px] rounded-md mb-2 mt-2"
        style={{ backgroundColor: color }}
      >
        {time}
      </div>

      {/* 내용 박스 */}
      <div className="bg-white w-full text-sm text-[#3E3232] rounded-md px-4 py-3 shadow-sm">
        <p>{description}</p>

        {pieces && pieces.length > 0 && (
          <div className="mt-2 space-y-1">
            {pieces.map((piece, idx) => (
              <div key={idx}>
                <p className="italic text-sm">
                  ▸ {piece.title}
                  {piece.movements && piece.movements?.length > 0 && (
                    <span className="ml-1 text-[#b36b5e] font-semibold">
                      ({piece.movements.join(", ")})
                    </span>
                  )}
                </p>
                {piece.note && (
                  <p className="text-xs text-[#7e6a5c] italic mt-0.5 ml-4">
                    {piece.note}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
