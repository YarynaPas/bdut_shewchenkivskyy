export const NAPRYAM = [
    "Художньо-естетичний відділ",
    "Гуманітарний відділ",
    "Вокально-хореографічний відділ",
] as const;

export type Napryam = (typeof NAPRYAM)[number];