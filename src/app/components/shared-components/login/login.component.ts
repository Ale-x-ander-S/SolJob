import { Component, inject, OnDestroy } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { MatTab, MatTabGroup, MatTabLabel } from "@angular/material/tabs";
import { MatIcon } from "@angular/material/icon";
import { CommonModule, NgIf } from "@angular/common";
import { MatButton } from "@angular/material/button";
import { FormControl, ReactiveFormsModule, Validators } from "@angular/forms";
import { Select, Store } from "@ngxs/store";
import { buildUserLoginInfo, UserLoginInfo } from "../../../models/user-login-info.model";
import { EMPLOYER, JOBSEEKER } from "../../../constans/user-type.constant";
import { ClearServerErrorMessage, Login } from "../../../states/actions";
import { JobseekerState } from "../../../states/jobseeker-state";
import { Observable } from "rxjs";
import { CustomButtonComponent } from "../custom-button/custom-button.component";

@Component({
  selector: 'app-login',
  standalone: true,
    imports: [
        CommonModule,
        RouterLink,
        MatTabGroup,
        MatTab,
        MatIcon,
        MatTabLabel,
        NgIf,
        MatButton,
        ReactiveFormsModule,
        CustomButtonComponent
    ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})

export class LoginComponent implements OnDestroy{
  readonly emailControl: FormControl<string | null> = new FormControl("", Validators.required);
  readonly passwordControl: FormControl<string | null> = new FormControl("", Validators.required);

  private router: Router = inject(Router);
  private store: Store = inject(Store);

  @Select(JobseekerState.serverErrorMessage)
  serverErrorMessage$: Observable<string> | undefined;

  @Select(JobseekerState.isLoading)
  isLoading$: Observable<boolean> | undefined;

  private get isCurrentRouteJobseeker(): boolean {
    return this.router.url.includes("jobseeker");
  }

  private get userType(): number {
    return this.isCurrentRouteJobseeker ? JOBSEEKER : EMPLOYER;
  }

  get generateRegistrationLink(): string {
    const navigatedUser = this.isCurrentRouteJobseeker ? "jobseeker" : "employer";
    return `/${navigatedUser}/registration`;
  }
  loginUser() {
    if (this.emailControl.valid && this.passwordControl.valid) {
      const userLoginInfo: UserLoginInfo = buildUserLoginInfo({
        email: this.emailControl.value,
        password: this.passwordControl.value,
        userType: this.userType
      });
      this.store.dispatch(new Login(userLoginInfo));
    }
  }

  resetErrorMessage() {
    this.store.dispatch(new ClearServerErrorMessage());
  }

  ngOnDestroy() {
    this.resetErrorMessage();
  }
}
