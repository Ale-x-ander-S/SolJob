import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable({
  providedIn: 'root'
})

export class NotificationService {
  private snackBar = inject(MatSnackBar);

  public showSuccessMessage(message: string): void {
    this.snackBar.open(message, "", {
      verticalPosition: "bottom",
      horizontalPosition: "center",
      duration: 3000,
    });
  }
}
