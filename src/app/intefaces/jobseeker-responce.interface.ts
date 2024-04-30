export interface JobseekerResponse {
  responseId?: number,
  jobseekerId: number,
  employerId: number,
  vacancyId: number,
  isEmployerResponseViewed: boolean,
  createdDateUTC?: string
  jobseekerFirstName?: string,
  jobseekerMiddleName?: string,
  jobseekerLastName?: string,
  professionName?: string
}
