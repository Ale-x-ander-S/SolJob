import { Component } from '@angular/core';
import { JobseekerState } from "../../../states/jobseeker-state";
import { Observable } from "rxjs";
import { VacancyResponse } from "../../../intefaces/jobseeker-responsive-vacancy";
import { Select } from "@ngxs/store";
import { AsyncPipe, DatePipe, NgClass } from "@angular/common";
import { JobseekerResponse } from "../../../intefaces/jobseeker-responce.interface";
import { FormatToShortNamePipe } from "../../../services/pipes/format-to-short-name.pipe";
import { CustomButtonComponent } from "../../shared-components/custom-button/custom-button.component";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-employer-responses-container',
  standalone: true,
  imports: [
    AsyncPipe,
    NgClass,
    DatePipe,
    FormatToShortNamePipe,
    CustomButtonComponent,
    RouterLink
  ],
  templateUrl: './employer-responses-container.component.html',
  styleUrl: './employer-responses-container.component.scss'
})

export class EmployerResponsesContainerComponent {

  @Select(JobseekerState.allEmployerVacanciesResponses)
  allEmployerVacanciesResponses$: Observable<JobseekerResponse[]> | undefined;
}
