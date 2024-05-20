
import { ChangeDetectorRef, Directive, EventEmitter, Input, Output } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { ItemsDataModel } from './dropdown.interface';

@Directive({})
export class DropDownBase implements ControlValueAccessor {
  @Input() keyFieldName = 'Key';
  @Input() valueFieldName = 'Value';
  @Input() disabled = false;
  
  @Input() get items(): Array<ItemsDataModel> | Array<object> {
    return this._items;
  }
  
  set items(value: Array<ItemsDataModel> | Array<object>) {
    this._items = value;
  }
      
  @Output() onValueChange: EventEmitter<string> = new EventEmitter();
    
  
  get value(): string {
    return this._value;
  }
  
  set value(value: string) {
    this._value = value;
  }

  
  private _value: string = '';
  private _items: Array<ItemsDataModel> | Array<object> = [];

  constructor(public changeDetector: ChangeDetectorRef) {}

  onTouche: Function = () => {};
  onChange: Function = (_: string) => {};

  writeValue(value: string): void {
    if (value !== undefined && this.value !== value) {
      this.value = value;
    }
    this.changeDetector.markForCheck();
  }

  registerOnChange(fn: (value: string) => void): void {
      this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
      this.onTouche = fn;
  }

  setDisabledState(isDisable: boolean): void {
      this.disabled = isDisable;
      this.changeDetector.markForCheck();
  }

  onModelChange(value: any) {
    this.onChange(value);
    this.onTouche(value);
    this.onValueChange.emit(value);
  }
}

