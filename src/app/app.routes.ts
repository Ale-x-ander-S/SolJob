import { Routes } from '@angular/router';
import { JobseekerStartPageContainerComponent } from './components/jobseeker-main-components/jobseeker-start-page-container/jobseeker-start-page-container.component';
import { NotFoundPageComponent } from "./components/not-found-page/not-found-page.component";
import {
  JobseekerSearchComponent
} from "./components/jobseeker-main-components/jobseeker-search/jobseeker-search.component";
import {
  loadAllEmployerVacanciesResponsesResolver,
  loadEmployerVacanciesResolver, loadFavoriteVacanciesResolver,
  loadProfessionsResolver, loadResponsiveVacanciesResolver,
  loadUserInfoResolver, loadUserProfessionResolver, loadUserResumeResolver, loadVacancyResolver,
  redirectToUserMainPageResolver, setEmployerVacancyToEditResolver, setStartPageTypeResolver,
} from "./services/resolvers";
import {
  EmployerSearchComponent
} from "./components/employer-main-components/employer-search/employer-search.component";
import {
  EmployerVacancyListComponent
} from "./components/employer-main-components/employer-vacancy-list/employer-vacancy-list.component";
import {
  JobseekerVacancyPageComponent
} from "./components/jobseeker-main-components/jobseeker-vacancy-page/jobseeker-vacancy-page.component";
import {
  JobseekerResponsesListComponent
} from "./components/jobseeker-main-components/jobseeker-responses-list/jobseeker-responses-list.component";

export const routes: Routes = [
  {path: "", redirectTo: "/jobseeker", pathMatch: "full"},
  {
    path: "jobseeker",
    resolve: [ redirectToUserMainPageResolver, setStartPageTypeResolver ],
    component: JobseekerStartPageContainerComponent},
  {
    path: "jobseeker",
    children: [
      {
        path: "login",
        loadComponent: () => import('./components/shared-components/login/login.component').then((c) => c.LoginComponent)
      },
      {
        path: "registration",
        loadComponent: () => import('./components/shared-components/registration/registration.component').then((c) => c.RegistrationComponent)
      }
    ]
  },
  {
    path: "employer",
    loadComponent: () => import('./components/employer-main-components/employer-start-page/employer-start-page.component').then((c) => c.EmployerStartPageComponent)
  },
  {
    path: "employer",
    children: [
      {
        path: "login",
        loadComponent: () => import('./components/shared-components/login/login.component').then((c) => c.LoginComponent)
      },
      {
        path: "registration",
        loadComponent: () => import('./components/shared-components/registration/registration.component').then((c) => c.RegistrationComponent)
      }
    ]
  },
  {path: "seeker/:id", redirectTo: "seeker/:id/search", pathMatch: "full"},
  {
    path: "seeker/:id",
    resolve: [ loadUserResumeResolver ],
    children: [
      {
        path: "resume-create",
        resolve: [ loadProfessionsResolver ],
        loadComponent: () => import('./components/jobseeker-main-components/jobseeker-resume-create/jobseeker-resume-create.component').then((c) => c.JobseekerResumeCreateComponent)
      },
      {
        path: "resume-edit",
        resolve: [ loadUserProfessionResolver ],
        loadComponent: () => import('./components/jobseeker-main-components/jobseeker-resume-edit/jobseeker-resume-edit.component').then((c) => c.JobseekerResumeEditComponent)
      },
      {
        path: "search",
        resolve: [ loadProfessionsResolver ],
        component: JobseekerSearchComponent
      },
      { path: "favorites",
        resolve: [ loadFavoriteVacanciesResolver ],
        loadComponent: () => import('./components/jobseeker-main-components/jobseeker-favorites/jobseeker-favorites.component').then((c) => c.JobseekerFavoritesComponent)
      },
      {
        path: "notifications",
        loadComponent: () => import('./components/jobseeker-main-components/jobseeker-notifications/jobseeker-notifications.component').then((c) => c.JobseekerNotificationsComponent)
      },
      {
        path: "account",
        resolve: [ loadUserInfoResolver ],
        loadComponent: () => import('./components/shared-components/account-settings/account-settings.component').then((c) => c.AccountSettingsComponent)
      },
      {
        path: "vacancy/:vacancyId",
        resolve: [ loadVacancyResolver ],
        component: JobseekerVacancyPageComponent
      },
      {
        path: "responses",
        resolve: [ loadResponsiveVacanciesResolver ],
        component: JobseekerResponsesListComponent
      }
    ]
  },

  {
    path: "employer/:id",
    redirectTo: "employer/:id/search",
    pathMatch: "full"
  },
  {
    path: "employer/:id",
    children: [
      { path: "search", component: EmployerSearchComponent },
      {
        path: "favorites",
        loadComponent: () => import('./components/employer-main-components/employer-favorites/employer-favorites.component').then((c) => c.EmployerFavoritesComponent)
      },
      {
        path: "notifications",
        loadComponent: () => import('./components/employer-main-components/employer-notifications/employer-notifications.component').then((c) => c.EmployerNotificationsComponent)
      },
      {
        path: "vacancy-create",
        resolve: [ loadProfessionsResolver ],
        loadComponent: () => import('./components/employer-main-components/employer-vacancy-create/employer-vacancy-create.component').then((c) => c.EmployerVacancyCreateComponent)

      },
      {
        path: "vacancies-list",
        resolve: [ loadEmployerVacanciesResolver ],
        component: EmployerVacancyListComponent
      },
      {
        path: "vacancy-edit/:vacancyId",
        resolve: [ setEmployerVacancyToEditResolver ],
        loadComponent: () => import('./components/employer-main-components/employer-vacancy-edit/employer-vacancy-edit.component').then((c) => c.EmployerVacancyEditComponent)
      },
      {
        path: "responses",
        resolve: [ loadAllEmployerVacanciesResponsesResolver ],
        loadComponent: () => import('./components/employer-main-components/employer-responses-container/employer-responses-container.component').then((c) => c.EmployerResponsesContainerComponent)
      },
      {
        path: "account",
        resolve: [ loadUserInfoResolver ],
        loadComponent: () => import('./components/shared-components/account-settings/account-settings.component').then((c) => c.AccountSettingsComponent)
      }
    ]
  },
  {path: "**", component: NotFoundPageComponent}
];
