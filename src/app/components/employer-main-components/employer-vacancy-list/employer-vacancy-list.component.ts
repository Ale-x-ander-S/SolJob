import { Component, inject } from '@angular/core';
import { EmployerNavigationPanelComponent } from "../employer-navigation-panel/employer-navigation-panel.component";
import { JobseekerState } from "../../../states/jobseeker-state";
import { Select } from "@ngxs/store";
import { Observable } from "rxjs";
import { Vacancy } from "../../../models/vacancy.model";
import { AsyncPipe, DatePipe } from "@angular/common";
import { RouterLink } from "@angular/router";
import { CustomButtonComponent } from "../../shared-components/custom-button/custom-button.component";
import { TokenService } from "../../../services/token.service";
import { IsVacancyHasNewResponsePipe } from "../../../services/pipes/is-vacancy-has-new-response.pipe";
import { NoViewedVacancyResponse } from "../../../intefaces/no-viewed-vacancy-response.interface";
import { FilterVacanciesByNewResponsesPipe } from "../../../services/pipes/filter-vacancies-by-new-responses.pipe";

@Component({
  selector: 'app-employer-vacancy-list',
  standalone: true,
  imports: [
    EmployerNavigationPanelComponent,
    AsyncPipe,
    DatePipe,
    RouterLink,
    CustomButtonComponent,
    IsVacancyHasNewResponsePipe,
    IsVacancyHasNewResponsePipe,
    FilterVacanciesByNewResponsesPipe
  ],
  templateUrl: './employer-vacancy-list.component.html',
  styleUrl: './employer-vacancy-list.component.scss'
})
export class EmployerVacancyListComponent {
  private tokenService = inject(TokenService);
  readonly tokenUserData: { userId: number } | undefined = this.tokenService.getTokenUserData();

  showOnlyNewResponses = false;

  @Select(JobseekerState.employerVacancies)
  employerVacancies$: Observable<Vacancy[]> | undefined;

  @Select(JobseekerState.employerNoViewedVacanciesResponses)
  employerNoViewedVacanciesResponses$: Observable<NoViewedVacancyResponse[]> | undefined;

  toggleShowOnlyNewResponses() {
    this.showOnlyNewResponses = !this.showOnlyNewResponses;
  }
}
