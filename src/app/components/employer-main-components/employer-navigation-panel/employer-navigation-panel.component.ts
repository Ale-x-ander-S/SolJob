import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { TokenService } from "../../../services/token.service";
import { Select, Store } from "@ngxs/store";
import { JobseekerState } from "../../../states/jobseeker-state";
import { Observable } from "rxjs";
import { Resume } from "../../../models/resume.model";
import { ResetState } from "../../../states/actions";
import { AsyncPipe } from "@angular/common";
import { MatMenu, MatMenuItem, MatMenuTrigger } from "@angular/material/menu";

@Component({
  selector: 'app-employer-navigation-panel',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    AsyncPipe,
    MatMenu,
    MatMenuTrigger,
    MatMenuItem
  ],
  templateUrl: './employer-navigation-panel.component.html',
  styleUrl: './employer-navigation-panel.component.scss'
})
export class EmployerNavigationPanelComponent {
  private router = inject(Router);
  private tokenService = inject(TokenService);
  private store = inject(Store);

  readonly tokenUserData: {userId: number, userFirstName: string, userType: number} | undefined = this.tokenService.getTokenUserData();

  @Select(JobseekerState.resume)
  resume$: Observable<Resume> | undefined;

  logout() {
    this.tokenService.removeToken();
    this.store.dispatch(new ResetState());
    this.router.navigate(["/employer"]);
  }
}
