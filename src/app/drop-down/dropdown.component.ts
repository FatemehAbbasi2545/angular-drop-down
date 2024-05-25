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
  displayValue: number | string | null = '';
  overlayVisible = false;

  @ViewChild('overlay') overlayElementRef!: ElementRef;

  override ngAfterWriteValue(): void {
    if (this.value) {
      this.setSelectedItem();
      this.updateDisplayValue();
    }
  }

  getOptionDisplayValue(option: ListItemModel | null): number | string | null {    
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
        }) || null;
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
        this.onModelChangeEmit();
      }                
    }
    this.hide();
  }

  onKeyDown(event: KeyboardEvent): void {
    if (this.disabled) {
        return;
    }

    switch (event.code) {
      case 'Enter':
      case 'NumpadEnter':
        this.onEnterKey(event)
        break;

      case 'ArrowDown':
        this.onArrowDownKey(event);
        break;

      case 'ArrowUp':
        this.onArrowUpKey(event);
        break;

      case 'Escape':
      case 'Tab':
        this.onEscapeKey(event);
        break;        
    }
  }

  onInputKeyDown(event: KeyboardEvent): void {
    if (this.disabled) return;

    if (event.code === 'Delete') {
      this.onDeleteKey(event);
      event.preventDefault();
      event.stopPropagation();
    }    
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

  private getOptionValue(option: ListItemModel): number | string | null {    
    return ObjectUtil.accessPropertyValue(option, this.keyPropertyName);    
  }

  private updateDisplayValue(option?: ListItemModel): void {   
    this.displayValue = this.getOptionDisplayValue(option || this.selectedItem);
  }

  private onModelChangeEmit() {
    this.onModelChange.emit(
      { key: this.value, title: this.displayValue, item: this.selectedItem } as DropdownOutputModel
    );
  }

  private onEnterKey(event: KeyboardEvent): void {
    if (!this.overlayVisible) {
      this.onArrowDownKey(event);
    } else {
      this.hide();
    }

    event.preventDefault();
  }

  private onArrowDownKey(event: KeyboardEvent) {
    if (!this.overlayVisible) {
      this.show();
    } else {
      //
    }

    event.preventDefault();
    event.stopPropagation();
  }

  private onArrowUpKey(event: KeyboardEvent) {
    if (this.overlayVisible) {
      //
    }

    event.preventDefault();
    event.stopPropagation();
  }

  private onEscapeKey(event: KeyboardEvent) {
    this.overlayVisible && this.hide();
    event.preventDefault();
  }

  private onDeleteKey(event: KeyboardEvent) {
    this.clear(event);
    this.overlayVisible && this.hide();
    event.preventDefault();
    event.stopPropagation();
  }

  private clear(event?: Event) {
    this.updateModel(null); 
    this.displayValue = null;
    this.selectedItem = null;
    this.onModelChangeEmit();
  }
}
