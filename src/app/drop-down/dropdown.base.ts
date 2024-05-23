
import { ChangeDetectorRef, Directive, EventEmitter, Input, Output } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { DropdownOutputModel, ListItemModel } from './dropdown.interface';
import { Observable } from 'rxjs';

@Directive({})
export class DropDownBase implements ControlValueAccessor {
  @Input() keyPropertyName: string = 'Key';
  @Input() displayPropertyName: string = 'Value';
  @Input() disabled: boolean = false;
  
  @Input() get dataList(): Observable<Array<ListItemModel>> {
    return this._dataList$;
  }
  
  set dataList(value: Observable<Array<ListItemModel>>) {
    this._dataList$ = value;
  }
      
  @Output() onModelChange: EventEmitter<DropdownOutputModel> = new EventEmitter();

  get value(): number | string {
    return this._value;
  }
  
  set value(value: number | string) {
    this._value = value;
  }

  private _value: number | string = '';
  private _dataList$: Observable<Array<ListItemModel>> = new Observable;

  selectedItem: ListItemModel = {} as ListItemModel;  

  constructor(public changeDetector: ChangeDetectorRef) {
    const cd = 200;
  }

  onTouche: Function = () => {};
  onChange: Function = (_: number | string) => {};

  writeValue(value: number | string): void {
    if (value !== undefined && this.value !== value) {
      this.value = value;
      this.ngAfterWriteValue();
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

  updateModel(value: number | string): void {
    this.value = value;
    this.onChange(value);
    this.onTouche();  
  }

  ngAfterWriteValue(): void {}
}

