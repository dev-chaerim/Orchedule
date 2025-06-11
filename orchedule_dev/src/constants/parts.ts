export type PartKey =
  | 'Vn1'
  | 'Vn2'
  | 'Va'
  | 'Vc'
  | 'Db'
  | 'Fl'
  | 'Ob'
  | 'Cl'
  | 'Bs'
  | 'Hr'
  | 'Tp'
  | 'Tbn'
  | 'Tuba'
  | 'Perc'
  | 'Timp'
  | 'Hp'
  | 'Pf';

export const orderedParts: PartKey[] = [
  'Vn1', 'Vn2', 'Va', 'Vc', 'Db',
  'Fl', 'Ob', 'Cl', 'Bs',
  'Hr', 'Tp', 'Tbn', 'Tuba',
  'Timp', 'Perc',
  'Hp', 'Pf'
];

export const partLabels: Record<PartKey, string> = {
  Vn1: '1st Violin',
  Vn2: '2nd Violin',
  Va:  'Viola',
  Vc:  'Violincello',
  Db:  'Doublebass',
  Fl:  'Flute',
  Ob:  'Oboe',
  Cl:  'Clarinet',
  Bs:  'Bassoon',
  Hr:  'Horn',
  Tp:  'Trumpet',
  Tbn: 'Trombone',
  Tuba: 'Tuba',
  Timp: 'Timpani',
  Perc: 'Percussion',
  Hp: 'Harp',
  Pf: 'Piano'
};

export const parts = orderedParts.map((key) => ({
  key,
  label: partLabels[key],
}));

export const partFamilies: Record<string, PartKey[]> = {
  현악: ['Vn1', 'Vn2', 'Va', 'Vc', 'Db'],
  목관: ['Fl', 'Ob', 'Cl', 'Bs'],
  금관: ['Hr', 'Tp', 'Tbn', 'Tuba'],
  타악: ['Timp', 'Perc'],
  건반: ['Hp', 'Pf']
};

export const attendanceFamilies = Object.keys(partFamilies);
