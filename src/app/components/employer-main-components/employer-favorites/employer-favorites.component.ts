import { Component } from '@angular/core';
import { EmployerNavigationPanelComponent } from "../employer-navigation-panel/employer-navigation-panel.component";

@Component({
  selector: 'app-employer-favorites',
  standalone: true,
    imports: [
        EmployerNavigationPanelComponent
    ],
  templateUrl: './employer-favorites.component.html',
  styleUrl: './employer-favorites.component.scss'
})
export class EmployerFavoritesComponent {


}
