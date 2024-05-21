import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, Output, ViewChild, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DropDownBase } from './dropdown.base';

@Component({
  selector: 'dropdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DropDownComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush  
})
export class DropDownComponent extends DropDownBase {

  @ViewChild('container') containerElementRef!: ElementRef;
  @ViewChild('input') inputElementRef!: ElementRef;
  @ViewChild('overlay') overlayElementRef!: ElementRef;

  overlayVisible = false;

  onTriggerClick(event: MouseEvent) {
    if (this.disabled) return;
    if (this.overlayVisible) {
      this.hide();
      return;
    }
    this.show();
  }

  show() {
    if (this.overlayVisible || this.disabled) return;
    this.overlayVisible = true;
  }

  hide() {
    if (!this.overlayVisible || this.disabled) return;
    this.overlayVisible = false;
    this.changeDetector.markForCheck();  
    this.onTouche();
  }
}
