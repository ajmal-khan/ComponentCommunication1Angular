import { Component,
        OnInit,
        ViewChild,
        ElementRef,
        AfterViewInit,
        Input,
        OnChanges,
        SimpleChanges, 
        Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'pm-criteria',
  templateUrl: './criteria.component.html',
  styleUrls: ['./criteria.component.css']
})
export class CriteriaComponent implements OnInit, OnChanges, AfterViewInit {

  @Input() displayDetail: boolean;
  //The parent component needs to pass this information in to this child component
  //as it does not have the information about how many hits occured in the product list.
  @Input() hitCount: number;
  hitMessage: string;
  @Output() valueChange: EventEmitter<string> = new EventEmitter<string>();

  @ViewChild('filterElement') filterElementRef: ElementRef;
  constructor() { }

  private _listFilter: string;
  get listFilter(): string{
    return this._listFilter;
  }
  set listFilter(value: string){
    this._listFilter = value;
    this.valueChange.emit(value);
  }

  ngAfterViewInit(): void {
    if(this.filterElementRef.nativeElement){
      this.filterElementRef.nativeElement.focus();
    }
    /* Problems with usign the nativeElement
    Directly accesses the DOM; Tightly coupled to the browser;
    May not be able to user server-side rendering or web-workers;
    Can pose a security threat, especially if accessing 
    inner html. If these considerations are not relevant to your application, then you 
    can use the ViewChild to access the nativeElemet. */
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    //We check if the hitCount property was changed. changes method is called
    //if any input property is changed. We're interested only in changes in propery hitCount
    //changes are the key:value pair so we use the property name hitCount as key
    if(changes['hitCount'] && !changes['hitCount'].currentValue){
      this.hitMessage = 'No matches found';
    } else {
      this.hitMessage = 'Hits:  ' + this.hitCount;
    }
  }

}
