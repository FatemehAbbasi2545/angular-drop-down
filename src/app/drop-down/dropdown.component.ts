import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, Output, ViewChild, forwardRef, signal } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DropDownBase } from './dropdown.base';
import { ListItemModel } from './dropdown.interface';
import { ObjectUtil } from '../utils/object.util';

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
  displayValue = '';
  overlayVisible = false;  
  //focusedOptionIndex = signal<number>(-1);

  getOptionDisplayValue(option: ListItemModel) {    
    return ObjectUtil.accessPropertyValue(option, this.displayPropertyName);    
  }

  onTriggerClick(event: MouseEvent) {
    if (this.disabled) return;
    if (this.overlayVisible) {
      this.hide();
      return;
    }
    this.show();
  }  
  
  onOptionSelect(option: ListItemModel): void {
    if (!this.isSelected(option)) {
      const value = this.getOptionValue(option);
      if (value != null) {
        this.updateModel(value);
        this.updateDisplayValue(option);
        //this.focusedOptionIndex.set(this.findSelectedOptionIndex());
      }                
    }
    this.hide();
  }

  private show(): void {
    if (this.overlayVisible || this.disabled) return;
    this.overlayVisible = true;
  }

  private hide(): void {
    if (!this.overlayVisible || this.disabled) return;
    this.overlayVisible = false;
    this.changeDetector.markForCheck();  
    this.onTouche();
  }

  private isSelected(option: ListItemModel) {
    return this.isValidOption(option) && this.isOptionValueEqualsModelValue(option);
  }

  private isValidOption(option: ListItemModel) {
    return option !== undefined && option !== null;
  }

  private isValidSelectedOption(option: ListItemModel) {
    return this.isValidOption(option) && this.isSelected(option);
  }

  private isOptionValueEqualsModelValue(option: ListItemModel) {
    return ObjectUtil.equals(this.selectedItem, option, this.keyPropertyName);
  }

  private getOptionValue(option: ListItemModel) {    
    return ObjectUtil.accessPropertyValue(option, this.keyPropertyName);    
  }

  private updateDisplayValue(option: ListItemModel) {    
    this.displayValue = this.getOptionDisplayValue(option);
  }
}
