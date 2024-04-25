import { Directive, inject, Input } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  standalone: true,
  selector: '[disableControl]'
})

export class DisableControlDirective {
  private ngControl = inject(NgControl);
  @Input() set disableControl( condition : boolean ) {
    const action = condition ? 'disable' : 'enable';
    if (this.ngControl.control) {
      this.ngControl.control[action]();
    }
  }
}
