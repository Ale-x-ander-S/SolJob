import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { inject, Injectable, NgZone } from "@angular/core";
import {
  ClearSearchingVacancies,
  ClearServerErrorMessage, CreateJobseekerVacancyResponse,
  CreateProfession,
  CreateResume,
  CreateVacancy,
  DecrementStepIndex, DeleteJobseekerResponsiveVacancy,
  DeleteResume,
  DeleteUser,
  DeleteVacancy,
  IncrementStepIndex,
  LoadCurrentUserType,
  LoadEmployerVacancies, LoadFavoriteVacancies, LoadJobseekerResponsiveVacancies,
  LoadProfession,
  LoadProfessions,
  LoadResume,
  LoadSearchingVacancies,
  LoadUserInfo, LoadVacancy,
  Login,
  Registration,
  ResetState,
  SetEmployerVacancyToEdit,
  SetLoadingStatus,
  SetStartPageType,
  ToggleStartPageType, ToggleVacancyFavoriteStatus,
  UpdateResume,
  UpdateUserInfo,
  UpdateVacancy
} from "./actions";
import { UpdateFormValue } from "@ngxs/form-plugin";
import { HttpService } from "../services/http.service";
import { catchError, EMPTY, lastValueFrom, tap } from "rxjs";
import { Router } from "@angular/router";
import { buildUserLoginInfo, UserLoginInfo } from "../models/user-login-info.model";
import { TokenService } from "../services/token.service";
import { UserInfo } from "../models/user-info.model";
import { Profession } from "../intefaces/profession.interface";
import { ResumeForm } from "../intefaces/resume-form.interface";
import { buildResumeFieldsToUpdate, buildResumeToCreate, Resume, ResumeToUpdate, } from "../models/resume.model";
import { EMPLOYER, JOBSEEKER } from "../constans/user-type.constant";
import { VacancyForm } from "../intefaces/vacancy-form.interface";
import { buildVacancyToCreate, Vacancy, VacancyToServer, VacancyToUpdate } from "../models/vacancy.model";
import { SearchSettings } from "../intefaces/search-settings.interface";
import { JobseekerFavorite } from "../intefaces/jobseeker-favorite.interface";
import { JobseekerResponse } from "../intefaces/jobseeker-responce.interface";
import { JobseekerResponsiveVacancy } from "../intefaces/jobseeker-responsive-vacancy";
import { NotificationService } from "../services/notification.service";

const defaultState: JobseekerStateModel = {
  isJobseekerStartPage: undefined,
  currentUserType: undefined,
  serverErrorMessage: undefined,
  userInfo: undefined,
  isLoading: undefined,
  professions: undefined,
  stepIndex: 1,
  resume: undefined,
  employerVacancies: undefined,
  vacancyToEdit: undefined,
  searchResultsVacancies: undefined,
  favoriteVacancies: undefined,
  selectedVacancy: undefined,
  responsiveVacancies: undefined
};

interface JobseekerStateModel {
  isJobseekerStartPage: boolean | undefined,
  currentUserType: typeof JOBSEEKER | typeof EMPLOYER | undefined;
  serverErrorMessage: string | undefined;
  userInfo: UserInfo | undefined;
  isLoading: boolean | undefined;
  professions: Profession[] | undefined;
  stepIndex: number,
  resume: Resume | undefined;
  employerVacancies: Vacancy[] | undefined;
  vacancyToEdit: Vacancy | undefined;
  searchResultsVacancies: Vacancy[] | [] | undefined;
  favoriteVacancies: Vacancy[] | undefined;
  selectedVacancy: Vacancy | undefined;
  responsiveVacancies: JobseekerResponsiveVacancy[] | undefined;
}

@Injectable()
@State<JobseekerStateModel>({
  name: 'jobseekerState',
  defaults: defaultState
})

export class JobseekerState {
  private httpService: HttpService = inject(HttpService);
  private router: Router = inject(Router);
  private tokenService: TokenService = inject(TokenService);
  private ngZone: NgZone = inject(NgZone);
  private store: Store = inject(Store);
  private notificationService = inject(NotificationService);

  @Selector([JobseekerState])
  static isJobseekerStartPage(state: JobseekerStateModel) {
    return state.isJobseekerStartPage;
  }

  @Selector([JobseekerState])
  static currentUserType(state: JobseekerStateModel) {
    return state.currentUserType;
  }

  @Selector([JobseekerState])
  static serverErrorMessage(state: JobseekerStateModel) {
    return state.serverErrorMessage;
  }

  @Selector([JobseekerState])
  static userInfo(state: JobseekerStateModel) {
    return state.userInfo;
  }

  @Selector([JobseekerState])
  static isLoading(state: JobseekerStateModel) {
    return state.isLoading;
  }

  @Selector([JobseekerState])
  static professions(state: JobseekerStateModel) {
    return state.professions;
  }

  @Selector([JobseekerState])
  static stepIndex(state: JobseekerStateModel) {
    return state.stepIndex;
  }

  @Selector([JobseekerState])
  static resume(state: JobseekerStateModel) {
    return state.resume;
  }

  @Selector([JobseekerState])
  static employerVacancies(state: JobseekerStateModel) {
    return state.employerVacancies;
  }

  @Selector([JobseekerState])
  static vacancyToEdit(state: JobseekerStateModel) {
    return state.vacancyToEdit;
  }

  @Selector([JobseekerState])
  static searchResultsVacancies(state: JobseekerStateModel) {
    return state.searchResultsVacancies;
  }

  @Selector([JobseekerState])
  static favoriteVacancies(state: JobseekerStateModel) {
    return state.favoriteVacancies;
  }

  @Selector([JobseekerState])
  static selectedVacancy(state: JobseekerStateModel) {
    return state.selectedVacancy;
  }

  @Selector([JobseekerState])
  static responsiveVacancies(state: JobseekerStateModel) {
    return state.responsiveVacancies;
  }

  @Action(SetStartPageType)
  setStartPageType(ctx: StateContext<JobseekerStateModel>, action: SetStartPageType) {
    const isJobseekerStartPage = action.userType === JOBSEEKER;
    ctx.patchState({isJobseekerStartPage});
  }

  @Action(ToggleStartPageType)
  toggleStartPageType(ctx: StateContext<JobseekerStateModel>) {
    const currentStartPageType = ctx.getState().isJobseekerStartPage;
    ctx.patchState({isJobseekerStartPage: !currentStartPageType});
  }

  @Action(Registration)
  registration(ctx: StateContext<JobseekerStateModel>, action: Registration) {
    return this.httpService.registration(action.userRegistrationInfo).pipe(
      tap(response => {
        if (response.isSuccess) {
          const userLoginInfo: UserLoginInfo = buildUserLoginInfo(action.userRegistrationInfo);
          ctx.dispatch(new Login(userLoginInfo));
        } else {
          ctx.patchState({serverErrorMessage: response.errorMessages[0]});
        }
      }),
      catchError(error => {
        console.error('An error occurred while registering:', error);
        return EMPTY;
      })
    )
  }

  @Action(Login)
  login(ctx: StateContext<JobseekerStateModel>, action: Login) {
    return this.httpService.login(action.userLoginInfo).pipe(
      tap(response => {
        if (response.isSuccess) {
          const token: string = response.result;
          this.tokenService.saveToken(token);
          ctx.dispatch(new LoadCurrentUserType());
          const currentUserId = this.tokenService.getTokenUserData()?.userId;
          this.ngZone.run(() => {
            if (this.tokenService.isUserJobseeker()) {
              this.router.navigate([`seeker/${currentUserId}`]);
            } else {
              this.router.navigate([`employer/${currentUserId}`]);
            }
          });
        } else {
          ctx.patchState({serverErrorMessage: response.errorMessages[0]});
        }
      }),
      catchError(error => {
        console.error('An error occurred while logging:', error);
        return EMPTY;
      })
    )
  }

  @Action(LoadCurrentUserType)
  loadCurrentUserType(ctx: StateContext<JobseekerStateModel>) {
    const isTokenExist = this.tokenService.isTokenExist();
    const isTokenExpired = this.tokenService.isTokenExpired();
    const isUserJobseeker = this.tokenService.isUserJobseeker();

    if (isTokenExist && !isTokenExpired) {
      if (isUserJobseeker) {
        return ctx.patchState({currentUserType: JOBSEEKER});
      } else {
        return ctx.patchState({currentUserType: EMPLOYER});
      }
    } else {
      return ctx.patchState({currentUserType: undefined});
    }
  }

  @Action(ClearServerErrorMessage)
  clearServerErrorMessage(ctx: StateContext<JobseekerStateModel>) {
    ctx.patchState({serverErrorMessage: undefined});
  }

  @Action(LoadUserInfo)
  loadUserInfo(ctx: StateContext<JobseekerStateModel>, action: LoadUserInfo) {
    return this.httpService.getUserInfo(action.userId).pipe(
      tap(response => {
        if (response.isSuccess) {
          ctx.patchState({userInfo: response.result});
        } else {
          console.error(response.errorMessages)
        }
      }),
      catchError(error => {
        console.error('An error occurred while getting user info:', error);
        return EMPTY;
      })
    )
  }

  @Action(ResetState)
  resetState(ctx: StateContext<JobseekerStateModel>) {
    ctx.setState(defaultState);
  }

  @Action(UpdateUserInfo)
  updateUserInfo(ctx: StateContext<JobseekerStateModel>, action: UpdateUserInfo) {
    const currentUserId: number = this.tokenService.getTokenUserData()?.userId ?? 0;

    return this.httpService.updateUserInfo(currentUserId, action.userInfoToUpdate).pipe(
      tap(response => {
        if (response.isSuccess) {
          ctx.patchState({userInfo: response.result});
          this.notificationService.showSuccessMessage("Настройки успешно изменены");
        } else {
          ctx.patchState({serverErrorMessage: response.errorMessages[0]});
        }
      }),
      catchError(error => {
        console.error('An error occurred while updating user info:', error);
        return EMPTY;
      })
    )
  }

  @Action(SetLoadingStatus)
  setLoadingStatus(ctx: StateContext<JobseekerStateModel>, action: SetLoadingStatus) {
    ctx.patchState({isLoading: action.isLoading});
  }

  @Action(DeleteUser)
  deleteUser(ctx: StateContext<JobseekerStateModel>, action: DeleteUser) {
    const currentUserId: number = this.tokenService.getTokenUserData()?.userId ?? 0;

    return this.httpService.deleteUser(currentUserId, action.passwordToConfirmDeleting).pipe(
      tap(response => {
        if (response.isSuccess) {
          this.tokenService.removeToken();
          ctx.dispatch(new ClearServerErrorMessage());
          this.ngZone.run(() => {
            this.router.navigate([""]);
          });
          this.notificationService.showSuccessMessage("Аккаунт успешно удален");
        } else {
          ctx.patchState({serverErrorMessage: response.errorMessages[0]});
        }
      }),
      catchError(error => {
        console.error('An error occurred while deleting user:', error);
        return EMPTY;
      })
    )
  }

  //Professions -------------------------------------------------------------------------

  @Action(LoadProfessions)
  loadProfessions(ctx: StateContext<JobseekerStateModel>) {
    return this.httpService.getProfessions().pipe(
      tap(response => {
        if (response.isSuccess) {
          ctx.patchState({professions: response.result})
        }
      }),
      catchError(error => {
        console.error('An error occurred while loading professions:', error);
        return EMPTY;
      })
    )
  }

  @Action(LoadProfession)
  loadProfession(ctx: StateContext<JobseekerStateModel>, action: LoadProfession) {
    return this.httpService.getProfession(action.professionId).pipe(
      tap(response => {
        if (response.isSuccess) {
          ctx.patchState({professions: [response.result]})
        }
      }),
      catchError(error => {
        console.error('An error occurred while loading profession:', error);
        return EMPTY;
      })
    )
  }

  @Action(CreateProfession)
  async createProfession(ctx: StateContext<JobseekerStateModel>, action: CreateProfession) {
    const newProfessionName = JobseekerState.createNewProfessionNameIfNeeded(action.professionName, ctx);
    if (!newProfessionName) {
      return EMPTY;
    }
    return await lastValueFrom(this.httpService.createProfession(newProfessionName).pipe(
      tap(response => {
        if (response.isSuccess) {
          const currentProfessions = ctx.getState().professions ?? [];
          const updatedProfessions = [...currentProfessions, response.result];
          ctx.patchState({professions: updatedProfessions});
        }
      }),
      catchError(error => {
        console.error('An error occurred while creating profession:', error);
        return EMPTY;
      })
    ))
  }


  //Resume -------------------------------------------------------------------------

  @Action(LoadResume)
  loadResume(ctx: StateContext<JobseekerStateModel>) {
    const currentUserId: number = this.tokenService.getTokenUserData()?.userId ?? 0;
    return this.httpService.getResume(currentUserId).pipe(
      tap(response => {
        if (response.isSuccess) {
          ctx.patchState({resume: response.result});
        } else {
          console.log(response.errorMessages);
        }
      }),
      catchError(error => {
        console.error('An error occurred while loading resume:', error);
        return EMPTY;
      })
    )
  }

  @Action(CreateResume)
  createResume(ctx: StateContext<JobseekerStateModel>) {
    const resumeForm: ResumeForm = this.store.selectSnapshot(state => state.resumeForm).model;
    const professions: Profession[] = ctx.getState().professions ?? [];
    const currentUserId: number = this.tokenService.getTokenUserData()?.userId ?? 0;
    const resumeToCreate: Resume = buildResumeToCreate(currentUserId, professions, resumeForm);

    return this.httpService.createResume(resumeToCreate).pipe(
      tap(response => {
        if (response.isSuccess) {
          ctx.patchState({resume: response.result});
          ctx.patchState({stepIndex: 1});
          ctx.dispatch(new UpdateFormValue({value: undefined, path: 'resumeForm'}));
          this.ngZone.run(() => {
            this.router.navigate([`seeker/${currentUserId}/resume-edit`]);
          });
          this.notificationService.showSuccessMessage("Резюме успешно создано");
        } else {
          console.log(response.errorMessages)
        }
      }),
      catchError(error => {
        console.error('An error occurred while creating resume:', error);
        return EMPTY;
      })
    )
  }

  @Action(UpdateResume)
  async updateResume(ctx: StateContext<JobseekerStateModel>, action: UpdateResume) {
    const professionName = action.resumeFormToUpdate.professionName ?? undefined;
    if (professionName) {
      const newProfessionName = JobseekerState.createNewProfessionNameIfNeeded(professionName, ctx);
      if (newProfessionName) {
        await lastValueFrom(ctx.dispatch(new CreateProfession(newProfessionName)));
      }
    }
    const professions: Profession[] = ctx.getState().professions ?? [];
    const currentUserId: number = this.tokenService.getTokenUserData()?.userId ?? 0;
    const resumeFieldsToUpdate: ResumeToUpdate = buildResumeFieldsToUpdate(professions, action.resumeFormToUpdate);

    return this.httpService.updateResume(currentUserId, resumeFieldsToUpdate).pipe(
      tap(response => {
        if (response.isSuccess) {
          ctx.patchState({resume: response.result});
          this.notificationService.showSuccessMessage("Резюме успешно обновлено");
        } else {
          console.log(response.errorMessages)
        }
      }),
      catchError(error => {
        console.error('An error occurred while updating resume:', error);
        return EMPTY;
      })
    )
  }

  static createNewProfessionNameIfNeeded(professionName: string, ctx: StateContext<JobseekerStateModel>): string | undefined {
    const currentProfessions: Profession[] = ctx.getState().professions ?? [];
    const isProfessionExist: Profession | undefined = currentProfessions.find(profession =>
      profession.professionName.toLowerCase() === professionName.toLowerCase()
    );
    return !isProfessionExist ? professionName.charAt(0).toUpperCase() + professionName.slice(1).toLowerCase() : undefined;
  }

  @Action(DeleteResume)
  deleteResume(ctx: StateContext<JobseekerStateModel>) {
    const currentUserId: number = this.tokenService.getTokenUserData()?.userId ?? 0;

    return this.httpService.deleteResume(currentUserId).pipe(
      tap(response => {
        if (response.isSuccess) {
          ctx.patchState({resume: undefined});
          this.ngZone.run(() => {
            this.router.navigate([`seeker/${currentUserId}/search`]);
          });
          this.notificationService.showSuccessMessage("Резюме спешно удалено");
        } else {
          console.log(response.errorMessages);
        }
      }),
      catchError(error => {
        console.error('An error occurred while deleting resume:', error);
        return EMPTY;
      })
    )
  }

  //Vacancy -------------------------------------------------------------------------

  @Action(LoadEmployerVacancies)
  loadEmployerVacancies(ctx: StateContext<JobseekerStateModel>) {
    const currentUserId: number = this.tokenService.getTokenUserData()?.userId ?? 0;

    return this.httpService.getEmployerVacancies(currentUserId).pipe(
      tap(response => {
        if (response.isSuccess) {
          ctx.patchState({employerVacancies: response.result});
        } else {
          console.log(response.errorMessages)
        }
      }),
      catchError(error => {
        console.error('An error occurred while loading employer vacancies:', error);
        return EMPTY;
      })
    )
  }

  @Action(CreateVacancy)
  createVacancy(ctx: StateContext<JobseekerStateModel>) {
    const vacancyForm: VacancyForm = this.store.selectSnapshot(state => state.vacancyForm).model;
    const professions: Profession[] = ctx.getState().professions ?? [];
    const currentUserId: number = this.tokenService.getTokenUserData()?.userId ?? 0;
    const vacancyToCreate: VacancyToServer = buildVacancyToCreate(currentUserId, professions, vacancyForm);

    return this.httpService.createVacancy(vacancyToCreate).pipe(
      tap(response => {
        if (response.isSuccess) {
          const currentEmployerVacancies = ctx.getState().employerVacancies ?? [];
          const updatedEmployerVacancies = [response.result, ...currentEmployerVacancies];
          ctx.patchState({employerVacancies: updatedEmployerVacancies});
          ctx.patchState({stepIndex: 1});
          ctx.dispatch(new UpdateFormValue({value: undefined, path: 'vacancyForm'}));
          this.ngZone.run(() => {
            this.router.navigate([`employer/${currentUserId}/vacancies-list/`]);
          });
        } else {
          console.log(response.errorMessages)
        }
      }),
      catchError(error => {
        console.error('An error occurred while creating vacancy:', error);
        return EMPTY;
      })
    )
  }

  @Action(SetEmployerVacancyToEdit)
  setEmployerVacancyToEdit(ctx: StateContext<JobseekerStateModel>, action: SetEmployerVacancyToEdit) {
    const vacancyFromStore = ctx.getState().employerVacancies ?? [];
    const selectedVacancy = vacancyFromStore.find(vacancy =>
      vacancy.vacancyId === action.vacancyId
    );

    if (!vacancyFromStore.length || !selectedVacancy) {
      const currentUserId: number = this.tokenService.getTokenUserData()?.userId ?? 0;
      this.ngZone.run(() => {
        this.router.navigate([`/employer/${currentUserId}/vacancies-list`]);
      });
    }

    ctx.patchState({vacancyToEdit: selectedVacancy});
    this.store.dispatch(new UpdateFormValue({value: selectedVacancy, path: "editingVacancyForm"}))
  }

  @Action(UpdateVacancy)
  updateVacancy(ctx: StateContext<JobseekerStateModel>, action: UpdateVacancy) {
    const currentUserId: number = this.tokenService.getTokenUserData()?.userId ?? 0;
    const editingVacancyId = ctx.getState().vacancyToEdit?.vacancyId;
    const editingVacancyForm: VacancyForm = this.store.selectSnapshot(state => state.editingVacancyForm).model;
    const vacancyToUpdate: VacancyToUpdate = {
      vacancyId: editingVacancyId,
      professionSpecialization: editingVacancyForm?.professionSpecialization,
      expectedIncomePerMonthFrom: editingVacancyForm?.expectedIncomePerMonthFrom,
      expectedIncomePerMonthTo: editingVacancyForm?.expectedIncomePerMonthTo,
      workExperienceId: editingVacancyForm?.workExperienceId,
      workScheduleId: editingVacancyForm?.workScheduleId,
      employmentTypeId: editingVacancyForm?.employmentTypeId,
      educationTypeId: editingVacancyForm?.educationTypeId,
      aboutVacancy: editingVacancyForm?.aboutVacancy
    }
    return this.httpService.updateVacancy(currentUserId, vacancyToUpdate).pipe(
      tap(response => {
        if (response.isSuccess) {
          const currentEmployerVacancies: Vacancy[] = ctx.getState().employerVacancies ?? [];
          const updatedEmployerVacancies: Vacancy[] = currentEmployerVacancies.map(vacancy => {
            if (vacancy.vacancyId === editingVacancyId) {
              return {
                ...vacancy,
                professionSpecialization: response.result.professionSpecialization,
                expectedIncomePerMonthFrom: response.result.expectedIncomePerMonthFrom,
                expectedIncomePerMonthTo: response.result.expectedIncomePerMonthTo,
                workExperienceId: response.result.workExperienceId,
                workScheduleId: response.result.workScheduleId,
                employmentTypeId: response.result.employmentTypeId,
                aboutVacancy: response.result.aboutVacancy
              }
            }
            return vacancy;
          });
          ctx.patchState({employerVacancies: updatedEmployerVacancies});
        } else {
          console.log(response.errorMessages)
        }
      }),
      catchError(error => {
        console.error('An error occurred while creating vacancy:', error);
        return EMPTY;
      })
    )
  }

  @Action(DeleteVacancy)
  deleteVacancy(ctx: StateContext<JobseekerStateModel>, action: DeleteVacancy) {
    const vacancyIdToDelete = ctx.getState().vacancyToEdit?.vacancyId ?? 0;
    return this.httpService.deleteVacancy(vacancyIdToDelete).pipe(
      tap(response => {
        if (response.isSuccess) {
          const currentUserId: number = this.tokenService.getTokenUserData()?.userId ?? 0;
          const currentEmployerVacancies = ctx.getState().employerVacancies ?? [];
          const updatedEmployerVacancies = currentEmployerVacancies.filter(vacancy =>
            vacancy.vacancyId !== vacancyIdToDelete
          );
          ctx.patchState({employerVacancies: updatedEmployerVacancies});
          this.ngZone.run(() => {
            this.router.navigate([`/employer/${currentUserId}/vacancies-list`]);
          });
        } else {
          console.log(response.errorMessages)
        }
      }),
      catchError(error => {
        console.error('An error occurred while deleting vacancy:', error);
        return EMPTY;
      })
    )
  }

  @Action(LoadSearchingVacancies)
  loadSearchingVacancies(ctx: StateContext<JobseekerStateModel>, action: LoadSearchingVacancies) {
    const currentUserId: number = this.tokenService.getTokenUserData()?.userId ?? 0;
    const searchSettingsForm: SearchSettings = this.store.selectSnapshot(state => state.searchSettingsForm).model;
    const currentProfessions = ctx.getState().professions ?? [];

    searchSettingsForm.professionId = currentProfessions.find(profession =>
      profession.professionName.toLowerCase() === searchSettingsForm.searchTerm?.toLowerCase()
    )?.professionId;

    return this.httpService.getVacanciesBySearchSettings(currentUserId, searchSettingsForm).pipe(
      tap(response => {
        if (response.isSuccess) {
          const searchResultsVacancies = response.result ? response.result : undefined;
          ctx.patchState({searchResultsVacancies: searchResultsVacancies});
        } else {
          console.log(response.errorMessages);
        }
      }),
      catchError(error => {
        console.error('An error occurred while loading requested vacancy:', error);
        return EMPTY;
      })
    )
  }

  @Action(LoadFavoriteVacancies)
  loadFavoriteVacancies(ctx: StateContext<JobseekerStateModel>) {
    const currentUserId: number = this.tokenService.getTokenUserData()?.userId ?? 0;

    return this.httpService.getFavoriteVacancies(currentUserId).pipe(
      tap(response => {
        if (response.isSuccess) {
          ctx.patchState({favoriteVacancies: response.result});
        } else {
          console.log(response.errorMessages);
        }
      }),
      catchError(error => {
        console.error('An error occurred while loading favorite vacancies:', error);
        return EMPTY;
      })
    )
  }

  @Action(LoadVacancy)
  loadVacancy(ctx: StateContext<JobseekerStateModel>, action: LoadVacancy) {
    const currentSearchResultsVacancies = ctx.getState().searchResultsVacancies ?? [];
    const currentFavoriteVacancies = ctx.getState().favoriteVacancies ?? [];
    const selectedVacancy = currentSearchResultsVacancies.find(vacancy =>
        vacancy.vacancyId === action.vacancyId) ||
      currentFavoriteVacancies.find(vacancy =>
        vacancy.vacancyId === action.vacancyId
      );

    if (selectedVacancy) {
      return ctx.patchState({selectedVacancy});
    }
    return this.httpService.getVacancy(action.vacancyId).pipe(
      tap(response => {
        if (response.isSuccess) {
          ctx.patchState({selectedVacancy: response.result});
        } else {
          console.log(response.errorMessages);
        }
      }),
      catchError(error => {
        console.error('An error occurred while loading selected vacancy:', error);
        return EMPTY;
      })
    )
  }

  @Action(ClearSearchingVacancies)
  clearSearchingVacancies(ctx: StateContext<JobseekerStateModel>) {
    ctx.patchState({searchResultsVacancies: undefined});
  }

  //Jobseeker Favorite -------------------------------------------------------------------------

  @Action(ToggleVacancyFavoriteStatus)
  toggleVacancyFavoriteStatus(ctx: StateContext<JobseekerStateModel>, action: ToggleVacancyFavoriteStatus) {
    const currentUserId: number = this.tokenService.getTokenUserData()?.userId ?? 0;
    const selectedVacancy = ctx.getState().selectedVacancy;
    const vacancyId = action.vacancyId || (selectedVacancy?.vacancyId ?? 0);
    const vacancyToToggleStatus: JobseekerFavorite = {
      userId: currentUserId,
      vacancyId: vacancyId
    };

    return this.httpService.toggleVacancyFavoriteStatus(vacancyToToggleStatus).pipe(
      tap(response => {
        if (response.isSuccess) {
          const generateAndShowNotificationMessage = (responseValue?: boolean) => {
            const notificationMessage = responseValue
              ? "Вакансия добавлена в избранное"
              : "Вакансия удалена из избранного";
            this.notificationService.showSuccessMessage(notificationMessage);
          };
          const searchResultsVacancies = ctx.getState().searchResultsVacancies ?? [];

          if (searchResultsVacancies.length) {
            const updatedSearchResultsVacancies = searchResultsVacancies.map(vacancy => {
              return vacancy.vacancyId === vacancyId ? {...vacancy, isFavorite: response.result} : vacancy
            });
            ctx.patchState({searchResultsVacancies: updatedSearchResultsVacancies});
            generateAndShowNotificationMessage(response.result);
          }

          const favoriteVacancies = ctx.getState().favoriteVacancies ?? [];
          if (favoriteVacancies.length) {
            const vacancy = favoriteVacancies.find(vacancy => vacancy.vacancyId === vacancyId);
            if (vacancy) {
              const updatedFavoriteVacancies = favoriteVacancies.filter(vacancy => vacancy.vacancyId !== vacancyId);
              ctx.patchState({favoriteVacancies: updatedFavoriteVacancies});
              this.notificationService.showSuccessMessage("Вакансия удалена из избранного");
            } else {
              const vacancy = searchResultsVacancies.find(vacancy => vacancy.vacancyId === vacancyId);
              if (vacancy) {
                const updatedFavoriteVacancy = {...vacancy, isFavorite: response.result};
                const updatedFavoriteVacancies = [updatedFavoriteVacancy, ...favoriteVacancies];
                ctx.patchState({favoriteVacancies: updatedFavoriteVacancies});
                this.notificationService.showSuccessMessage("Вакансия добавлена в избранное");
              }
            }
          }
          if (selectedVacancy) {
            const updatedSelectedVacancy = {
              ...selectedVacancy,
              isFavorite: response.result
            }
            ctx.patchState({selectedVacancy: updatedSelectedVacancy});
            generateAndShowNotificationMessage(response.result);
          }
        } else {
          console.log(response.errorMessages)
        }
      }),
      catchError(error => {
        console.error('An error occurred while toggling favorite vacancy:', error);
        return EMPTY;
      })
    )
  }

  //Jobseeker Vacancy Response -------------------------------------------------------------------------

  @Action(CreateJobseekerVacancyResponse)
  createJobseekerVacancyResponse(ctx: StateContext<JobseekerStateModel>) {
    const currentUserId: number = this.tokenService.getTokenUserData()?.userId ?? 0;
    const selectedVacancy = ctx.getState().selectedVacancy;
    const jobseekerVacancyResponse: JobseekerResponse = {
      jobseekerId: currentUserId,
      employerId: selectedVacancy?.userId ?? 0,
      vacancyId: selectedVacancy?.vacancyId ?? 0,
      isEmployerResponseViewed: false
    };

    return this.httpService.createJobseekerVacancyResponse(jobseekerVacancyResponse).pipe(
      tap(response => {
        if (response.isSuccess) {
          const newResponsiveVacancy: JobseekerResponsiveVacancy = {
            ...response.result,
            professionName: selectedVacancy?.professionName ?? "",
            professionSpecialization: selectedVacancy?.professionSpecialization ?? "",
            organizationName: selectedVacancy?.organizationName ?? ""
          };
          const currentResponsiveVacancies = ctx.getState().responsiveVacancies ?? [];
          const updatedResponsiveVacancies = [newResponsiveVacancy, ...currentResponsiveVacancies];
          ctx.patchState({responsiveVacancies: updatedResponsiveVacancies});
          this.notificationService.showSuccessMessage("Отклик на вакансию успешно добавлен");
        } else {
          console.log(response.errorMessages);
        }
      }),
      catchError(error => {
        console.error('An error occurred while creating jobseeker vacancy response:', error);
        return EMPTY;
      })
    )
  }

  @Action(LoadJobseekerResponsiveVacancies)
  loadJobseekerResponsiveVacancies(ctx: StateContext<JobseekerStateModel>) {
    const currentUserId: number = this.tokenService.getTokenUserData()?.userId ?? 0;

    return this.httpService.getJobseekerResponsiveVacancies(currentUserId).pipe(
      tap(response => {
        if (response.isSuccess && response.result.length) {
          ctx.patchState({responsiveVacancies: response.result});
        } else {
          ctx.patchState({responsiveVacancies: undefined});
        }
      }),
      catchError(error => {
        console.error('An error occurred while loading responsive vacancies:', error);
        return EMPTY;
      })
    )
  }

  @Action(DeleteJobseekerResponsiveVacancy)
  deleteJobseekerResponsiveVacancy(ctx: StateContext<JobseekerStateModel>, action: DeleteJobseekerResponsiveVacancy) {
    const currentUserId: number = this.tokenService.getTokenUserData()?.userId ?? 0;

    return this.httpService.deleteJobseekerResponsiveVacancy(currentUserId, action.vacancyId).pipe(
      tap(response => {
        if (response.isSuccess) {
          const currentResponsiveVacancy = ctx.getState().responsiveVacancies ?? [];
          const updatedResponsiveVacancy = currentResponsiveVacancy.filter(vacancy =>
            vacancy.vacancyId !== action.vacancyId
          );
          ctx.patchState({responsiveVacancies: updatedResponsiveVacancy});
          this.notificationService.showSuccessMessage("Отклик на вакансию успешно удален");
        } else {
          console.log(response.errorMessages);
        }
      }),
      catchError(error => {
        console.error('An error occurred while loading responsive vacancies:', error);
        return EMPTY;
      })
    )
  }

  @Action(IncrementStepIndex)
  incrementStepIndex(ctx: StateContext<JobseekerStateModel>) {
    const currentStepIndex: number = ctx.getState().stepIndex;
    ctx.patchState({stepIndex: currentStepIndex + 1})
  }

  @Action(DecrementStepIndex)
  decrementStepIndex(ctx: StateContext<JobseekerStateModel>) {
    const currentStepIndex = ctx.getState().stepIndex;
    ctx.patchState({stepIndex: currentStepIndex - 1})
  }
}
