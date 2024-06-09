import { Injectable, OnInit } from '@angular/core';
import { ListItemModel } from './ui/model/ui.interface';
import { Observable, of } from 'rxjs';
import { AcademicFieldMockData, jobMockData } from './mock-data';

@Injectable({
  providedIn: 'root'
})
export class DataProviderService {  
  jobData$: Observable<Array<ListItemModel>> = of(jobMockData);
  AcademicFieldsData$: Observable<Array<ListItemModel>> = of(AcademicFieldMockData);

  constructor() {}  
}
