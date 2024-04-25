import { Profession } from "../intefaces/profession.interface";
import { VacancyForm } from "../intefaces/vacancy-form.interface";

export interface VacancyToServer {
  vacancyId?: number;
  userId: number;
  organizationName: string;
  professionId: number;
  professionSpecialization?: string;
  expectedIncomePerMonthFrom: string;
  expectedIncomePerMonthTo?: string;
  workExperienceId: number;
  employmentTypeId: number;
  workScheduleId: number;
  educationTypeId?: number;
  aboutVacancy?: string;
  createdDateUTC?: string;
}

export interface Vacancy extends Omit<VacancyToServer, "professionId"> {
  professionName: string;
  isFavorite: boolean;
}

export interface VacancyToUpdate extends Omit<VacancyToServer, "professionId" | "userId" | "organizationName" | "createdDateUTC"> {
}

export function buildVacancyToCreate(userId: number, professions: Profession[], data: VacancyForm): VacancyToServer {
  const professionId = findProfessionId(professions, data.professionName);

  return {
    userId,
    organizationName: data.organizationName,
    professionId,
    professionSpecialization: data.professionSpecialization && data.professionSpecialization.length ? data.professionSpecialization : undefined,
    expectedIncomePerMonthFrom: data.expectedIncomePerMonthFrom,
    expectedIncomePerMonthTo: data.expectedIncomePerMonthTo && data.expectedIncomePerMonthTo.length ? data.expectedIncomePerMonthTo : undefined,
    workExperienceId: data.workExperienceId,
    employmentTypeId: data.employmentTypeId,
    workScheduleId: data.workScheduleId,
    educationTypeId: data.educationTypeId ? data.educationTypeId : undefined,
    aboutVacancy: data.aboutVacancy && data.aboutVacancy.length ? data.aboutVacancy : undefined
  };
}

function findProfessionId(professions: Profession[], professionName: string): number {
  const profession = professions.find(profession =>
    profession.professionName.toLowerCase() === professionName.toLowerCase()
  );
  return profession ? profession.professionId : 0;
}


