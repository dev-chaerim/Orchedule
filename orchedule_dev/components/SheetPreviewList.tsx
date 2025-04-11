'use client';

import Image from 'next/image';
import { mockSheets } from '@/lib/mock/sheets';

export default function SheetPreviewList() {
  return (
    <section className="px-4 py-2">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-base font-semibold">악보</h2>
        <span className="text-xs text-gray-400">더 보기 &gt;</span>
      </div>
      <div className="bg-white rounded-xl shadow p-3">
        {mockSheets.map((sheet) => (
          <div key={sheet.id} className="text-sm mb-1">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Image src="/icons/music-file.svg" alt="악보" width={14} height={14} />
                <span>{sheet.title}</span>
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
          </div>
        ))}
      </div>
    </section>
  );
}
