// src/constants/parts.ts
import type { PartKey } from '@/src/lib/mock/members';

export const orderedParts: PartKey[] = [
  'Vn1', 'Vn2', 'Va', 'Vc', 'Ba', 'Fl', 'Ob', 'Cl', 'Bs', 'Hr', 'Perc'
];

export const partLabels: Record<PartKey, string> = {
  Vn1: '1st Violin',
  Vn2: '2nd Violin',
  Va:  'Viola',
  Vc:  'Cello',
  Ba:  'Base',
  Fl:  'Flute',
  Ob:  'Oboe',
  Cl:  'Clarinet',
  Bs:  'Bassoon',
  Hr:  'Horn',
  Perc : 'Perc'
};

// 악기군별 파트 키 배열
export const partFamilies: Record<string, PartKey[]> = {
  현악: ['Vn1', 'Vn2', 'Va', 'Vc', 'Ba'],
  목관: ['Fl', 'Ob', 'Cl', 'Bs'],
  금관: ['Hr'],
  타악: ['Perc']
};

export const attendanceFamilies = Object.keys(partFamilies);
