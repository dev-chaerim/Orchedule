'use client';
import Image from 'next/image';

export default function TopBar() {
  return (
    <div className="hidden md:flex justify-end items-center px-6 py-3 border-b bg-white">
      <div className="flex items-center gap-4">
        <Image
          src="/icons/search.svg"
          alt="검색"
          width={20}
          height={20}
          className="cursor-pointer"
        />
        <Image
          src="/icons/top-notice.svg"
          alt="알림"
          width={20}
          height={20}
          className="cursor-pointer"
        />
      </div>
    </div>
  );
}
