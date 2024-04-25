export interface ExperienceLevel {
  id: number,
  name: string
}

export const EXPERIENCE_LEVELS: ExperienceLevel[] = [
  { id: 1, name: 'Без опыта' },
  { id: 2, name: 'От 1 года до 3 лет' },
  { id: 3, name: 'От 3 до 6 лет' },
  { id: 4, name: 'Более 6 лет' }
];
