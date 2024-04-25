export interface EmploymentType {
  id: number;
  name: string;
}

export const EMPLOYMENT_TYPES: EmploymentType[] = [
  { id: 1, name: 'Полная занятость' },
  { id: 2, name: 'Частичная занятость' },
  { id: 3, name: 'Проектная работа или разовое задание' },
  { id: 4, name: 'Волонтерство' },
  { id: 5, name: 'Стажировка' },
  { id: 6, name: 'Возможно временное оформление' },
  { id: 7, name: 'Возможно оформление по ГПХ (услуги, подряд, ИП, самозанятые) или совместительству' }
];
