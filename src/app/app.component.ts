import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DropDownComponent } from './drop-down/dropdown.component';
import { DataProviderService } from './data-provider.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, DropDownComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'angular-drop-down';

  constructor(public dataProvider: DataProviderService) {}
}
