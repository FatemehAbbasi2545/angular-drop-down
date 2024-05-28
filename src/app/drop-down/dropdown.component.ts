import { AfterViewChecked, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnDestroy, Output, ViewChild, forwardRef, signal } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DropDownBase } from './dropdown.base';
import { DropdownOutputModel, ListItemModel } from './dropdown.interface';
import { ObjectUtil } from './../utils/object.util';
import { DomUtil } from './../utils/dom.util';

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
export class DropDownComponent extends DropDownBase implements AfterViewChecked {
  @ViewChild('input') inputElementRef!: ElementRef;
  @ViewChild('listItems') listItemsElementRef!: ElementRef;

  overlayVisible = false;
  displayValue: number | string | null = '';
  focusedOptionId : number | string | null = null;
  
  get selectedItem() {
    return this._selectedItem;
  }
  
  set selectedItem(value: ListItemModel | null) {
    this._selectedItem = value;
    if (value) {
      const optionValue = this.getOptionValue(value);
      this.focusedOptionId = `${optionValue}` || null;
    } else {
      this.focusedOptionId = null;
    }
  }

  _selectedItem: ListItemModel | null = null;
  
  ngAfterViewChecked(): void {
    this.scrollInView();          
  }  

  override ngAfterWriteValue(): void {
    if (this.value) {
      this.setSelectedItem();
      this.updateDisplayValue();
    }
  }  

  setSelectedItem(option?: ListItemModel): void {
    if (option) {
      this.selectedItem = option;      
      return;
    }

    if (this.value) {      
      this.dataList.subscribe((items: Array<ListItemModel>) => {
        this.selectedItem = items.find((x) => {
          return x[this.keyPropertyName as keyof typeof x] === this.value;
        }) || null;
      })    
    }
  }

  getOptionId(option: ListItemModel, index: number = -1): string {
    const value = this.getOptionValue(option);
    return value == null ? `option_${index}` : `${value}`;
  }

  getOptionDisplayValue(option: ListItemModel | null): number | string | null {   
    return ObjectUtil.accessPropertyValue(option, this.displayPropertyName);    
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
          { key: this.value, title: this.displayValue, item: this.selectedItem } as DropdownOutputModel
        );
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
    }   
  }

  private show(): void {
    if (this.overlayVisible || this.disabled) return;
    this.overlayVisible = true;
    this.inputElementRef?.nativeElement.focus();
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

  private isOptionValueEqualsModelValue(option: ListItemModel):boolean {
    return ObjectUtil.equals(this.selectedItem, option, this.keyPropertyName);
  }

  private getOptionValue(option: ListItemModel): number | string | null {    
    return ObjectUtil.accessPropertyValue(option, this.keyPropertyName);   
  }

  private updateDisplayValue(option?: ListItemModel): void {   
    this.displayValue = this.getOptionDisplayValue(option || this.selectedItem);
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
    this.clear();
    this.overlayVisible && this.hide();        
    event.preventDefault();
    event.stopPropagation();
  }

  private clear() {
    this.updateModel(null); 
    this.displayValue = null;
    this.selectedItem = null;
    this.onModelChange.emit(null);
  }

  private scrollInView() {
    if (!this.focusedOptionId) return;    
    if (this.listItemsElementRef && this.listItemsElementRef.nativeElement) {
      const element = DomUtil.findSingle(this.listItemsElementRef.nativeElement, `li[id="${this.focusedOptionId}"]`);
      if (element) {        
          element.scrollIntoView && element.scrollIntoView({ block: 'nearest', inline: 'nearest' });
      }
    }
  }  
}
