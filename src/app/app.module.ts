// angular 
import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

// app
import { AppComponent } from './components/app.component';
import { MapComponent } from './components/map/map.component';
import { MapToolsComponent } from './components/map-tools/map-tools.component';


@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    MapToolsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule { }
