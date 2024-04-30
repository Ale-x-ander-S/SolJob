import { Pipe, PipeTransform } from "@angular/core";
import { VacancyResponse } from "../../intefaces/jobseeker-responsive-vacancy";
import { NoViewedVacancyResponse } from "../../intefaces/no-viewed-vacancy-response.interface";

@Pipe({
  name: 'isVacancyHasNewResponsePipe',
  standalone: true
})

export class IsVacancyHasNewResponsePipe implements PipeTransform {
  transform(vacanciesResponses: NoViewedVacancyResponse[] | null, vacancyId: number | undefined): boolean {
    if (!vacanciesResponses || !vacancyId) {
      return false;
    }
    return vacanciesResponses.some(vacancyResponse => vacancyResponse.vacancyId === vacancyId);
  }
}
