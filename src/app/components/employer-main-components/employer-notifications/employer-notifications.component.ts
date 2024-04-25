import { Component } from '@angular/core';
import { EmployerNavigationPanelComponent } from "../employer-navigation-panel/employer-navigation-panel.component";

@Component({
  selector: 'app-employer-notifications',
  standalone: true,
    imports: [
        EmployerNavigationPanelComponent
    ],
  templateUrl: './employer-notifications.component.html',
  styleUrl: './employer-notifications.component.scss'
})
export class EmployerNotificationsComponent {

}
