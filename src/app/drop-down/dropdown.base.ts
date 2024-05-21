
import { ChangeDetectorRef, Directive, EventEmitter, Input, Output } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { ItemsDataModel } from './dropdown.interface';
import { Observable } from 'rxjs';

@Directive({})
export class DropDownBase implements ControlValueAccessor {
  @Input() disabled: boolean = false;
  
  @Input() get dataItems(): Observable<Array<ItemsDataModel>> {
    return this._dataItems$;
  }
  
  set dataItems(value: Observable<Array<ItemsDataModel>>) {
    this._dataItems$ = value;
  }
      
  @Output() onValueChange: EventEmitter<number | string> = new EventEmitter();
      
  get value(): number | string {
    return this._value;
  }
  
  set value(value: number | string) {
    this._value = value;
  }

  
  private _value: number | string = '';
  private _dataItems$: Observable<Array<ItemsDataModel>> = new Observable;

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
    this.onTouche();
    this.onValueChange.emit(value);
  }
}

