// angular 
import { Component, ViewChild } from '@angular/core';

// third party 
import { defineButtonComponent, defineBusyIndicatorComponent,IBusyIndicatorComponent, defineTextFieldComponent  } from '@tylertech/forge';

// app 
import { MapComponent } from './map/map.component';
import { BUSY_INDICATOR_MESSAGE, BUSY_INDICATOR_TITLE } from '../constants/app.constants';

@Component({
  selector: 'annotation-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
 @ViewChild('map') map: MapComponent | undefined;
 protected busyIndicator : IBusyIndicatorComponent;

  constructor() {
    defineButtonComponent();
    defineBusyIndicatorComponent();
    defineTextFieldComponent();
    this.busyIndicator = document.createElement('forge-busy-indicator');
  }

  setTool(tool:string):void{
    this.map?.setActiveTool(tool);
  }

  protected undoLast():void{
    this.map?.undoLast();
  }

  protected clear():void{
    this.map?.reset();
  }

  protected saveAnnotation():void {
    const annotatedMap = this.map?.getAnnotation();
    this.showBusyIndicator();
  }
  
  protected handleAnnotation():void{
    this.hideBusyIndicator();
  }

  private showBusyIndicator():void {
    this.busyIndicator.titleText = BUSY_INDICATOR_TITLE;
    this.busyIndicator.message = BUSY_INDICATOR_MESSAGE;
    document.body.appendChild(this.busyIndicator);
  }

  private hideBusyIndicator():void{
    this.busyIndicator.hidden = true;
  }

}
