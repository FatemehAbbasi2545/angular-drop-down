
import { ChangeDetectorRef, Directive, Input, Renderer2 } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';

@Directive({})
export class UiComponent implements ControlValueAccessor {
  @Input() disabled: boolean = false; 

  get value(): number | string | null {
    return this._value;
  }
  
  set value(value: number | string | null) {
    this._value = value;
  }

  private _value: number | string | null = ''; 

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

  ngAfterWriteValue(): void {}
}

