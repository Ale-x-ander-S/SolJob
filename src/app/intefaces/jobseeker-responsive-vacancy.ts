export interface VacancyResponse {
  responseId?: number,
  vacancyId: number,
  organizationName: string;
  professionName: string;
  professionSpecialization?: string;
  isEmployerResponseViewed: boolean,
  createdDateUTC?: string
}
