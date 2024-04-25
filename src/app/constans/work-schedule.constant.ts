export interface WorkSchedule {
  id: number;
  name: string;
}

export const WORK_SCHEDULES: WorkSchedule[] = [
  { id: 1, name: 'Полный день' },
  { id: 2, name: 'Сменный график' },
  { id: 3, name: 'Гибкий график' },
  { id: 4, name: 'Удаленная работа' },
  { id: 5, name: 'Вахтовый метод' }
];
