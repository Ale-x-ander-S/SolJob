import { Component } from '@angular/core';
import { ReactiveFormsModule } from "@angular/forms";
import { RouterLink, RouterOutlet } from "@angular/router";
import { MatAnchor, MatButton } from "@angular/material/button";
import { HeaderComponent } from "../../shared-components/header/header.component";
import { CustomButtonComponent } from "../../shared-components/custom-button/custom-button.component";

@Component({
  selector: 'app-employer-start-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatButton,
    MatAnchor,
    HeaderComponent,
    RouterOutlet,
    CustomButtonComponent
  ],
  templateUrl: './employer-start-page.component.html',
  styleUrl: './employer-start-page.component.scss'
})

export class EmployerStartPageComponent {
}
