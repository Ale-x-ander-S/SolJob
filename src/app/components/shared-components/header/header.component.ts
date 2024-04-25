import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from "@angular/router";
import { AsyncPipe, NgIf } from "@angular/common";
import { Select, Store } from "@ngxs/store";
import { JobseekerState } from "../../../states/jobseeker-state";
import { Observable } from "rxjs";
import { ToggleStartPageType } from "../../../states/actions";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    AsyncPipe,
    NgIf
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class HeaderComponent {
  private store = inject(Store);

  @Select(JobseekerState.isJobseekerStartPage)
  isJobseekerStartPage$: Observable<boolean> | undefined;

  toggleStartPageType() {
    this.store.dispatch(new ToggleStartPageType());
  }
}
