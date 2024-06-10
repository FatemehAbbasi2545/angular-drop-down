import { Directive, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { Observable } from 'rxjs';

import { UiComponent } from './ui.component';
import { SelectorOutputData, ListItem } from './selector.interface';
import { ObjectUtil } from './../../utils/object.util';

@Directive({})
export abstract class SelectorComponent extends UiComponent implements OnDestroy {
  @Input() keyPropertyName: string = 'Key';
  @Input() displayPropertyName: string = 'Value';
  
  @Input() get dataList(): Observable<Array<ListItem>> {
    return this._dataList$;
  }
  
  set dataList(value: Observable<Array<ListItem>>) {
    this._dataList$ = value;
    value.subscribe((items: Array<ListItem>) => {
      this.listItems = items;
      this.onDataListChange();      
    }) 
  }  
      
  @Output() onModelChange: EventEmitter<SelectorOutputData | null> = new EventEmitter(); 

  get selectedItem() {
    return this._selectedItem;
  }
  
  set selectedItem(value: ListItem | null) {
    this._selectedItem = value;
  }
  
  _selectedItem: ListItem | null = null;   

  listItems: Array<ListItem> = [];  
  documentClickEventListener: Function | null = null;
  documentKeyDownEventListener: Function | null = null;
  displayValue: number | string | null = '';
    
  private _dataList$: Observable<Array<ListItem>> = new Observable;

  ngOnDestroy(): void {
    this.unsubscribeDocumentClickEventListener();
    this.unsubscribeDocumentKeyDownEventListener();
  }

  override ngAfterWriteValue(): void {
    if (this.value) {
      this.setSelectedItem();
      this.updateDisplayValue();
    }
  }   

  getOptionDisplayValue(option: ListItem | null): number | string | null {   
    return ObjectUtil.accessPropertyValue(option, this.displayPropertyName);    
  }

  protected isSelected(option: ListItem): boolean {
    return this.isValidOption(option) && this.isOptionValueEqualsModelValue(option);
  }

  protected isValidOption(option: ListItem): boolean {
    return option !== undefined && option !== null;
  }

  protected isOptionValueEqualsModelValue(option: ListItem):boolean {
    return ObjectUtil.equals(this.selectedItem, option, this.keyPropertyName);
  }

  protected getOptionValue(option: ListItem): number | string | null {    
    return ObjectUtil.accessPropertyValue(option, this.keyPropertyName);   
  }

  protected setSelectedItem(option?: ListItem): void {
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

  protected updateDisplayValue(option?: ListItem): void {   
    this.displayValue = this.getOptionDisplayValue(option || this.selectedItem);
  }

  protected clear() {
    this.updateModel(null); 
    this.displayValue = null;
    this.selectedItem = null;
    this.onModelChange.emit(null);
  }

  protected subscribeDocumentClickEventListener() {
    if (this.documentClickEventListener) return;
    this.documentClickEventListener = this.renderer.listen(
      'document',
      'click',
      (event: MouseEvent) => {
        this.onEscapeKey();        
      }
    );
  }

  protected unsubscribeDocumentClickEventListener() {
    if (!this.documentClickEventListener) return;

    this.documentClickEventListener();
    this.documentClickEventListener = null;
  }

  protected subscribeDocumentKeyDownEventListener() {
    if (this.documentKeyDownEventListener) return;
    this.documentKeyDownEventListener = this.renderer.listen(
      'document',
      'keydown',
      (event: KeyboardEvent) => {
        event.code === 'Escape' && this.onEscapeKey();
      }
    );
  }

  protected unsubscribeDocumentKeyDownEventListener() {
    if (!this.documentKeyDownEventListener) return;

    this.documentKeyDownEventListener();
    this.documentKeyDownEventListener = null;
  }

  //virtual method
  protected onDataListChange(): void {}

  //virtual method
  protected onEscapeKey(event?: KeyboardEvent): void {}
}
