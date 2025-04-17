// mock/members.ts

export type PartKey = 'Vn1' | 'Vn2' | 'Va' | 'Vc' | 'Ba' | 'Fl' | 'Ob' | 'Cl' | 'Bs' | 'Hr' | 'Perc';

export interface Member {
  id: string;        // 유니크 키 (예: 'Vn1-01')
  part: PartKey;     // 파트 키
  name: string;      // 단원 이름
}

// 모든 단원을 id + 파트키 + 이름 형태로 한 줄씩 정의
export const members: Member[] = [
  { id: 'Vn1-01', part: 'Vn1', name: '정혜림' },
  { id: 'Vn1-02', part: 'Vn1', name: '허주희' },
  { id: 'Vn1-03', part: 'Vn1', name: '이시원' },
  { id: 'Vn1-04', part: 'Vn1', name: '김단원' },
  { id: 'Vn1-05', part: 'Vn1', name: '김단원' },
  { id: 'Vn1-06', part: 'Vn1', name: '김단원' },
  { id: 'Vn1-07', part: 'Vn1', name: '김단원' },
  /* … 나머지 1st Violin … */
  { id: 'Vn2-01', part: 'Vn2', name: '김단원' },
  { id: 'Vn2-02', part: 'Vn2', name: '김단원' },
  { id: 'Vn2-03', part: 'Vn2', name: '김단원' },
  { id: 'Vn2-04', part: 'Vn2', name: '김단원' },
  { id: 'Vn2-05', part: 'Vn2', name: '김단원' },
  { id: 'Vn2-06', part: 'Vn2', name: '김단원' },
  /* … 2nd Violin … */
  { id: 'Va-01',  part: 'Va',  name: '유효림' },
  { id: 'Va-02',  part: 'Va',  name: '김정호' },
  { id: 'Va-03',  part: 'Va',  name: '김준용' },
  // Cell, Bass 등 나머지 파트
];
