
import { ChangeDetectorRef, Directive, EventEmitter, Input, Output, Renderer2 } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { DropdownOutputModel, ListItemModel } from './dropdown.interface';
import { Observable, of } from 'rxjs';

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
    value.subscribe((items: Array<ListItemModel>) => {
      this.listItems = items;
      this.visibleOptions = items;
      if (items.length > 0) {
        this.lastOptionIndex = items.length - 1;
      }      
      this.visibleOptions$ = of(items);
      if (this.value) {
        this.setSelectedItem();
      }
    }) 
  }
      
  @Output() onModelChange: EventEmitter<DropdownOutputModel | null> = new EventEmitter();    

  get value(): number | string | null {
    return this._value;
  }
  
  set value(value: number | string | null) {
    this._value = value;
  }

  get selectedItem() {
    return this._selectedItem;
  }
  
  set selectedItem(value: ListItemModel | null) {
    this._selectedItem = value;
  }

  private _value: number | string | null = '';
  private _dataList$: Observable<Array<ListItemModel>> = new Observable;  

  _selectedItem: ListItemModel | null = null; 
  
  listItems: Array<ListItemModel> = [];
  visibleOptions: Array<ListItemModel> = [];
  visibleOptions$: Observable<Array<ListItemModel>> = new Observable;
  displayValue: number | string | null = '';
  focusedOptionIndex: number = -1;
  lastOptionIndex: number = -1;
  filterValue: string = '';
  overlayVisible = false;

  constructor(public changeDetector: ChangeDetectorRef, public renderer: Renderer2) {}

  onTouche: Function = () => {};
  onChange: Function = (_: number | string | null) => {};

  writeValue(value: number | string | null): void {
    if (value !== undefined && this.value !== value) {
      this.value = value;
      this.ngAfterWriteValue();
    }
    this.changeDetector.markForCheck();
  }

  registerOnChange(fn: (value: number | string | null) => void): void {
      this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
      this.onTouche = fn;
  }

  setDisabledState(isDisable: boolean): void {
      this.disabled = isDisable;
      this.changeDetector.markForCheck();
  }

  updateModel(value: number | string | null): void {
    this.value = value;
    this.onChange(value);
    this.onTouche();
  }

  setSelectedItem(option?: ListItemModel): void {
    if (option) {
      this.selectedItem = option;      
      return;
    }

    if (this.value && this.listItems && this.listItems.length) {      
      this.selectedItem = this.listItems.find((x) => {
        return x[this.keyPropertyName as keyof typeof x] === this.value;
      }) || null;    
    }
  }

  ngAfterWriteValue(): void {}
}

