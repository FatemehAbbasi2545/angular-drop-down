import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, Output, ViewChild, forwardRef, signal } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DropDownBase } from './dropdown.base';
import { DropdownOutputModel, ListItemModel } from './dropdown.interface';
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
  displayValue: number | string = '';
  overlayVisible = false;  
  //focusedOptionIndex = signal<number>(-1);

  override ngAfterWriteValue(): void {
    if (this.value) {
      this.setSelectedItem();
      this.updateDisplayValue();
    }
  }

  getOptionDisplayValue(option: ListItemModel): number | string {    
    return ObjectUtil.accessPropertyValue(option, this.displayPropertyName);    
  }

  setSelectedItem(option?: ListItemModel): void {
    if (option) {
      this.selectedItem = option;
      return;
    }

    if (this.value) {      
      this.dataList.subscribe((items: Array<ListItemModel>) => {
        this.selectedItem = items.find((x) => {
          return x[this.keyPropertyName as keyof typeof x ] === this.value;
        }) || {} as ListItemModel;
      })    
    }
  }

  onTriggerClick(event: MouseEvent): void {
    if (this.disabled) return;
    if (this.overlayVisible) {
      this.hide();
      return;
    }
    this.show();
  }  
  
  onOptionSelect(option: ListItemModel): void {
    if (!this.isSelected(option)) {
      this.setSelectedItem(option);
      const value = this.getOptionValue(option);
      if (value != null) {
        this.updateModel(value); 
        this.updateDisplayValue(option);
        this.onModelChange.emit(
          { key: value, title: this.displayValue, item: this.selectedItem } as DropdownOutputModel
        );          
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

  private isSelected(option: ListItemModel): boolean {
    return this.isValidOption(option) && this.isOptionValueEqualsModelValue(option);
  }

  private isValidOption(option: ListItemModel): boolean {
    return option !== undefined && option !== null;
  }

  private isValidSelectedOption(option: ListItemModel): boolean {
    return this.isValidOption(option) && this.isSelected(option);
  }

  private isOptionValueEqualsModelValue(option: ListItemModel):boolean {
    return ObjectUtil.equals(this.selectedItem, option, this.keyPropertyName);
  }

  private getOptionValue(option: ListItemModel): number | string {    
    return ObjectUtil.accessPropertyValue(option, this.keyPropertyName);    
  }

  private updateDisplayValue(option?: ListItemModel): void {   
    this.displayValue = this.getOptionDisplayValue(option || this.selectedItem);
  }
}
