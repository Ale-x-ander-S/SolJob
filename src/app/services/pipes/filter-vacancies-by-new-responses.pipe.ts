import { inject, Pipe, PipeTransform } from '@angular/core';
import { Vacancy } from "../../models/vacancy.model";
import { Store } from "@ngxs/store";
import { JobseekerState } from "../../states/jobseeker-state";

@Pipe({
  name: 'filterVacanciesByNewResponses',
  standalone: true
})

export class FilterVacanciesByNewResponsesPipe implements PipeTransform {
  private store = inject(Store);
  transform(vacancies: Vacancy[] | null, showVacanciesOnlyWithNewResponses: boolean): Vacancy[] {
    if (!showVacanciesOnlyWithNewResponses || !vacancies) {
      return vacancies ?? [];
    }
    const employerNoViewedVacanciesResponses = this.store.selectSnapshot(JobseekerState.employerNoViewedVacanciesResponses) ?? [];
    const employerNoViewedVacanciesResponsesIds = new Set(employerNoViewedVacanciesResponses?.map(response => response.vacancyId));

    return vacancies.filter(vacancy => employerNoViewedVacanciesResponsesIds.has(<number>vacancy.vacancyId));
  }
}
