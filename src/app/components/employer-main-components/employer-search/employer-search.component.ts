import { Component, inject, ViewChild } from '@angular/core';
import { EmployerNavigationPanelComponent } from "../employer-navigation-panel/employer-navigation-panel.component";
import { AsyncPipe } from "@angular/common";
import { CustomButtonComponent } from "../../shared-components/custom-button/custom-button.component";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import {
    JobseekerVacancyListComponent
} from "../../jobseeker-main-components/jobseeker-vacancy-list/jobseeker-vacancy-list.component";
import { MatAutocomplete, MatAutocompleteTrigger, MatOption } from "@angular/material/autocomplete";
import { NameByIdPipe } from "../../../services/pipes/name-by-id.pipe";
import { NgxsFormPluginModule, UpdateFormValue } from "@ngxs/form-plugin";
import { ProfessionFilterPipe } from "../../../services/pipes/profession-filter.pipe";
import { animate, state, style, transition, trigger } from "@angular/animations";
import { Select, Store } from "@ngxs/store";
import { WORK_SCHEDULES } from "../../../constans/work-schedule.constant";
import { EMPLOYMENT_TYPES } from "../../../constans/employment-type.constant";
import { EXPERIENCE_LEVELS } from "../../../constans/experience-level.constant";
import { EDUCATION_TYPES } from "../../../constans/education-type.constant";
import { JobseekerState } from "../../../states/jobseeker-state";
import { Observable } from "rxjs";
import { Profession } from "../../../intefaces/profession.interface";
import { Vacancy } from "../../../models/vacancy.model";
import { SearchSettings } from "../../../intefaces/search-settings.interface";
import { ClearSearchingVacancies, LoadSearchingVacancies } from "../../../states/actions";
import { DisableControlDirective } from "../../../directives/disable-control.directive";
import { NgbCollapse } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-employer-search',
  standalone: true,
  imports: [
    EmployerNavigationPanelComponent,
    AsyncPipe,
    CustomButtonComponent,
    FormsModule,
    JobseekerVacancyListComponent,
    MatAutocomplete,
    MatAutocompleteTrigger,
    MatOption,
    NameByIdPipe,
    NgxsFormPluginModule,
    ProfessionFilterPipe,
    ReactiveFormsModule,
    DisableControlDirective,
    NgbCollapse
  ],
  templateUrl: './employer-search.component.html',
  styleUrl: './employer-search.component.scss',
  animations: [
    trigger('fadeInOut', [
      state('in', style({ opacity: 1, visibility: 'visible' })),
      transition('void => *', [style({ opacity: 0, visibility: 'hidden' }), animate('0.3s 0.3s')]),
      transition('* => void', [animate('0s', style({ opacity: 0, visibility: 'hidden' }))])
    ])
  ]
})

export class EmployerSearchComponent {
  private store = inject(Store);
  protected readonly workSchedules = WORK_SCHEDULES;
  protected readonly employmentTypes = EMPLOYMENT_TYPES;
  protected readonly experienceLevels = EXPERIENCE_LEVELS;
  protected readonly educationTypes = EDUCATION_TYPES;

  isSearchSettingOpenFlag = true;
  showContent = false;

  searchSettingsForm = new FormGroup({
    searchTerm: new FormControl(null),
    workScheduleId: new FormControl(null),
    experienceLevelId: new FormControl(null),
    employmentTypeId: new FormControl(null),
    educationTypeId: new FormControl(null)
  });

  @ViewChild(MatAutocompleteTrigger) autocomplete!: MatAutocompleteTrigger;

  @Select(JobseekerState.professions)
  professions$: Observable<Profession[]> | undefined;

  @Select(JobseekerState.searchResultsVacancies)
  searchResultsVacancies$: Observable<Vacancy[]> | undefined;

  @Select(JobseekerState.isLoading)
  isLoading$: Observable<boolean> | undefined;

  get searchTermControl() {
    return this.searchSettingsForm.get("searchTerm") as FormControl;
  }
  get workScheduleIdControl() {
    return this.searchSettingsForm.get("workScheduleId") as FormControl;
  }
  get experienceLevelIdControl() {
    return this.searchSettingsForm.get("experienceLevelId") as FormControl;
  }
  get employmentTypeIdControl() {
    return this.searchSettingsForm.get("employmentTypeId") as FormControl;
  }
  get educationTypeIdControl() {
    return this.searchSettingsForm.get("educationTypeId") as FormControl;
  }

  toggleSearchSettingsFlag() {
    this.isSearchSettingOpenFlag = !this.isSearchSettingOpenFlag;
  }

  private isSearchSettingsExist(searchSettingsFrom: SearchSettings): boolean {
    return Object.values(searchSettingsFrom).some(value => !!value);
  }

  getSearchingVacancies(profession?: Profession) {
    const searchSettingsForm: SearchSettings = this.store.selectSnapshot(state => state.searchSettingsForm).model;
    if (profession) {
      searchSettingsForm.searchTerm = profession.professionName;
      this.store.dispatch(new UpdateFormValue({value: searchSettingsForm, path: "searchSettingsForm"}))
    }
    if (this.isSearchSettingsExist(searchSettingsForm)) {
      this.store.dispatch(new LoadSearchingVacancies());
    } else {
      this.clearSearch();
    }
    this.autocomplete.closePanel();

    if (!this.isSearchSettingOpenFlag) {
      this.toggleSearchSettingsFlag();
    }
  }

  clearSearch() {
    this.searchTermControl.reset();
    this.store.dispatch(new ClearSearchingVacancies());
  }

  resetSearchFilters() {
    this.searchSettingsForm.reset();
  }

  resetFilter(filterControl: FormControl) {
    filterControl.reset();
  }
}
