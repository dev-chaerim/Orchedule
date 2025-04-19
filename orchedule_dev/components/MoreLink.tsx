// components/MoreLink.tsx
'use client';

import Link from 'next/link';

interface MoreLinkProps {
  href: string;
}

export default function MoreLink({ href }: MoreLinkProps) {
  return (
    <Link
      href={href}
      className="text-xs text-gray-400"
    >
      더 보기 &gt;
    </Link>
  );
}
