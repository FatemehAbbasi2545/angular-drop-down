import { Component, ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DropDownComponent } from './drop-down/dropdown.component';
import { DataProviderService } from './data-provider.service';
import { FormsModule } from '@angular/forms';
import { DropdownOutputModel } from './drop-down/dropdown.interface';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, DropDownComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  jobKey: number = 15;
  jobTitle: string = '';

  title = 'angular-drop-down';

  constructor(public dataProvider: DataProviderService) {}

  onJobChange(newValue: DropdownOutputModel | null): void {
    if (newValue) {
      this.jobKey = newValue.key as number;
      this.jobTitle = newValue.title as string;
    }    
  }
}
