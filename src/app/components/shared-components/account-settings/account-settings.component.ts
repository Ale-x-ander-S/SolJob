import { Component, inject, OnInit } from '@angular/core';
import { JobseekerNavigationPanelComponent } from "../../jobseeker-main-components/jobseeker-navigation-panel/jobseeker-navigation-panel.component";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButton } from "@angular/material/button";
import { Select, Store } from "@ngxs/store";
import { JobseekerState } from "../../../states/jobseeker-state";
import { Observable } from "rxjs";
import { buildUserInfo, UserInfo } from "../../../models/user-info.model";
import { AsyncPipe, NgClass } from "@angular/common";
import { ControlValidationService } from "../../../services/control-validation.service";
import { ClearServerErrorMessage, DeleteUser, UpdateUserInfo } from "../../../states/actions";
import { CustomButtonComponent } from "../custom-button/custom-button.component";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-account-settings',
  standalone: true,
  imports: [
    JobseekerNavigationPanelComponent,
    FormsModule,
    ReactiveFormsModule,
    MatButton,
    AsyncPipe,
    NgClass,
    CustomButtonComponent,
    RouterLink
  ],
  templateUrl: './account-settings.component.html',
  styleUrl: './account-settings.component.scss'
})

export class AccountSettingsComponent implements OnInit {
  private controlValidationService = inject(ControlValidationService);
  private store = inject(Store);

  editMode = false;
  activeField: "userName" | "email" | "password" | "phoneNumber" | "delete" | undefined = undefined;
  validationErrorMessage: string | undefined;

  userNameForm = new FormGroup({
    firstName: new FormControl("", [Validators.required]),
    lastName: new FormControl(""),
    middleName: new FormControl(""),
  });

  userEmailForm = new FormGroup({
    password: new FormControl("", [Validators.required]),
    email: new FormControl("", [Validators.required, Validators.email])
  });

  userPhoneNumberForm = new FormGroup({
    password: new FormControl("", [Validators.required]),
    phoneNumber: new FormControl("", [Validators.required, Validators.max(11)])
  });

  userPasswordForm = new FormGroup({
    password: new FormControl("", [Validators.required]),
    newPassword: new FormControl("", [Validators.required, Validators.minLength(6)]),
    repeatNewPassword: new FormControl("")
  });

  deleteAccountForm = new FormGroup({
    password: new FormControl("", [Validators.required]),
  });

  @Select(JobseekerState.userInfo)
  userInfo$: Observable<UserInfo> | undefined;

  @Select(JobseekerState.serverErrorMessage)
  serverErrorMessage$: Observable<string> | undefined;

  @Select(JobseekerState.isLoading)
  isLoading$: Observable<boolean> | undefined;

  ngOnInit(): void {
    this.userInfo$?.subscribe(userInfo => {
      if (userInfo) {
        this.userNameForm.patchValue({
          firstName: userInfo.firstName,
          lastName: userInfo.lastName,
          middleName: userInfo.middleName
        });
      }
    });
  }

  clearErrorMessagesAndForm(field: "userName" | "email" | "password" | "phoneNumber" | "delete" | undefined) {
    this.validationErrorMessage = undefined;
    this.store.dispatch(new ClearServerErrorMessage());
    switch (field) {
      case "email":
        this.userEmailForm.reset();
        break;
      case "password":
        this.userPasswordForm.reset();
        break;
      case "phoneNumber":
        this.userPhoneNumberForm.reset();
        break;
      case "delete":
        this.deleteAccountForm.reset();
        break;
      default:
        return;
    }

  }

  toggleEditMode(field: "userName" | "email" | "password" | "phoneNumber" | "delete" | undefined): void {
    this.editMode = !this.editMode;
    this.activeField = field;
    this.clearErrorMessagesAndForm(field);
  }

  setValidationErrorMessage(): string | undefined {
    switch (this.activeField) {
      case "userName":
        return this.controlValidationService.getFirstNameValidationErrorMessage(this.userNameForm.get("firstName") as FormControl);
      case "email":
        return this.controlValidationService.getEmailValidationErrorMessage(this.userEmailForm.get("email") as FormControl);
      case "password":
        return this.controlValidationService.getPasswordValidationErrorMessageOrMatchError(
          this.userPasswordForm.get("newPassword") as FormControl,
          this.userPasswordForm.get("repeatNewPassword") as FormControl
        );
      case "phoneNumber":
        return this.controlValidationService.getPhoneNumberValidationErrorMessage(this.userPhoneNumberForm.get("phoneNumber") as FormControl);
      case "delete":
        return this.controlValidationService.getPasswordValidationErrorMessage(this.deleteAccountForm.get("password") as FormControl);
      default:
        return undefined;
    }
  }

  updateUserInfo() {
    this.validationErrorMessage = this.setValidationErrorMessage();
    if (!this.validationErrorMessage) {
      const formMap: { [key: string]: FormGroup } = {
        userName: this.userNameForm,
        email: this.userEmailForm,
        password: this.userPasswordForm,
        phoneNumber: this.userPhoneNumberForm
      };

      if (this.activeField) {
        const userFormToUpdate = formMap[this.activeField];
        this.store.dispatch(new UpdateUserInfo(buildUserInfo(userFormToUpdate)));
      }
    }
  }

  deleteUser() {
    const isPasswordControlField = this.deleteAccountForm.get("password")?.errors?.["required"];
    if (!isPasswordControlField) {
      this.store.dispatch(new DeleteUser(buildUserInfo(this.deleteAccountForm)));
    }
  }

  get formattedPhoneNumber() {
    const pattern = /^(\+\d{1})(\d{3})(\d{3})(\d{2})(\d{2})$/;
    let phoneNumber = this.userPhoneNumberForm.get("phoneNumber")?.value;
    if (phoneNumber && !phoneNumber.startsWith('+7')) {
      phoneNumber = '+7' + phoneNumber;
    }
    phoneNumber = phoneNumber ? phoneNumber.replace(pattern, '$1 $2 $3 $4 $5') : "";
    return phoneNumber;
  }

}
