import { Component } from '@angular/core';
import { EmployerNavigationPanelComponent } from "../employer-navigation-panel/employer-navigation-panel.component";
import { JobseekerState } from "../../../states/jobseeker-state";
import { Select } from "@ngxs/store";
import { Observable } from "rxjs";
import { Vacancy } from "../../../models/vacancy.model";
import { AsyncPipe, DatePipe } from "@angular/common";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-employer-vacancy-list',
  standalone: true,
  imports: [
    EmployerNavigationPanelComponent,
    AsyncPipe,
    DatePipe,
    RouterLink
  ],
  templateUrl: './employer-vacancy-list.component.html',
  styleUrl: './employer-vacancy-list.component.scss'
})
export class EmployerVacancyListComponent {

  @Select(JobseekerState.employerVacancies)
  employerVacancies$: Observable<Vacancy[]> | undefined;
}
