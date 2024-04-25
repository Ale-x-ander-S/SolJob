export interface VacancyForm {
  organizationName: string;
  professionName: string;
  professionSpecialization?: string;
  expectedIncomePerMonthFrom: string;
  expectedIncomePerMonthTo?: string;
  workExperienceId: number;
  employmentTypeId: number;
  workScheduleId: number;
  educationTypeId?: number;
  aboutVacancy?: string;
}
