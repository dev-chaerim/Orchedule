
'use client';

import Link from 'next/link';
import { vibur } from '../app/fonts';

export default function Logo() {
  return (
    <Link href="/">
      <h1
        className={`${vibur.className} text-[#3E3232] text-3xl font-bold mb-0 cursor-pointer`}
      >
        Orchedule
      </h1>
    </Link>
  );
}
