import { AfterViewChecked, Component, ElementRef, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Vacancy } from "../../../models/vacancy.model";
import { Select, Store } from "@ngxs/store";
import { JobseekerState } from "../../../states/jobseeker-state";
import { Observable } from "rxjs";
import { AsyncPipe } from "@angular/common";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { EXPERIENCE_LEVELS } from "../../../constans/experience-level.constant";
import { EMPLOYMENT_TYPES } from "../../../constans/employment-type.constant";
import { WORK_SCHEDULES } from "../../../constans/work-schedule.constant";
import { CustomButtonComponent } from "../../shared-components/custom-button/custom-button.component";
import { NgxsFormPluginModule, UpdateFormValue } from "@ngxs/form-plugin";
import { RouterLink } from "@angular/router";
import { ControlValidationService } from "../../../services/control-validation.service";
import { DeleteVacancy, UpdateVacancy } from "../../../states/actions";
import { EDUCATION_TYPES } from "../../../constans/education-type.constant";

@Component({
  selector: 'app-employer-vacancy-edit',
  standalone: true,
  imports: [
    AsyncPipe,
    ReactiveFormsModule,
    CustomButtonComponent,
    NgxsFormPluginModule,
    RouterLink
  ],
  templateUrl: './employer-vacancy-edit.component.html',
  styleUrl: './employer-vacancy-edit.component.scss'
})
export class EmployerVacancyEditComponent implements AfterViewChecked, OnDestroy {
  private store = inject(Store);
  private controlValidationService = inject(ControlValidationService);
  protected readonly experienceLevels = EXPERIENCE_LEVELS;
  protected readonly employmentTypes = EMPLOYMENT_TYPES;
  protected readonly workSchedules = WORK_SCHEDULES;
  protected readonly educationTypes = EDUCATION_TYPES;
  validationErrorMessage: string | undefined;
  isDeleteButtonSelected = false;

  editingVacancyForm = new FormGroup({
    professionSpecialization: new FormControl(""),
    expectedIncomePerMonthFrom: new FormControl("", [Validators.required]),
    expectedIncomePerMonthTo: new FormControl(""),
    workExperienceId: new FormControl(0, [Validators.required]),
    employmentTypeId: new FormControl(0, [Validators.required]),
    workScheduleId: new FormControl(0, [Validators.required]),
    educationTypeId: new FormControl(0),
    aboutVacancy: new FormControl("")
  });

  @Select(JobseekerState.vacancyToEdit)
  vacancyToEdit$: Observable<Vacancy> | undefined;

  @Select(JobseekerState.isLoading)
  isLoading$: Observable<boolean> | undefined;

  @ViewChild('errorMessage') errorMessageElement: ElementRef | undefined;

  get expectedIncomePerMonthFromControl() {
    return this.editingVacancyForm.get("expectedIncomePerMonthFrom") as FormControl;
  }

  get expectedIncomePerMonthToControl() {
    return this.editingVacancyForm.get("expectedIncomePerMonthTo") as FormControl;
  }

  private validateExpectedIncomeControls() {
    this.validationErrorMessage = this.controlValidationService.getIncomeValidationErrorMessage(
      this.expectedIncomePerMonthFromControl,
      this.expectedIncomePerMonthToControl
    )
  }

  private scrollToError() {
    if (this.errorMessageElement && this.errorMessageElement.nativeElement) {
      this.errorMessageElement.nativeElement.scrollIntoView({behavior: 'smooth', block: 'center'});
    }
  }

  private clearEditingVacancyForm() {
    this.store.dispatch(new UpdateFormValue({value: undefined, path: 'editingVacancyForm'}))
  }

  updateVacancy() {
    this.validateExpectedIncomeControls();
    if (!this.validationErrorMessage && this.editingVacancyForm.touched) {
      this.store.dispatch(new UpdateVacancy());
      this.editingVacancyForm.markAsUntouched();
    }
  }

  deleteVacancy() {
    this.isDeleteButtonSelected = true;
    this.store.dispatch(new DeleteVacancy());
    this.isDeleteButtonSelected = false;
  }

  ngAfterViewChecked() {
    this.scrollToError();
  }

  ngOnDestroy() {
    this.clearEditingVacancyForm();
  }
}
