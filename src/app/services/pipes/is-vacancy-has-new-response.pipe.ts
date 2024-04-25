import { Pipe, PipeTransform } from "@angular/core";
import { VacancyResponse } from "../../intefaces/jobseeker-responsive-vacancy";

@Pipe({
  name: 'isVacancyHasNewResponse',
  standalone: true
})

export class IsVacancyHasNewResponsePipe implements PipeTransform {
  transform(vacanciesResponses: VacancyResponse[] | null, vacancyId: number | undefined): boolean {
    if (!vacanciesResponses || !vacancyId) {
      return false;
    }
    return vacanciesResponses.some(vacancyResponse => vacancyResponse.vacancyId === vacancyId);
  }
}
