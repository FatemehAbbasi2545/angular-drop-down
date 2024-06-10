import { Injectable, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';

import { ListItem } from './ui/abstraction/selector.interface';
import { AcademicFieldMockData, jobMockData } from './mock-data';

@Injectable({
  providedIn: 'root'
})
export class DataProviderService {  
  jobData$: Observable<Array<ListItem>> = of(jobMockData);
  AcademicFieldsData$: Observable<Array<ListItem>> = of(AcademicFieldMockData);

  constructor() {}  
}
