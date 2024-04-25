export interface Education {
  id: number,
  name: string
}

export const EDUCATION_TYPES: Education[] = [
  { id: 1, name: "Среднее" },
  { id: 2, name: "Среднее специальное" },
  { id: 3, name: "Неоконченное высшее" },
  { id: 4, name: "Высшее" },
  { id: 5, name: "Бакалавр" },
  { id: 6, name: "Магистр" },
  { id: 7, name: "Кандидат наук" },
  { id: 8, name: "Доктор наук" }
];
