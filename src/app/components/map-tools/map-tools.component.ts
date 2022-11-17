// angular 
import { AfterViewInit, Component, ElementRef, EventEmitter, Output} from '@angular/core';

// third party 
import { defineButtonToggleGroupComponent } from '@tylertech/forge';

@Component({
  selector: 'annotation-map-tools',
  templateUrl: './map-tools.component.html',
  styleUrls: ['./map-tools.component.css']
})
export class MapToolsComponent implements AfterViewInit {

  @Output() setTool = new EventEmitter<string>();
  @Output() saveAnnotation = new EventEmitter();
  @Output() undoLast = new EventEmitter();
  @Output() reset = new EventEmitter();

  constructor(private elementRef:ElementRef) {
    defineButtonToggleGroupComponent();
   }

  ngAfterViewInit(): void {
    window.addEventListener('forge-button-toggle-select', e=>this.handleToolSelect(e));
  }

  ngOnInit(): void {}

  protected undo():void{
    this.undoLast.emit();
  }

  protected clear():void{
    this.reset.emit();
  }

  protected handleSave():void{
    this.saveAnnotation.emit();
  }

  private handleToolSelect(event:Event):void{
    const customEvent=  event as CustomEvent['detail'];
    this.setTool.emit(customEvent.detail.value);
  }
}
