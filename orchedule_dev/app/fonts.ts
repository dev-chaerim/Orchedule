import { Noto_Sans_KR } from 'next/font/google';
import { Vibur } from 'next/font/google';

export const notoSansKr = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
});

export const vibur = Vibur({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});