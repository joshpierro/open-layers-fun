// angular 
import { AfterViewInit, Component, EventEmitter, OnInit, Output } from '@angular/core';

// third party 
import Map from 'ol/Map';
import { Tile as TileLayer} from 'ol/layer';
import View from 'ol/View';
import { fromLonLat } from 'ol/proj';
import {Draw,Snap,Modify} from 'ol/interaction';
import {Stamen, Vector as VectorSource} from 'ol/source'
import VectorLayer from 'ol/layer/Vector';
import Overlay from 'ol/Overlay';


// app
import { BASEMAP_TYPE, DRAW_LINESTRING, FREEHAND, INITIAL_CENTER, INITIAL_ZOOM, MAP_DIV_ID, DEFAULT_DRAWING_STYLE, MAX_ZOOM, DRAW_POINT, LABEL_STYLE } from 'src/app/constants/app.constants';
import { VectorSourceEvent } from 'ol/source/Vector';
import { Feature } from 'ol';
import { Point } from 'ol/geom';


@Component({
  selector: 'annotation-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, AfterViewInit {

  @Output() annotationGenerated = new EventEmitter();
  map: Map | undefined;
  protected currentAnnotation = '';
  private vectorSource; 
  private drawLayer;
  private mapTiles;
  private drawInteraction: Draw;
  private snapping: Snap;
  private overlay: Overlay;
  private currentFeatureAdded: Feature | any;
  private activeTool = 'Point';

  constructor() { 
    this.vectorSource  = new VectorSource({wrapX: false});
    const styles = [DEFAULT_DRAWING_STYLE, LABEL_STYLE];
    this.drawLayer = new VectorLayer({source: this.vectorSource, style: (f:any) =>{
      LABEL_STYLE.getText()
      .setText(f.annotation)
      return styles;
    }});
    this.mapTiles = new TileLayer({
        source: new Stamen({
          layer: BASEMAP_TYPE,
        }),
      });
    this.drawInteraction = new Draw({source: this.vectorSource,type: DRAW_POINT,freehand: true});
    this.snapping = new Snap({source:this.vectorSource});
    this.overlay = new Overlay({});
  }

  ngAfterViewInit(): void {
   const container = document.getElementById('popup') || undefined;
    this.overlay = new Overlay({
      element: container,
      autoPan: {
        animation: {
          duration: 250,
        },
      },
    });
  }

  ngOnInit(): void {
    this.setUpMap();
    this.setUpDrawLayer();
    this.setupSnapping()
  }
  
  setActiveTool(tool:string):void{
    this.activeTool = tool;
    const toolType = 
    tool === FREEHAND 
    ? 'LineString' 
    : tool as 'Point'| 'LineString' | 'Polygon';
    
    const isFreehand = tool === FREEHAND 
      ? true 
      : false;
    

    this.map?.removeInteraction(this.drawInteraction);

    this.drawInteraction = new Draw({
      source: this.vectorSource,
      type: toolType,
      freehand: isFreehand,
    });
    this.map?.addInteraction(this.drawInteraction);
    this.setupSnapping();
  }

  undoLast():void{
    const features = this.drawLayer.getSource()?.getFeatures() || [];
    if(!features.length){
      return;
    }

    const lastFeature = features[features.length-1];
    this.drawLayer.getSource()?.removeFeature(lastFeature);
  }

  reset():void{
    this.vectorSource.clear();
  }

  getAnnotation():void{
    const mapCanvas = document.createElement('canvas');
    const size = this.map?.getSize() || [0,0];
    mapCanvas.width = size[0];
    mapCanvas.height = size[1];
    const mapContext = mapCanvas.getContext('2d');
    Array.prototype.forEach.call(
      this.map?.getViewport().querySelectorAll('.ol-layer canvas, canvas.ol-layer'),
      function (canvas) {
        if (canvas.width > 0) {
          const opacity =
            canvas.parentNode.style.opacity || canvas.style.opacity;
            //@ts-ignore
          mapContext.globalAlpha = opacity === '' ? 1 : Number(opacity);
          let matrix;
          const transform = canvas.style.transform;
          if (transform) {
            // Get the transform parameters from the style's transform matrix
            matrix = transform
              .match(/^matrix\(([^\(]*)\)$/)[1]
              .split(',')
              .map(Number);
          } else {
            matrix = [
              parseFloat(canvas.style.width) / canvas.width,
              0,
              0,
              parseFloat(canvas.style.height) / canvas.height,
              0,
              0,
            ];
          }
          // Apply the transform to the export map context
          CanvasRenderingContext2D.prototype.setTransform.apply(
            mapContext,
            matrix
          );
          const backgroundColor = canvas.parentNode.style.backgroundColor;
          if (backgroundColor) {
            //@ts-ignore
            mapContext.fillStyle = backgroundColor;
            //@ts-ignore
            mapContext.fillRect(0, 0, canvas.width, canvas.height);
          }
          //@ts-ignore
          mapContext.drawImage(canvas, 0, 0);
        }
      }
    );
    //@ts-ignore
    mapContext.globalAlpha = 1;
    //@ts-ignore
    mapContext.setTransform(1, 0, 0, 1, 0, 0);
   // const link = document.getElementById('image-download');
    //@ts-ignore
    const mapAnnotation  = mapCanvas.toDataURL();
    console.log(mapAnnotation);
    this.annotationGenerated.emit();
   
  
  }

  protected closePopUp():void{
    const closer = document.getElementById('popup-closer');
    closer?.blur;
    this.overlay?.setPosition(undefined);
  }

  protected handleSaveText():void{
      this.currentFeatureAdded.annotation = this.currentAnnotation;
      this.currentAnnotation = '';
      this.closePopUp();
      this.vectorSource.changed();
  };

  private setupSnapping():void {
    this.snapping = new Snap({source:this.vectorSource});
    this.map?.addInteraction(this.snapping);
  }
  private setUpDrawLayer():void {
    this.map?.addInteraction(this.drawInteraction);
    this.vectorSource.on('addfeature',(f:any)=>{
      this.currentFeatureAdded = f.feature;
      if(this.activeTool!=='Point'){return;}
      const geometry = f.feature?.getGeometry();
      this.map?.addOverlay(this.overlay);
     this.overlay?.setPosition(geometry.flatCoordinates);
    });
    const modify = new Modify({source: this.vectorSource});
    this.map?.addInteraction(modify);
  }

  private setUpMap():void {
    this.map = new Map({
      layers: [
        this.mapTiles,
        this.drawLayer
      ],
      target: MAP_DIV_ID,
      view: new View({
        center: fromLonLat(INITIAL_CENTER),
        zoom: INITIAL_ZOOM,
        maxZoom: MAX_ZOOM
      }),
    });


  }

}
