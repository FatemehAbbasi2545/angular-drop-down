import { ChangeDetectionStrategy, Component, ElementRef, ViewChild, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Observable, of } from 'rxjs';

import { DomUtil } from './../../utils/dom.util';
import { SelectorComponent } from './../abstraction/selector.component';
import { SelectorOutputData, ListItem } from './../abstraction/selector.interface';

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
export class DropDownComponent extends SelectorComponent {
  @ViewChild('input') inputElementRef!: ElementRef;
  @ViewChild('searchText') searchTextElementRef!: ElementRef; 
  @ViewChild('listItems') listItemsElementRef!: ElementRef;

  visibleOptions: Array<ListItem> = [];
  visibleOptions$: Observable<Array<ListItem>> = new Observable;  
  focusedOptionIndex: number = -1;
  lastOptionIndex: number = -1;
  filterValue: string = '';
  overlayVisible = false;  

  override onDataListChange(): void {
    this.visibleOptions = this.listItems;
    if (this.listItems.length > 0) {
      this.lastOptionIndex = this.listItems.length - 1;
    }      
    this.visibleOptions$ = of(this.listItems);
    if (this.value) {
      this.setSelectedItem();
    }
  }

  override onEscapeKey(event?: KeyboardEvent) {
    this.overlayVisible && this.hide();
    event && event.preventDefault();
  }

  onTriggerClick(event: MouseEvent): void {
    if (this.disabled) return;
    if (this.overlayVisible) {
      this.hide();
      return;
    }
    this.show();
    event.preventDefault();
    event.stopPropagation();
  }
  
  onOptionSelect(event: Event, option: ListItem, index: number): void {
    if (!this.isSelected(option)) {
      this.setSelectedItem(option);
      const value = this.getOptionValue(option);
      if (value != null) {
        this.updateModel(value); 
        this.updateDisplayValue(option);
        this.focusedOptionIndex = index;
        this.onModelChange.emit(
          { Key: this.value, Title: this.displayValue, Item: this.selectedItem } as SelectorOutputData
        );
      }                
    }
    this.hide();     
    event.preventDefault();
    event.stopPropagation();
  } 

  onKeyDown(event: KeyboardEvent, pressedInInput = false): void {
    if (this.disabled) return;  

    switch (event.code) {
      case 'Enter':
      case 'NumpadEnter':
        this.onEnterKey(event, pressedInInput);
        break;

      case 'ArrowDown':
        this.onArrowDownKey(event, pressedInInput);
        break;

      case 'ArrowUp':
        this.onArrowUpKey(event, pressedInInput);
        break; 

      case 'Home':
        this.onHomeKey(event, pressedInInput);
        break;

      case 'End':
        this.onEndKey(event, pressedInInput);
        break;

      case 'PageDown':
        this.onPageDownKey(event, pressedInInput);
        break;

      case 'PageUp':
        this.onPageUpKey(event, pressedInInput);
        break;

      case 'Escape':
        this.onEscapeKey(event);
        break;       
    }
  }

  onInputKeyDown(event: KeyboardEvent): void {
    if (this.disabled) return;  

    switch (event.code) {
      case 'Tab':
        this.onEscapeKey(event);
        break; 
        
      case 'Delete':
        this.onDeleteKey(event);
        break;
    }

    this.onKeyDown(event, true);
  }

  onSearchInputKeyDown(event: KeyboardEvent): void {
    this.onKeyDown(event, false);
  }

  onInputChange(event: Event): void {
    if (this.disabled) return;

    let targetValue: string = (event.target as HTMLInputElement).value;
    const option = this.listItems.find((x) => {
      const displayValue = this.getOptionDisplayValue(x);
      return displayValue && displayValue.toString().toLowerCase() === targetValue.toLowerCase();
    });

    if (option) {
      const index = this.visibleOptions.indexOf(option);
      this.onOptionSelect(event, option, index);
    }        
  }

  onSearchInputChange(event: Event): void {
    let value: string = (event.target as HTMLInputElement).value;
    this.visibleOptions = this.listItems.filter((x) => {
      const displayValue = this.getOptionDisplayValue(x);
      return displayValue && displayValue.toString().toLowerCase().includes(value.toLowerCase());
    });
    if (this.visibleOptions.length > 0) {
      this.lastOptionIndex = this.visibleOptions.length - 1;
    }
    this.visibleOptions$ = of(this.visibleOptions);
    this.filterValue = value;
    this.focusedOptionIndex = -1;
    this.changeDetector.markForCheck();
  }

  private show(): void {
    if (this.overlayVisible || this.disabled) return;
    this.overlayVisible = true;      
    this.subscribeDocumentClickEventListener();
    this.subscribeDocumentKeyDownEventListener();
    this.inputElementRef?.nativeElement.focus(); 
    if (this.selectedItem) {
      this.focusedOptionIndex = this.visibleOptions.indexOf(this.selectedItem);
    }            
    this.changeDetector.markForCheck();
  }

  private hide(): void {
    if (!this.overlayVisible || this.disabled) return;
    this.overlayVisible = false;
    this.focusedOptionIndex = -1;
    this.unsubscribeDocumentClickEventListener();
    this.unsubscribeDocumentKeyDownEventListener();
    this.changeDetector.markForCheck();  
    this.onTouche();
  }

  private onEnterKey(event: KeyboardEvent, pressedInInput: boolean): void {    
    if (pressedInInput) {
      if (!this.overlayVisible) {
        this.onArrowDownKey(event, true);
      } else {
        this.hide();
      }
    } else if (this.overlayVisible && this.focusedOptionIndex !== -1) {   
      const option = this.visibleOptions[this.focusedOptionIndex];
      this.onOptionSelect(event, option, this.focusedOptionIndex);    
    }    
        
    event.preventDefault();
  }

  private onArrowDownKey(event: KeyboardEvent, pressedInInput = false) {
    if (!this.overlayVisible) {
      this.show();
    } else {
      if (pressedInInput) {
        this.searchTextElementRef?.nativeElement.focus();
      } else {              
        const optionIndex = this.focusedOptionIndex !== -1 ? this.findNextOptionIndex(this.focusedOptionIndex) : 0;
        this.changeFocusedOptionIndex(optionIndex); 
      }      
    } 

    event.preventDefault();
    event.stopPropagation();
  } 

  private onArrowUpKey(event: KeyboardEvent, pressedInInput = false) {
    if (this.overlayVisible && !pressedInInput) {
      const optionIndex = this.focusedOptionIndex !== -1 ? this.findPrevOptionIndex(this.focusedOptionIndex) : this.lastOptionIndex;
      this.changeFocusedOptionIndex(optionIndex);          
    }

    event.preventDefault();
    event.stopPropagation();
  }

  private onHomeKey(event: KeyboardEvent, pressedInInput = false) {
    if (this.overlayVisible && !pressedInInput) {
      this.changeFocusedOptionIndex(0);
    }
    event.preventDefault();
    event.stopPropagation();
  } 
  
  private onEndKey(event: KeyboardEvent, pressedInInput = false) {
    if (this.overlayVisible && !pressedInInput) {
      this.changeFocusedOptionIndex(this.lastOptionIndex);
    }
    event.preventDefault();
    event.stopPropagation();
  } 

  private onPageDownKey(event: KeyboardEvent, pressedInInput = false) {
    if (this.overlayVisible && !pressedInInput) {
      let optionIndex = this.focusedOptionIndex;
      if (optionIndex === -1) {
        optionIndex = 4;
        if (optionIndex > this.lastOptionIndex) {
          optionIndex = this.lastOptionIndex;
        }
      } else {
        if (optionIndex < this.lastOptionIndex) {
          optionIndex = optionIndex + 4;
          if (optionIndex >= this.lastOptionIndex) {
            optionIndex = this.lastOptionIndex;
          }
        } else {
          optionIndex = this.lastOptionIndex;
        }
      }
      this.changeFocusedOptionIndex(optionIndex);      
    }
    event.preventDefault();
    event.stopPropagation();
  }

  private onPageUpKey(event: KeyboardEvent, pressedInInput = false) {
    if (this.overlayVisible && !pressedInInput) {
      let optionIndex = this.focusedOptionIndex;
      if (optionIndex > 0) {
        optionIndex = optionIndex - 4;
        if (optionIndex <= 0) {
          optionIndex = 0;
        }
      } else {
        optionIndex = 0
      }
      this.changeFocusedOptionIndex(optionIndex);
    }
    event.preventDefault();
    event.stopPropagation();
  }  

  private onDeleteKey(event: KeyboardEvent) {
    this.clear();
    this.overlayVisible && this.hide();  
    event.preventDefault();
    event.stopPropagation();         
  }

  private findNextOptionIndex(index: number) {
    return index < this.lastOptionIndex ? index + 1 : 0;
  }
  
  private findPrevOptionIndex(index: number) {
    return index > 0 ? index - 1 : this.lastOptionIndex;
  }

  private changeFocusedOptionIndex(index: number) {
    if (this.focusedOptionIndex !== index) {
        this.focusedOptionIndex = index;
        this.scrollInView(index);
    }
  }

  private scrollInView(index: number = -1) {
    if (index === -1) return;
    if (this.listItemsElementRef && this.listItemsElementRef.nativeElement) {
      const element = DomUtil.findSingle(this.listItemsElementRef.nativeElement, `li[id="${index}"]`);
      if (element) {        
          element.scrollIntoView && element.scrollIntoView({ block: 'nearest', inline: 'nearest' });
      }
    }
  }    
}
