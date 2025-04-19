"use client";

import { mockNotices } from "@/lib/mock/notices";
import { mockSchedules } from "@/lib/mock/schedule";
import Image from "next/image";
import Link from "next/link";
import MoreLink from "./MoreLink";

export function NoticeList() {
  return (
    <section className="px-4 py-2">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-base font-semibold">공지 사항</h2>
        <MoreLink href="/menu/notice/announcement" />
      </div>
      <div className="bg-white rounded-xl shadow p-2 space-y-1">
        {mockNotices.map((notice) => (
          <Link
            key={notice.id}
            href={`/menu/notice/announcement/${notice.id}`}
            className="flex justify-between items-center p-1 text-sm hover:bg-gray-50 rounded transition"
          >
            <div className="flex items-center gap-2">
              {notice.pinned ? (
                <Image
                  src="/icons/pin-filled.svg"
                  alt="pinned"
                  width={14}
                  height={14}
                />
              ) : (
                <Image
                  src="/icons/pin.svg"
                  alt="pinned"
                  width={14}
                  height={14}
                />
              )}
              <span>{notice.title}</span>
              {notice.isNew && (
                <span className="text-xs text-red-500 ml-1">N</span>
              )}
            </div>
            <span className="text-xs text-gray-400">{notice.date}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function ScheduleList() {
  return (
    <section className="px-4 py-2">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-base font-semibold">연습 일정</h2>
        <MoreLink href="/menu/notice/schedule" />
      </div>
      {mockSchedules.map((schedule) => (
        <div
          key={schedule.id}
          className="flex mb-3 rounded-xl overflow-hidden shadow bg-white"
        >
          <div className="w-16 bg-[#a08e8e] text-white text-center flex flex-col justify-center items-center py-2">
            <span className="text-xs font-bold">
              {schedule.displayDate.split(" ")[0]}
            </span>
            <span className="text-sm font-bold">
              {schedule.displayDate.split(" ")[1]}
            </span>
          </div>
          <div className="flex-1 p-3 text-sm text-[#3E3232]">
            {schedule.pieces.map((piece, idx) => (
              <div key={idx} className="mb-2">
                <p className="text-xs text-gray-500">{piece.time}</p>
                <p className="text-sm text-[#3E3232]">{piece.title}</p>
                {piece.note && (
                  <p className="text-xs text-gray-400 mt-1">{piece.note}</p>
                )}
                {idx !== schedule.pieces.length - 1 && (
                  <hr className="border-t border-dashed border-gray-300 my-2" />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
