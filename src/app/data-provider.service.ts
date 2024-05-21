import { Injectable, OnInit } from '@angular/core';
import { ItemsDataModel } from './drop-down/dropdown.interface';
import { Observable, of } from 'rxjs';
import { jobMockData } from './mock-data';

@Injectable({
  providedIn: 'root'
})
export class DataProviderService {  
  jobData$: Observable<Array<ItemsDataModel>> = of(jobMockData);

  constructor() {}  
}
