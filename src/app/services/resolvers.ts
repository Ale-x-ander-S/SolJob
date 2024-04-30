import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, ResolveFn, Router } from "@angular/router";
import { Store } from "@ngxs/store";
import {
  LoadAllEmployerVacanciesResponses,
  LoadEmployerVacancies, LoadFavoriteVacancies, LoadJobseekerResponsiveVacancies,
  LoadProfession,
  LoadProfessions,
  LoadResume,
  LoadUserInfo, LoadVacancy, SetEmployerVacancyToEdit,
  SetStartPageType
} from "../states/actions";
import { EMPTY, Observable, of } from "rxjs";
import { UserInfo } from "../models/user-info.model";
import { JobseekerState } from "../states/jobseeker-state";
import { TokenService } from "./token.service";
import { EMPLOYER, JOBSEEKER } from "../constans/user-type.constant";


export const setStartPageTypeResolver: ResolveFn<Observable<boolean>> = (route: ActivatedRouteSnapshot) => {
  const store: Store = inject(Store);
  if (route.url[0].path.includes("jobseeker")) {
    return store.dispatch(new SetStartPageType(JOBSEEKER));
  } else {
    return store.dispatch(new SetStartPageType(EMPLOYER));
  }
};


export const loadUserInfoResolver: ResolveFn<Observable<UserInfo>> = (route: ActivatedRouteSnapshot) => {
  const store: Store = inject(Store);
  const userInfoFromStore = store.selectSnapshot(JobseekerState.userInfo);
  if (userInfoFromStore) {
    return of(userInfoFromStore);
  } else {
    const userId = +route.params["id"];
    return store.dispatch(new LoadUserInfo(userId));
  }
};

export const loadProfessionsResolver: ResolveFn<Observable<UserInfo>> = () => {
  const store: Store = inject(Store);
  const professionsFromStore = store.selectSnapshot(JobseekerState.professions) ?? [];

  if (professionsFromStore.length > 1) {
    return of(professionsFromStore);
  } else {
    return store.dispatch(new LoadProfessions());
  }
};

export const loadUserProfessionResolver = (): void => {
  const store = inject(Store);
  const professionId = store.selectSnapshot(JobseekerState.resume)?.professionId;

  if (professionId) {
    store.dispatch(new LoadProfession(professionId));
  }
}

export const redirectToUserMainPageResolver = (): void => {
  const tokenService = inject(TokenService);
  const router = inject(Router);
  if (!tokenService.isTokenExpired()) {
    const userId = tokenService.getTokenUserData()?.userId;
    const url = tokenService.isUserJobseeker() ? `/seeker/${userId}/search` : `/employer/${userId}/search`;
    router.navigate([url]);
  }
};

export const loadUserResumeResolver = (): void => {
  const store = inject(Store);
  const resume = store.selectSnapshot(JobseekerState.resume);

  if (!resume) {
    store.dispatch(new LoadResume());
  }
}

export const loadEmployerVacanciesResolver = (): void => {
  const store = inject(Store);
  const employerVacancyFromStore = store.selectSnapshot(JobseekerState.employerVacancies) ?? [];
  if (!employerVacancyFromStore.length) {
    store.dispatch(new LoadEmployerVacancies());
  }
}

export const setEmployerVacancyToEditResolver = (route: ActivatedRouteSnapshot): void => {
  const store = inject(Store);
  const currentVacancyId = +route.params["vacancyId"];
  store.dispatch(new SetEmployerVacancyToEdit(currentVacancyId));
};

export const loadFavoriteVacanciesResolver = (): void => {
  const store = inject(Store);
  const currentFavoriteVacancies = store.selectSnapshot(JobseekerState.favoriteVacancies) ?? [];
  if (!currentFavoriteVacancies.length) {
    store.dispatch(new LoadFavoriteVacancies());
  }
};

export const loadVacancyResolver = (route: ActivatedRouteSnapshot): void => {
  const store = inject(Store);
  const currentVacancyId = +route.params["vacancyId"];
  store.dispatch(new LoadVacancy(currentVacancyId));
};

export const loadResponsiveVacanciesResolver = (): void => {
  const store = inject(Store);
  const currentResponsiveVacancies = store.selectSnapshot(JobseekerState.responsiveVacancies) ?? [];
  if (!currentResponsiveVacancies.length) {
    store.dispatch(new LoadJobseekerResponsiveVacancies());
  }
};

export const loadAllEmployerVacanciesResponsesResolver = (): void => {
  const store = inject(Store);
  const currentAllEmployerVacanciesResponses = store.selectSnapshot(JobseekerState.allEmployerVacanciesResponses) ?? [];
  if (!currentAllEmployerVacanciesResponses.length) {
    store.dispatch(new LoadAllEmployerVacanciesResponses());
  }
};


