import { UserRegistrationInfo } from "../models/user-registration-info.model";
import { UserLoginInfo } from "../models/user-login-info.model";
import { UserInfo } from "../models/user-info.model";
import { ResumeFormValues } from "../intefaces/resume-forms-values-to-update.interface";
import { EMPLOYER, JOBSEEKER } from "../constans/user-type.constant";

export class SetStartPageType {
  static readonly type = "[JobseekerState] Set Start Page Type";

  constructor(public readonly userType: typeof JOBSEEKER | typeof EMPLOYER) {
  }
}

export class ToggleStartPageType {
  static readonly type = "[JobseekerState] ToggleStartPageType";
}

export class Registration {
  static readonly type = "[JobseekerState] Registration";

  constructor(public readonly userRegistrationInfo: UserRegistrationInfo) {
  }
}

export class Login {
  static readonly type = "[JobseekerState] Login";

  constructor(public readonly userLoginInfo: UserLoginInfo) {
  }
}

export class LoadCurrentUserType {
  static readonly type = "[JobseekerState] Load Current User Type";
}

export class ClearServerErrorMessage {
  static readonly type = "[JobseekerState]  Clear Server Error Message";
}

export class LoadUserInfo {
  static readonly type = "[JobseekerState] Load User Info";

  constructor(public readonly userId: number) {
  }
}

export class ResetState {
  static readonly type = "[JobseekerState] Reset State";
}

export class UpdateUserInfo {
  static readonly type = "[JobseekerState] Update User Info";

  constructor(public readonly userInfoToUpdate: UserInfo) {
  }
}

export class SetLoadingStatus {
  static readonly type = "[JobseekerState] Set Loading Status";
  constructor(public readonly isLoading: boolean) {
  }
}

export class DeleteUser {
  static readonly type = "[JobseekerState] Delete User";
  constructor(public readonly passwordToConfirmDeleting: UserInfo) {
  }
}

export class LoadProfessions {
  static readonly type = "[JobseekerState] Load Professions";
}

export class LoadProfession {
  static readonly type = "[JobseekerState] Load Profession";
  constructor(public readonly professionId: number) {
  }
}

export class CreateProfession {
  static readonly type = "[JobseekerState] Create Profession";
  constructor(public readonly professionName: string) {
  }
}

export class LoadResume {
  static readonly type = "[JobseekerState] Load Resume";
}

export class CreateResume {
  static readonly type = "[JobseekerState] Create Resume";
}

export class UpdateResume {
  static readonly type = "[JobseekerState] Update Resume";
  constructor(public readonly resumeFormToUpdate: ResumeFormValues) {
  }
}

export class DeleteResume {
  static readonly type = "[JobseekerState] Delete Resume";
}

export class LoadEmployerVacancies {
  static readonly type = "[JobseekerState] Load Employer Vacancies";
}

export class CreateVacancy {
  static readonly type = "[JobseekerState] Create Vacancy";
}

export class SetEmployerVacancyToEdit {
  static readonly type = "[JobseekerState] Set Employer Vacancy To Edit";
  constructor(public readonly vacancyId: number) {
  }
}

export class UpdateVacancy {
  static readonly type = "[JobseekerState] Update Vacancy";
}

export class DeleteVacancy {
  static readonly type = "[JobseekerState] Delete Vacancy";
}

export class LoadSearchingVacancies {
  static readonly type = "[JobseekerState] Load Searching Vacancies";
}

export class LoadFavoriteVacancies {
  static readonly type = "[JobseekerState] Load Favorite Vacancies";
}

export class LoadVacancy {
  static readonly type = "[JobseekerState] Load Vacancy";
  constructor(public readonly vacancyId: number) {
  }
}

export class ClearSearchingVacancies {
  static readonly type = "[JobseekerState] Clear Searching Vacancies";
}

export class ToggleVacancyFavoriteStatus {
  static readonly type = "[JobseekerState] Toggle Vacancy Favorite Status";
  constructor(public readonly vacancyId?: number) {
  }
}

export class CreateJobseekerVacancyResponse {
  static readonly type = "[JobseekerState] Create Jobseeker Vacancy Response";
}

export class LoadJobseekerResponsiveVacancies {
  static readonly type = "[JobseekerState] Load Jobseeker Responsive Vacancies";
}

export class DeleteJobseekerResponsiveVacancy {
  static readonly type = "[JobseekerState] Delete Jobseeker Responsive Vacancy";
  constructor(public readonly vacancyId: number) {
  }
}

export class IncrementStepIndex {
  static readonly type = "[JobseekerState] Increment Step Index";
}

export class DecrementStepIndex {
  static readonly type = "[JobseekerState] Decrement Step Index";
}
