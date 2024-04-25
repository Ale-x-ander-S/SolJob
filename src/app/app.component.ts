import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./components/shared-components/header/header.component";
import { AsyncPipe, NgClass } from "@angular/common";
import { FooterComponent } from "./components/shared-components/footer/footer.component";
import {
  JobseekerNavigationPanelComponent
} from "./components/jobseeker-main-components/jobseeker-navigation-panel/jobseeker-navigation-panel.component";
import { JobseekerState } from "./states/jobseeker-state";
import { Select } from "@ngxs/store";
import { EMPLOYER, JOBSEEKER } from "./constans/user-type.constant";
import { Observable } from "rxjs";
import {
  EmployerNavigationPanelComponent
} from "./components/employer-main-components/employer-navigation-panel/employer-navigation-panel.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    NgClass,
    FooterComponent,
    JobseekerNavigationPanelComponent,
    AsyncPipe,
    EmployerNavigationPanelComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})

export class AppComponent {
  protected readonly JOBSEEKER = JOBSEEKER;
  protected readonly EMPLOYER = EMPLOYER;

  @Select(JobseekerState.currentUserType)
  currentUserType$: Observable<typeof JOBSEEKER | typeof EMPLOYER> | undefined;
}
