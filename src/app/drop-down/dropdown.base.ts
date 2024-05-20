
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
      
  @Output() onValueChange: EventEmitter<number | string> = new EventEmitter();
      
  get value(): number | string {
    return this._value;
  }
  
  set value(value: number | string) {
    this._value = value;
  }

  
  private _value: number | string = '';
  private _items: Array<ItemsDataModel> | Array<object> = [];

  constructor(public changeDetector: ChangeDetectorRef) {
    const cd = 200;
  }

  onTouche: Function = () => {};
  onChange: Function = (_: number | string) => {};

  writeValue(value: number | string): void {
    if (value !== undefined && this.value !== value) {
      this.value = value;
    }
    this.changeDetector.markForCheck();
  }

  registerOnChange(fn: (value: number | string) => void): void {
      this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
      this.onTouche = fn;
  }

  setDisabledState(isDisable: boolean): void {
      this.disabled = isDisable;
      this.changeDetector.markForCheck();
  }

  onModelChange(value: number | string) {
    this.onChange(value);
    this.onTouche(value);
    this.onValueChange.emit(value);
  }
}

