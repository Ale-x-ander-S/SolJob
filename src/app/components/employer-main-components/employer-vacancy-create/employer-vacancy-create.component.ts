import { Component, inject } from '@angular/core';
import { AsyncPipe } from "@angular/common";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import {
  JobseekerNavigationPanelComponent
} from "../../jobseeker-main-components/jobseeker-navigation-panel/jobseeker-navigation-panel.component";
import { MatAutocomplete, MatAutocompleteTrigger, MatOption } from "@angular/material/autocomplete";
import { MatButton } from "@angular/material/button";
import { MatRadioButton, MatRadioGroup } from "@angular/material/radio";
import { NgxsFormPluginModule } from "@ngxs/form-plugin";
import { EmployerNavigationPanelComponent } from "../employer-navigation-panel/employer-navigation-panel.component";
import { Select, Store } from "@ngxs/store";
import { JobseekerState } from "../../../states/jobseeker-state";
import { Observable } from "rxjs";
import { ProfessionFilterPipe } from "../../../services/pipes/profession-filter.pipe";
import { CreateProfession, CreateVacancy, DecrementStepIndex, IncrementStepIndex } from "../../../states/actions";
import { ControlValidationService } from "../../../services/control-validation.service";
import { EXPERIENCE_LEVELS } from "../../../constans/experience-level.constant";
import { EMPLOYMENT_TYPES } from "../../../constans/employment-type.constant";
import { WORK_SCHEDULES } from "../../../constans/work-schedule.constant";
import { CustomButtonComponent } from "../../shared-components/custom-button/custom-button.component";
import { RouterLink } from "@angular/router";
import { Profession } from "../../../intefaces/profession.interface";
import { EDUCATION_TYPES } from "../../../constans/education-type.constant";

@Component({
  selector: 'app-employer-vacancy-create',
  standalone: true,
  imports: [
    AsyncPipe,
    FormsModule,
    JobseekerNavigationPanelComponent,
    MatAutocomplete,
    MatAutocompleteTrigger,
    NgxsFormPluginModule,
    ReactiveFormsModule,
    EmployerNavigationPanelComponent,
    ProfessionFilterPipe,
    CustomButtonComponent,
    RouterLink,
    MatOption
  ],
  templateUrl: './employer-vacancy-create.component.html',
  styleUrl: './employer-vacancy-create.component.scss'
})
export class EmployerVacancyCreateComponent {
  validationErrorMessage: string | undefined;
  protected readonly experienceLevels = EXPERIENCE_LEVELS;
  protected readonly employmentTypes = EMPLOYMENT_TYPES;
  protected readonly workSchedules = WORK_SCHEDULES;
  protected readonly educationTypes = EDUCATION_TYPES;
  private store = inject(Store);
  private controlValidationService: ControlValidationService = inject(ControlValidationService);

  vacancyForm = new FormGroup({
    organizationName: new FormControl("", [Validators.required]),
    professionName: new FormControl("", [Validators.required]),
    professionSpecialization: new FormControl(""),
    expectedIncomePerMonthFrom: new FormControl("", [Validators.required]),
    expectedIncomePerMonthTo: new FormControl(""),
    workExperienceId: new FormControl("", [Validators.required]),
    employmentTypeId: new FormControl("", [Validators.required]),
    workScheduleId: new FormControl("", [Validators.required]),
    educationTypeId: new FormControl(""),
    aboutVacancy: new FormControl("", [Validators.required])
  });

  @Select(JobseekerState.stepIndex)
  stepIndex$: Observable<number> | undefined;

  @Select(JobseekerState.isLoading)
  isLoading$: Observable<boolean> | undefined;

  @Select(JobseekerState.professions)
  professions$: Observable<Profession[]> | undefined;

  get organizationNameControl(): FormControl {
    return this.vacancyForm.get('organizationName') as FormControl;
  }

  get professionNameControl(): FormControl {
    return this.vacancyForm.get('professionName') as FormControl;
  }

  get expectedIncomePerMonthFrom(): FormControl {
    return this.vacancyForm.get('expectedIncomePerMonthFrom') as FormControl;
  }

  get expectedIncomePerMonthTo(): FormControl {
    return this.vacancyForm.get('expectedIncomePerMonthTo') as FormControl;
  }

  get workExperienceIdControl(): FormControl {
    return this.vacancyForm.get('workExperienceId') as FormControl;
  }

  get employmentTypeIdControl(): FormControl {
    return this.vacancyForm.get('employmentTypeId') as FormControl;
  }

  get workScheduleIdControl(): FormControl {
    return this.vacancyForm.get('workScheduleId') as FormControl;
  }

  get aboutVacancyControl(): FormControl {
    return this.vacancyForm.get('aboutVacancy') as FormControl;
  }

  protected goToNextStep(currentStepNumber: number) {
    this.validateStepControls(currentStepNumber);
    if (!this.validationErrorMessage) {
      this.store.dispatch(new IncrementStepIndex());

      if (currentStepNumber === 2) {
        this.store.dispatch(new CreateProfession(this.professionNameControl.value));
      }
    }
  }

  private validateStepControls(stepIndex: number) {
    if (stepIndex === 1) {
      this.validationErrorMessage = this.organizationNameControl.errors?.["required"] ? "Заполните обязательное поле" : undefined;
    } else if (stepIndex === 2) {
      this.validationErrorMessage = this.professionNameControl.errors?.["required"] ? "Заполните обязательное поле" : undefined;
    } else if (stepIndex === 3) {
      this.validationErrorMessage = this.controlValidationService.getIncomeValidationErrorMessage(
        this.expectedIncomePerMonthFrom,
        this.expectedIncomePerMonthTo
      );
    } else if (stepIndex === 4) {
      this.validationErrorMessage = this.workExperienceIdControl.errors?.["required"] ? "Заполните обязательное поле" : undefined;
    } else if (stepIndex === 5) {
      this.validationErrorMessage = this.employmentTypeIdControl.errors?.["required"] ? "Заполните обязательное поле" : undefined;
    } else if (stepIndex === 6) {
      this.validationErrorMessage = this.workScheduleIdControl.errors?.["required"] ? "Заполните обязательное поле" : undefined;
    } else if (stepIndex === 7) {
      this.validationErrorMessage = this.aboutVacancyControl.errors?.["required"] ? "Заполните обязательное поле" : undefined;
    }
  }

  protected goToPreviousStep() {
    if (this.validationErrorMessage) {
      this.resetValidationErrorMessage();
    }
    this.store.dispatch(new DecrementStepIndex());
  }

  protected resetValidationErrorMessage() {
    this.validationErrorMessage = undefined;
  }

  protected createVacancy() {
    this.store.dispatch(new CreateVacancy());
  }

}
