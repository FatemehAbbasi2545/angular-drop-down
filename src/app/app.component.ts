import { Component, ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DataProviderService } from './data-provider.service';
import { DropDownComponent } from './ui/drop-down/dropdown.component';
import { SelectorOutputData } from './ui/abastraction/selector.interface';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, ReactiveFormsModule, DropDownComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  job: number = 15;
  jobTitle: string = '';

  academicField = new FormControl('');
  academicFieldTitle: string = '';

  title = 'angular-drop-down';

  constructor(public dataProvider: DataProviderService) {}

  onJobChange(newValue: SelectorOutputData | null): void {
    if (newValue) {
      this.jobTitle = newValue.Title as string;      
    }    
  }
  
  onAcademicFieldChange(newValue: SelectorOutputData | null): void {
    if (newValue) {      
      this.academicFieldTitle = newValue.Title as string;      
    }    
  }
}
