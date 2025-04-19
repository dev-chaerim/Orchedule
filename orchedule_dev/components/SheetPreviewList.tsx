'use client';

import Image from 'next/image';
import Link from 'next/link';
import { mockScoreChecks } from '@/src/lib/mock/scoreChecks';
import MoreLink from './MoreLink';

export default function SheetPreviewList() {
  return (
    <section className="px-4 py-4">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-base font-semibold">악보</h2>
        <MoreLink href="/menu/sheetmusic/sheet" />
      </div>

      {/* 여러 개의 카드 형태로 렌더링 */}
      <div className="space-y-3">
        {mockScoreChecks.map((sheet) => (
          <Link
            key={sheet.id}
            href={`/menu/sheetmusic/bowing/${sheet.id}`}
            className="block bg-white rounded-xl shadow p-3 hover:bg-gray-50 transition"
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Image src="/icons/music-file.svg" alt="악보" width={14} height={14} />
                <span className="text-sm">{sheet.title}</span>
                {sheet.isNew && (
                  <span className="text-xs text-red-500 ml-1">N</span>
                )}
              </div>
              <span className="text-xs text-gray-400">{sheet.date}</span>
            </div>

            <div className="flex gap-1 flex-wrap mt-3">
              {sheet.parts.map((part) => (
                <span
                  key={part}
                  className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                    part === 'Vn1'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-pink-100 text-pink-800'
                  }`}
                >
                  {part}
                </span>
              ))}
              <span className="text-xs bg-gray-200 px-2 py-0.5 rounded-full">
                {sheet.tag}
              </span>
            </div>

            <p className="text-xs text-[#3E3232] mt-3">{sheet.author}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
