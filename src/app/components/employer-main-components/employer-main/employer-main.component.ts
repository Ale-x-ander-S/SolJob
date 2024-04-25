import { Component } from '@angular/core';
import { EmployerNavigationPanelComponent } from "../employer-navigation-panel/employer-navigation-panel.component";

@Component({
  selector: 'app-employer-main',
  standalone: true,
  imports: [
    EmployerNavigationPanelComponent
  ],
  templateUrl: './employer-main.component.html',
  styleUrl: './employer-main.component.scss'
})
export class EmployerMainComponent {

}
