import { Component, inject, OnDestroy } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from "@angular/forms";
import { MatButton } from "@angular/material/button";
import { Router, RouterLink } from "@angular/router";
import { AsyncPipe, NgClass } from "@angular/common";
import { MatProgressBar } from "@angular/material/progress-bar";
import { NgxsFormPluginModule } from "@ngxs/form-plugin";
import { ClearServerErrorMessage, Registration } from "../../../states/actions";
import { Select, Store } from "@ngxs/store";
import { buildUserRegistrationInfo, UserRegistrationInfo } from "../../../models/user-registration-info.model";
import { EMPLOYER, JOBSEEKER } from "../../../constans/user-type.constant";
import { JobseekerState } from "../../../states/jobseeker-state";
import { Observable } from "rxjs";
import { ControlValidationService } from "../../../services/control-validation.service";
import { CustomButtonComponent } from "../custom-button/custom-button.component";

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [
    FormsModule,
    MatButton,
    ReactiveFormsModule,
    RouterLink,
    NgClass,
    MatProgressBar,
    AsyncPipe,
    NgxsFormPluginModule,
    CustomButtonComponent
  ],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss'
})

export class RegistrationComponent implements OnDestroy {
  emailValidationErrorMessage: string | undefined;
  firstNameValidationErrorMessage: string | undefined;
  passwordValidationErrorMessage: string | undefined;
  checkedPasswordValidationErrorMessage: string | undefined;
  isFirstRegistrationPart = true;

  private router = inject(Router);
  private store = inject(Store);
  private controlValidationService = inject(ControlValidationService);

  userRegistrationForm = new FormGroup({
    firstName: new FormControl("", [Validators.required]),
    email: new FormControl("", [Validators.required, Validators.email]),
    password: new FormControl("", [Validators.required, Validators.minLength(6)]),
    repeatedPassword: new FormControl(""),
  });

  @Select(JobseekerState.serverErrorMessage)
  serverErrorMessage$: Observable<string> | undefined;

  @Select(JobseekerState.isLoading)
  isLoading$: Observable<boolean> | undefined;

  get firstNameControl(): FormControl {
    return this.userRegistrationForm.get('firstName') as FormControl;
  }

  get emailControl(): FormControl {
    return this.userRegistrationForm.get('email') as FormControl;
  }

  get passwordControl(): FormControl {
    return this.userRegistrationForm.get('password') as FormControl;
  }

  get repeatedPasswordControl(): FormControl {
    return this.userRegistrationForm.get('repeatedPassword') as FormControl;
  }

  private resetPasswordControls() {
    if (this.passwordControl.value && this.repeatedPasswordControl.value) {
      this.passwordControl.reset();
      this.repeatedPasswordControl.reset();
    }
  }

  resetValidationErrorMessage(fieldName: string) {
    this.store.dispatch(new ClearServerErrorMessage());
    if (fieldName === 'email') {
      this.emailValidationErrorMessage = undefined;
    } else if (fieldName === 'firstName') {
      this.firstNameValidationErrorMessage = undefined;
    } else if (fieldName === 'password') {
      this.passwordValidationErrorMessage = undefined;
    } else if (fieldName === 'repeatPassword') {
      this.checkedPasswordValidationErrorMessage = undefined;
    }
  }

  toggleIsFirstRegistrationPart() {
    this.resetPasswordControls();
    this.isFirstRegistrationPart = !this.isFirstRegistrationPart;
  }

  isNameAndEmailControlsValid() {
    this.firstNameValidationErrorMessage = this.controlValidationService.getFirstNameValidationErrorMessage(this.firstNameControl);
    this.emailValidationErrorMessage = this.controlValidationService.getEmailValidationErrorMessage(this.emailControl);

    if (this.firstNameControl.valid && this.emailControl.valid) {
      this.toggleIsFirstRegistrationPart();
    }
  }

  get isUserEmployer(): boolean {
    return this.router.url.includes("employer");
  }

  private get userType(): number {
    return this.isUserEmployer ? EMPLOYER : JOBSEEKER;
  }

  get generateBackLink(): string {
    return this.isUserEmployer ? "employer" : "jobseeker";
  }

  registerUser() {
    this.passwordValidationErrorMessage = this.controlValidationService.getPasswordValidationErrorMessage(this.passwordControl);
    this.checkedPasswordValidationErrorMessage = this.controlValidationService.checkPasswordMatch(this.passwordControl, this.repeatedPasswordControl);

    if (this.userRegistrationForm.valid && !this.checkedPasswordValidationErrorMessage) {
      const userRegistrationInfo: UserRegistrationInfo = buildUserRegistrationInfo(this.userRegistrationForm.value, this.userType);
      this.store.dispatch(new Registration(userRegistrationInfo));
    }
  }

  ngOnDestroy() {
    this.store.dispatch(new ClearServerErrorMessage());
  }

}
