export interface JobseekerResponse {
  responseId?: number,
  jobseekerId: number,
  employerId: number,
  vacancyId: number,
  isEmployerResponseViewed: boolean,
  createdDateUTC?: string
}
