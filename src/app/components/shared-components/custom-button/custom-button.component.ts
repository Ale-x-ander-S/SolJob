import { Component, Input } from "@angular/core";
import { NgStyle } from "@angular/common";

@Component({
  selector: "app-custom-button",
  standalone: true,
  imports: [
    NgStyle
  ],
  templateUrl: "./custom-button.component.html",
  styleUrl: "./custom-button.component.scss"
})

export class CustomButtonComponent {
  @Input() backgroundColor: string = "$green-color";
  @Input() textColor: string = "#ffffff";
  @Input() borderColor: string = "transparent";
  @Input() borderWidth: string = "1px";
  @Input() boxShadow: string = "";
  @Input() padding: string = ""
  @Input() disabled: boolean = false;
  @Input() hasIndicator: boolean = false;
}
