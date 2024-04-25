import { Pipe, PipeTransform } from '@angular/core';
import { EXPERIENCE_LEVELS } from "../../constans/experience-level.constant";
import { EMPLOYMENT_TYPES } from "../../constans/employment-type.constant";
import { WORK_SCHEDULES } from "../../constans/work-schedule.constant";
import { EDUCATION_TYPES } from "../../constans/education-type.constant";

@Pipe({
  standalone: true,
  name: "nameById"
})
export class NameByIdPipe implements PipeTransform {
  transform(id: number, constantName: string): string {
    let constant;
    switch (constantName) {
      case "EXPERIENCE_LEVELS":
        constant = EXPERIENCE_LEVELS;
        break;
      case "EMPLOYMENT_TYPES":
        constant = EMPLOYMENT_TYPES;
        break;
      case "WORK_SCHEDULES":
        constant = WORK_SCHEDULES;
        break;
      case "EDUCATION_TYPES":
        constant = EDUCATION_TYPES;
        break;
      default:
        return "";
    }

    const item = constant.find(item => item.id === id);
    return item ? item.name : "";
  }
}
