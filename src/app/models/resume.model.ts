import { ResumeForm } from "../intefaces/resume-form.interface";
import { Profession } from "../intefaces/profession.interface";
import { ResumeFormValues } from "../intefaces/resume-forms-values-to-update.interface";

export interface Resume {
  userId: number;
  professionId: number;
  firstName: string;
  lastName?: string;
  middleName?: string;
  isMale: boolean;
  dayOfBirth: string;
  monthOfBirth: string;
  yearOfBirth: string;
  email?: string;
  phoneNumber?: string;
  educationId?: number;
  specialization?: string;
  aboutMe?: string;
}

export interface ResumeToUpdate {
  professionId?: number;
  firstName?: string;
  lastName?: string;
  middleName?: string;
  isMale?: boolean;
  dayOfBirth?: string;
  monthOfBirth?: string;
  yearOfBirth?: string;
  email?: string;
  phoneNumber?: string;
  educationId?: number;
  specialization?: string;
  aboutMe?: string;
}

export function buildResumeToCreate(userId: number, professions: Profession[], data: ResumeForm): Resume {
  const professionId = findProfessionId(professions, data.professionName);

  return {
    userId,
    professionId,
    firstName: data.firstName,
    lastName: data.lastName && data.lastName.length ? data.lastName : undefined,
    middleName: data.middleName && data.middleName.length ? data.middleName : undefined,
    isMale: data.isMale,
    dayOfBirth: data.dayOfBirth,
    monthOfBirth: formattedMonthOfBirth(data.monthOfBirth),
    yearOfBirth: data.yearOfBirth,
    email: data.email && data.email.length ? data.email : undefined,
    phoneNumber: data.phoneNumber && data.phoneNumber.length ? data.phoneNumber : undefined,
    educationId: data.educationId && data.educationId.length ? +data.educationId : undefined,
    specialization: data.specialization && data.specialization.length ? data.specialization : undefined,
    aboutMe: data.aboutMe && data.aboutMe.length ? data.aboutMe : undefined,
  };
}

export function buildResumeFieldsToUpdate(professions: Profession[], fieldsToUpdate: Partial<ResumeFormValues>): ResumeToUpdate {
  const result: ResumeToUpdate = {};

  for (const key in fieldsToUpdate) {
    switch (key) {
      case 'professionName':
        if (fieldsToUpdate[key] !== null && fieldsToUpdate[key] !== undefined) {
          result.professionId = findProfessionId(professions, fieldsToUpdate[key]!);
        }
        break;
      case 'educationId':
        if (fieldsToUpdate[key] !== null && fieldsToUpdate[key] !== undefined) {
          result.educationId = +fieldsToUpdate[key]!;
        }
        break;
      case 'monthOfBirth':
        if (fieldsToUpdate[key] !== null && fieldsToUpdate[key] !== undefined) {
          result.monthOfBirth = formattedMonthOfBirth(fieldsToUpdate[key]!.toString());
        }
        break;
      case 'isMale':
        if (fieldsToUpdate[key] !== null && fieldsToUpdate[key] !== undefined) {
          result.isMale = fieldsToUpdate[key]!;
        }
        break;
      case 'firstName':
      case 'lastName':
      case 'middleName':
      case 'dayOfBirth':
      case 'yearOfBirth':
      case 'email':
      case 'phoneNumber':
      case 'specialization':
      case 'aboutMe':
        if (fieldsToUpdate[key] !== null && fieldsToUpdate[key] !== undefined) {
          result[key] = fieldsToUpdate[key]!;
        }
        break;
    }
  }
  return result;
}


function findProfessionId(professions: Profession[], professionName: string): number {
  const profession = professions.find(profession => profession.professionName.toLowerCase() === professionName.toLowerCase());
  return profession ? profession.professionId : 0;
}

function formattedMonthOfBirth(monthOfBirth: string) {
  return monthOfBirth.length === 1 ? `0${monthOfBirth}` : monthOfBirth.toString();
}

