import { Profession } from "../../intefaces/profession.interface";
import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  standalone: true,
  name: 'professionFilter'
})

export class ProfessionFilterPipe implements PipeTransform {
  transform(professions: Profession[] | null, searchText: string | undefined): Profession[] | null {
    if (!professions || !searchText) {
      return null;
    }
    return professions.filter(profession =>
      profession.professionName.toLowerCase().includes(searchText.toLowerCase())
    ).slice(0, 5);
  }
}
